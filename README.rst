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