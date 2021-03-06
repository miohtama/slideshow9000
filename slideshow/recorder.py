"""

    Record a video using Selenium + <canvas> toDataURI
    

"""
import traceback
import urlparse
import datetime
import os
import sys
import subprocess
import time
import base64
import json
import tempfile
import urllib
import urllib2

from cStringIO import StringIO

from PIL import Image

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys

# TODO: change perhaps?
TMP_PATH = os.path.dirname(os.path.dirname(__file__))

class Recorder(object):
    # The recording speed
    FRAMES_PER_SECOND = 30.0

    # Selenium instance
    browser = None

    # Output FIFO handle used for saving
    stream = None

    # music file
    music = 'josh.ogg'

    # the encoder process
    encoder = None

    # the xvfb process
    xvfb = None

    # maximum length of recording in seconds
    max_length = 10

    # the pingback url
    pingback = None

    def __init__(self):
        pass

    def start_encoding_process(self):
        blocksize = self.width * self.height * 4
        self.encoder = subprocess.Popen([
            'gst-launch-0.10',
            'filesrc',
            'location=' + self.fifo_path,
            'blocksize=' + str(blocksize),
            '!',
            'video/x-raw-rgb,bpp=32,endianness=4321,depth=24,red_mask=-16777216,green_mask=16711680,blue_mask=65280,width=%d,height=%d,framerate=%d/1'
                % (self.width, self.height, int(self.FRAMES_PER_SECOND)),
            '!',
            'queue',
            '!',
            'ffmpegcolorspace',
            '!',
            'videorate',
            '!',
            'x264enc',
            'profile=baseline',
            '!',
            'mux.',
            'filesrc',
            'location=' + self.music,
            '!',
            'decodebin',
            '!',
            'audiorate',
            '!',	 
            'audioconvert',
            '!' ,
            'faac',
            '!',
            'mux.',
            'mp4mux',
            'name=mux',
            '!',
            'filesink',
            'location=' + self.output
        ], stdout=sys.stdout, stderr=sys.stderr)

    def check_ready(self):
        """ 
        Interacting with Javascript 
        
        http://stackoverflow.com/questions/5585343/getting-the-return-value-of-javascript-code-in-selenium
        """
        val = self.browser.execute_script("return window.recorder.isReady()")
        return bool(val)
    
    def set_filename(self, filename):
        filename = os.path.abspath(filename)
        self.browser.execute_script("window.recorder.setOutputFilename(%s)" %
            json.dumps(filename))
    
    def check_done(self):
        """ 
        Interacting with Javascript 
        
        http://stackoverflow.com/questions/5585343/getting-the-return-value-of-javascript-code-in-selenium
        """
        return bool(self.browser.execute_script("return window.recorder.isDone()"))
    
    def prepare_frame(self, clock):
        """
        Render one video frame at a given moment.
        """
        # Rember to convert to milliseconds
        clock *= 1000
        val = self.browser.execute_script("return window.recorder.prepareFrame(%f);" % clock)
        return val

    def get_resolution(self):
        res = self.browser.execute_script("return window.recorder.getResolution();")
        self.width = int(res['width'])
        self.height = int(res['height'])
        
	assert self.width % 8 == 0, "Width is not divisible by 8"
	assert self.height % 8 == 0, "Height is not divisible by 8"
	return self.width, self.height

    def grab_frame(self):
        self.browser.execute_script("window.recorder.grabFrame();")

    def create_fifo(self):
        self.fifo_path = os.path.join(self.temp_dir, 'encoding_fifo')
        os.mkfifo(self.fifo_path)
        return self.fifo_path

    def close_stream(self):
        self.browser.execute_script("window.recorder.closeStream();");

    def get_pingback(self):
        rv = self.browser.execute_script("return (window.recorder.getPingbackUri && window.recorder.getPingbackUri()) || null;")
        if not rv:
            return None
 
        return rv

    def send_pingback(self):
        location = 'file://' + self.output
        values = { 'location' : location }
        
        data = urllib.urlencode(values)
        req = urllib2.Request(location, data)
        response = urllib2.urlopen(req)
        response.read()

    def do_encode(self, source_uri, target_file):
        print "Starting Xvfb at :5"
        self.xvfb = subprocess.Popen(["Xvfb", ":5", "-screen", "0", "1024x768x24"])
        
	os.environ['DISPLAY'] = ':5'
        
        self.output = target_file
        self.create_fifo()

        profile = webdriver.firefox.firefox_profile.FirefoxProfile()

        parsed = urlparse.urlparse(source_uri)
        host_base = "%s://%s" % (parsed.scheme, parsed.netloc)

        print "Enabling XPCOM for codebase", host_base

        set_pref = profile.set_preference
        set_pref("signed.applets.codebase_principal_support",    True)
        set_pref("capability.principal.codebase.p0.granted",     "UniversalXPConnect");
        set_pref("capability.principal.codebase.p0.id",          host_base);
        set_pref("capability.principal.codebase.p0.subjectName", "");

        self.browser = webdriver.Firefox(firefox_profile=profile)
        self.browser.get(source_uri) # Load page

        assert "Slideshow Recorder" in self.browser.title
 
        print "Preparing media assets"
        while not self.check_ready():
            time.sleep(1)

        self.get_resolution()
        print "Resolution %dx%d" % (self.width, self.height)

        print "Getting pingback URI"
        self.pingback = self.get_pingback()

        if self.pingback:
            print "Got pingback URI", self.pingback
        else:
            print "Alert, no pingback URI given!"
    
        print "Starting encoder"
        self.start_encoding_process()

        # Assume we are running Pyramid on localhost
	print "Setting Javascript output path to", self.set_filename(self.fifo_path)
        self.set_filename(self.fifo_path)

        print "Starting recording loop"
        clock = 0.0
 
        while not self.check_done():
            clock += (1.0 / self.FRAMES_PER_SECOND)
            print "Rendering frame: %f" % clock
            self.prepare_frame(clock)
            self.grab_frame()
            if clock > self.max_length:
                break
        
        self.close_stream()

    def encode(self, source_uri):
        self.temp_dir = tempfile.mkdtemp(dir=TMP_PATH)
        output_file = os.path.join(self.temp_dir, "out.mp4")

        def timeprint(msg):
            now = datetime.datetime.now().isoformat(' ') 
            print "[%s] %s" % (now, msg)

        start = time.time()
        timeprint("Starting recording")
        try:
            success = True
            self.do_encode(source_uri, output_file)

        except Exception, e:
            traceback.print_exc()
            success = False

        if self.browser:
            timeprint("Shutting down browser")
            self.browser.close()

        if self.encoder:
            timeprint("Waiting for encoder to finish")
            rc = self.encoder.wait()
            timeprint("Encoder exited with code %d - exciting!" % rc)

        if self.xvfb:
            self.xvfb.terminate()
        
        if self.pingback:
            self.send_pingback()

        now = datetime.datetime.now().isoformat(' ') 
        delta = time.time() - start
        timeprint("Encoding ended - time %f seconds" % delta)

if __name__ == '__main__':
    recorder = Recorder()
    recorder.encode(sys.argv[1])
