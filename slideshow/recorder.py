"""

    Record a video using Selenium + <canvas> toDataURI
    

"""

import os
import sys
import subprocess
import time
import base64
import json
import tempfile

from cStringIO import StringIO

from PIL import Image

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys

class Recorder(object):
    # The recording speed
    FRAMES_PER_SECOND = 30.0

    # Selenium instance
    browser = None

    # Output FIFO handle used for saving
    stream = None

    def __init__(self):
        self.webserv = subprocess.Popen(["paster", "serve", "development.ini"], stdout=sys.stdout)

    def start_encoding_process(self):
        music = 'josh.ogg'
        blocksize = self.width * self.height * 4
        fps = 30
        self.encoder = subprocess.Popen([
            'gst-launch-0.10',
            'filesrc',
            'location=' + self.fifo_path,
            'blocksize=' + str(blocksize),
            '!',
            'video/x-raw-rgb,bpp=32,endianness=4321,depth=24,red_mask=16711680,green_mask=65280,blue_mask=255,width=%d,height=%d,framerate=%d/1'
                % (self.width, self.height, fps),
            '!',
            'ffmpegcolorspace',
            '!',
            'queue',
            '!',
            'videorate',
            '!',
            'x264enc',
            'profile=baseline',
            '!',
            'mux.',
            'filesrc',
            'location=' + music,
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
        val = self.browser.execute_script("return window.recorder.prepareFrame(%f)" % clock)
        return val

    def get_resolution(self):
        res = self.browser.execute_script("return window.recorder.getResolution()")
        self.width = int(res['width'])
        self.height = int(res['height'])
        return self.width, self.height

    def grab_frame(self):
        self.browser.execute_script("window.recorder.grabFrame()")

    def create_fifo(self):
        self.temp_dir = tempfile.mkdtemp()
        self.fifo_path = os.path.join(self.temp_dir, 'encoding_fifo')
        os.mkfifo(self.fifo_path)
        return self.fifo_path

    def do_encode(self, output):
        self.output = output
        self.create_fifo()

        profile = webdriver.firefox.firefox_profile.FirefoxProfile()

        set_pref = profile.set_preference
        set_pref("signed.applets.codebase_principal_support",    True)
        set_pref("capability.principal.codebase.p0.granted",     "UniversalXPConnect");
        set_pref("capability.principal.codebase.p0.id",          "http://localhost:6543");
        set_pref("capability.principal.codebase.p0.subjectName", "");

        self.browser = webdriver.Firefox(firefox_profile=profile)
        self.browser.get("http://localhost:6543/recorder") # Load page

        assert "Slideshow Recorder" in self.browser.title
 
        print "Preparing media assets"
        while not self.check_ready():
            time.sleep(1)

        self.get_resolution()
        print "Resolution %dx%d" % (self.width, self.height)
        # Opening FIFO for writing
        # stream = open(sys.argv[1], "wb")
    
        print "Starting encoder"
        self.start_encoding_process()


        # Assume we are running Pyramid on localhost
	print "Setting Javascript output path"
        self.set_filename(self.fifo_path)

        print "Starting recording loop"
        clock = 0.0
 
        while not self.check_done():
            clock += (1.0 / self.FRAMES_PER_SECOND)
            print "Rendering frame: %f" % clock
            self.prepare_frame(clock)
            self.grab_frame()

    def encode(self, output_file):
        print "Winding up Firefox for recording. Press CTRL+C to abort"
        try:
            self.do_encode(output_file)

        finally:
            print "Shutting down webserver"
            self.webserv.terminate();
    
        if self.browser:
            print "Shutting down browser"
            self.browser.close()

if __name__ == '__main__':
    recorder = Recorder()
    recorder.encode(sys.argv[1])
