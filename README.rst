Bootstrapping
-----------------

* Create virtualenv and install Pyramid

::
    
    easy_install virtualenv
    virtualenv pyramid
    source pyramid/bin/activate
    easy_install Pyramid==1.0
    easy_install mutagen==1.20
    
* Run project

::

    source pyramid/bin/activate
    cd slideshow
    python setup.py develop
    paste server development.ini
    
    
Browser to the development server

::

    http://127.0.0.1:6543/


Music
-------

Out of the box music CC Licensed 

* http://www.jamendo.com/en/artist/Emerald_Park

* http://www.jamendo.com/en/artist/manguer

Adding your own songs
==========================

Drop in your MP3 files in ``music`` folder.

You need pyecho API key

*   

Rerun ``beatme.py`` to generate beat data as JSON::

    export PYECHO_BLAA_BLAA=""
    python beatme.py    


Videos
----------

* http://www.motionshare.com/free-videos/viewvideo/81/ambient-colour-backgrounds/enthroned-forever-slide-sd/Page-1.html

Sources
--------

* https://github.com/jquery/jquery-mobile

Tools
-------

* ffmpeg2theora http://v2v.cc/~j/ffmpeg2theora/download.html