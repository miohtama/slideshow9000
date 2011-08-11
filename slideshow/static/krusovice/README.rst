
Introduction
-------------

Krusovice is a high quality HTML5 rhytmic photo show creator
which you can integrate to your website.


Data formats
--------------

Animation types
==================

Animation: one of 

* *in*: appearing show element

* *out*: fading out show element

* *screen*: currently primary element being shown

Timeline input element
=============================

Describe photo or text we want to have placed
on a timeline.

Input::

        {
                
                showElements,
                rhytmData,
                settings,
                transitionEffectIds,
                onScreenEffectIds,                        
        }

Show elements:

        {
                id,
                
                type : "image" | "text"
                                               
                label,
                
                text,
                
                duration,
                
                imageId,        
        }     
                
Rhytm data::

        { // Echo nest API output }
        
        
Match data (how to match transitions to rhytm)::
        
        {
                type : "beat",
                window : 5.0 // Search window in seconds (to future)
        
        }

Settings::

        {
                //  Where we start to sync with rhytm data
                musicStartTime : 0, 
                
                transitionIn : {
                        type : "",
                        duration : 2.0,                                                
                },
                
                transitionOut : {
                        type : "",
                        duration : 2.0,          
                        clockSkip : 0.0 // How many seconds we adjust the next object coming to the screen
                }   
                
                onScreen : {
                        type : "",
                        duration : 2.0,
                }                                
        }       
                

Effects:

        {
                type : "",
                easing : "",
                duration : 5,                
                position : [ [0,0,0], [0,0,0] ]
                rotations : [ [0,0,0,0], [0,0,0,0] }
                opacity : [ 0, 0 ],
                                                
        }

Generated timeline objects::

        {
                id,
                
                wakeUpTime : 0.0,
                
                transitionIn : { ... }                
                onScreen : { ... }
                transitionOut : { }        
                      
        }

        
Plan Data (internal to Plan object):
        [ show object 1, show object 2, .... ]
        
Unit tests
------------

JS-test-driver command line
=============================

* http://code.google.com/p/js-test-driver/wiki/GettingStarted

::

        wget http://js-test-driver.googlecode.com/files/JsTestDriver-1.3.2.jar
        java -jar JsTestDriver-1.3.2.jar --port 9876
        
Then visit

        http://localhost:9876
        
Leave the browser running. Put the job JsTestDriver on background.

Now trigger a test run::

        java -jar JsTestDriver-1.3.2.jar --tests all
                         

Eclipse plug-in
=============================

Intall plug-in

* http://code.google.com/p/js-test-driver/wiki/UsingTheEclipsePlugin

.. warning

        Only version 1.1.1.e or later works. Don't pick
        version 1.1.1.c.
        
* http://code.google.com/p/js-test-driver/issues/detail?id=214       

*Run Configurations...* -> for JSTest. Select a .conf file from the project root.
Don't run it yet, just save.

Open view *Javascript* > *JsTestDriver*.

Click *Play* to start test runner server.
Now JsTsetDriver view shows "capture" URL - go there with your browser(s).

The test machinery has now been set-up.
Now you can run tests, or leave on checkbox in the run configuration *Run on Save*.

More about asserts

* http://code.google.com/p/js-test-driver/source/browse/trunk/JsTestDriver/src/com/google/jstestdriver/javascript/Asserts.js
