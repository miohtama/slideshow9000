
Introduction
-------------

Krusovice is a high quality HTML5 rhytmic photo show creator
which you can integrate to your website.



Data formats
--------------

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

JS-test-driver

* 

Eclipse plug-in

* http://code.google.com/p/js-test-driver/wiki/UsingTheEclipsePlugin