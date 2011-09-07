Bootstrapping
-----------------

* Create virtualenv and install Pyramid

::
    
    easy_install virtualenv
    virtualenv pyramid
    source pyramid/bin/activate
    easy_install Pyramid==1.0
    
* Run project

::

    source pyramid/bin/activate
    cd slideshow
    python setup.py develop
    paste server development.ini
    
    
Browser to the development server

::

    http://127.0.0.1:6543/

Production run
---------------------------------

Log in as ``slideshow`` user and start WSGI server through screen::

    script /dev/null # enable screen under sudo
    screen -x
    source ~/pyramid/bin/activate
    paster serve production.ini

Install Echo Nest Remix 
-------------------------------

Echo Nest Remix API works by uploading data to Echo Nest servers for audio analysis.
First MP3 is decoded with ffmpeg and then raw data is uploaded(?).

Needed for beat analysis. You need have ffmpeg development files installed::

    # TODO - don't know what do here 
    # Try Medibuntu repos?
    
Then install Echo Nest remix API:    

::

    source pyramid/bin/activate
    svn checkout http://echo-nest-remix.googlecode.com/svn/trunk/ echo-nest-remix
    cd echo-nest-remix
    # Apparently this puts some crap to /usr/local and /usr/local/bin 
    sudo python setup.py install
    sudo ln -s `which ffmpeg` /usr/local/bin/en-ffmpeg

Install Selenium
--------------------------------------

Selenium is used for frame recording by remote controlling a Firefox browser which connects to localhost running Pyramid.

::

    source pyramid/bin/activate    
    wget http://selenium.googlecode.com/files/selenium-server-standalone-2.0rc2.jar
    easy_install selenium
    
Install PIL
--------------

::

    source pyramid/bin/activate    
    easy_install http://dist.repoze.org/PIL-1.1.6.tar.gz    
    
Recording a video
-----------------------------------------

Run Selenium in a recording mode.

This will 

* Spawn Pyramid server on localhost:6543

* Open a Selenium driven Firefox on /recorder on the server

* Control the execution of the Javascript on the page, make yield each animation frame individually

* Encode frames to base64 PNG data URIs

* Feed frames from Firefox to Python process through Selenium (using strings)

* Decode frames in Python

* Save decoded frames as RGB raw data to a stream (/tmp/data.raw)

::

    source pyramid/bin/activate
    python slideshow/recoder.py /tmp/data.raw # Will start Firefox + Pyramid  and output frame data to this file
       

Then you can encode this::

    gst-launch-0.10 filesrc location=../work/mixsnap/foo.raw blocksize=918528 ! \
        'video/x-raw-rgb,bpp=24,endianness=4321,depth=24,red_mask=16711680,green_mask=65280,blue_mask=255,width=736,height=416,framerate=30/1' !\
         ffmpegcolorspace ! videorate ! x264enc profile=baseline ! mux. \
         filesrc location=josh.ogg ! decodebin ! audiorate ! audioconvert ! faac ! mux. \
         mp4mux name=mux ! filesink location=foo.mp4

Music
-------

Out of the box music CC Licensed 

* http://www.jamendo.com/en/artist/Emerald_Park

* http://www.jamendo.com/en/artist/manguer

Adding your own songs
==========================

Drop in your MP3 files in ``music`` folder.

You need Echo Nest API key

* http://developer.echonest.com/

Rerun ``beatme.py`` to generate beat data as JSON::

    # NOT A REAL KEY
    export ECHO_NEST_API_KEY=DH2I0GRG9VSVPDH 
    python beatme.py    


Videos
----------

* http://www.motionshare.com/free-videos/viewvideo/81/ambient-colour-backgrounds/enthroned-forever-slide-sd/Page-1.html

Sources
--------

* http://oksoclap.com/canvasoptimizations

* http://echo-nest-remix.googlecode.com/svn/trunk/apidocs/index.html

* http://lindsay.at/work/remix/overview.html

* http://code.google.com/p/echo-nest-remix/

* https://github.com/jquery/jquery-mobile

Tools
-------

* http://www.online-convert.com/result/13bdb358a38f203f74217281f9711a1d

* ffmpeg2theora http://v2v.cc/~j/ffmpeg2theora/download.html

* GStreamer: install these:

    gstreamer0.10-ffmpeg
    gstreamer0.10-fluendo-mp3
    gstreamer0.10-gnonlin
    gstreamer0.10-nice
    gstreamer0.10-plugins-bad
    gstreamer0.10-plugins-bad-multi
    gstreamer0.10-plugins-base
    gstreamer0.10-plugins-base-apps
    gstreamer0.10-plugins-good
    gstreamer0.10-plugins-ugly
    gstreamer0.10-plugins-ugly-mult
    gstreamer0.10-pulseaudio
    gstreamer0.10-tools
    gstreamer0.10-x

