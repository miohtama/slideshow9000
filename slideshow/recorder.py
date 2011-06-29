"""

    Record a video using Selenium + <canvas> toDataURI

"""

import sys
import subprocess
import time

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys

# The recording speed
FRAMES_PER_SECOND = 30.0

# Start Pyramid
webserv = subprocess.Popen(["paster", "serve", "development.ini"], stdout=sys.stdout)

# Selenium instance
browser = None

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
        

print "Winding up Firefox for recording. Press CTRL+C to abort"


try:
    browser = webdriver.Firefox() # Get local session of firefox
    
    # Assume we are running Pyramid on localhost
    browser.get("http://localhost:6543/recorder") # Load page
    assert "Slideshow Recorder" in browser.title
    
           
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
        frame = grab_frame()
        print "Got frame data:" + str(len(frame))

    
finally:
    print "Shutting down webserver"
    webserv.terminate();
    
    if browser is not None:
        print "Shutting down browser"
        browser.close()
        
        