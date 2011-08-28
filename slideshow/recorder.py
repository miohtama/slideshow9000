"""

    Record a video using Selenium + <canvas> toDataURI
    

"""

import sys
import subprocess
import time
import base64
from cStringIO import StringIO

from PIL import Image

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys



# The recording speed
FRAMES_PER_SECOND = 30.0

# Start Pyramid
webserv = subprocess.Popen(["paster", "serve", "development.ini"], stdout=sys.stdout)

# Selenium instance
browser = None

# Output FIFO handle used for saving
stream = None

written = 0

def check_ready():
    """ 
    Interacting with Javascript 
    
    http://stackoverflow.com/questions/5585343/getting-the-return-value-of-javascript-code-in-selenium
    """
    val = browser.execute_script("return window.recorder.isReady()")
    return val == True
       

def check_done():
    """ 
    Interacting with Javascript 
    
    http://stackoverflow.com/questions/5585343/getting-the-return-value-of-javascript-code-in-selenium
    """
    val = browser.execute_script("return window.recorder.isDone()")
    return val == True

def prepare_frame(clock):
    """
    Render one video frame at a given moment.
    """
    # Rember to convert to milliseconds
    clock *= 1000
    val = browser.execute_script("return window.recorder.prepareFrame(" + str(clock) + ")")
    return val

def grab_frame():
    """
    Render one video frame at a given moment.
    """
    val = browser.execute_script("return window.recorder.grabFrame()")
    return val

def decode_data_uri(data_uri):
    """
    Return raw bytes payload of data_uri     
    """        
    
    global stream, written
    
    print "Got frame data:" + str(len(data_uri))
    
    print "Data URI header:" + data_uri[0:40]

    # u'data:image/png;base64,iVBORw0KGgoA
    header_len = data_uri.find(",")
    payload = data_uri[header_len+1:]
    
    binary = base64.b64decode(payload)
    
    print "Binary id:" + binary[0:4]
    io = StringIO(binary)
    
    img = Image.open(io)
    
    raw = img.tostring("raw", "RGB")
    
    stream.write(raw)
    
    written += len(raw)
    
print "Winding up Firefox for recording. Press CTRL+C to abort"

try:
    profile = webdriver.firefox.firefox_profile.FirefoxProfile()

    set_pref = profile.set_preference
    set_pref("signed.applets.codebase_principal_support",    True)
    set_pref("capability.principal.codebase.p0.granted",     "UniversalXPConnect");
    set_pref("capability.principal.codebase.p0.id",          "http://localhost:6543");
    set_pref("capability.principal.codebase.p0.subjectName", "");

    browser = webdriver.Firefox(firefox_profile=profile)

    # Assume we are running Pyramid on localhost
    browser.get("http://localhost:6543/recorder") # Load page
    assert "Slideshow Recorder" in browser.title
    
    # Opening FIFO for writing
    stream = open(sys.argv[1], "wb")
    
    # Wait media assets to load
    print "Preparing media assets"
    while not check_ready():
        time.sleep(1)
    
    # Start recording loop
    print "Starting recording loop"
    
    clock = 0.0

    while not check_done():
        clock += (1.0 / FRAMES_PER_SECOND)
        print "Rendering frame:" + str(clock)
        prepare_frame(clock)
        # Let UI loop execute 
        # TODO: how to determine when FF has done rendering
        #time.sleep(0.01)
        data_uri = grab_frame()
        
        data = decode_data_uri(data_uri)
        
        print "Wrote frame:" + str(clock) +" total written:" + str(written/ 1000000 ) + "M"
    
finally:
    print "Shutting down webserver"
    webserv.terminate();
    
    if browser is not None:
        print "Shutting down browser"
        browser.close()
        
        
