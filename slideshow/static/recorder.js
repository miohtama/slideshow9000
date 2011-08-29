/**
 * Selenium recorder for video playback
 * 
 * Interact with Selenium driver to capture frames one by one
 * 
 */

var UseXPCOM = function(f) {
    return function() {
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        return f.apply(this, arguments);
    };
};

// A Crockford style power constructor
var newConstructor = function(extend, initializer, methods) {
    var prototype = Object.create(extend && extend.prototype);

    if (methods) {
        Object.keys(methods).forEach(function (key) {
            prototype[key] = methods[key];
        });
    }

    var func = function () {
        var that = Object.create(prototype);
        if (typeof initializer === 'function') {
            initializer.apply(that, arguments);
        }
        return that;
    };

    func.prototype = prototype;
    prototype.constructor = func;
    return func;
};


var Recorder = newConstructor(
    Object,
    function() {
        // Loading flags of async media content
        this.imagesLoaded = this.videosLoaded = this.musicDataLoaded = false;
        
        // The output filename
        this.outputFilename = null;
    },
    {
        init : function() {
            slideshow.init();
            // No timed evenst, honour recording clock
            slideshow.prepareTick = function () {};
            // Audio is mixed in afterwards
            slideshow.player = null;
        },

        /**
         * Set output filename; called from recorder.py to set the absolute
         * path where to record the raw video. Creates the file if it does not
         * exist already
         */
        setOutputFilename : UseXPCOM(function(filename) {
            this.outputFilename = filename;
            this.outputFile = Components.classes["@mozilla.org/file/local;1"].
    	            createInstance(Components.interfaces.nsILocalFile);
    	
            this.outputFile.initWithPath(filename);
    
            stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"].
    	             createInstance(Components.interfaces.nsIFileOutputStream);
    
            // PR_WRONLY + PR_CREATE_FILE + PR_APPEND, default mode, no behaviour flags
            stream.init(this.outputFile, 0x02 | 0x08 | 0x10, -1, 0); 
            this.stream = Components.classes["@mozilla.org/binaryoutputstream;1"].
                createInstance(Components.interfaces.nsIBinaryOutputStream);
    	
            this.stream.setOutputStream(stream);
        }),
    
        /**
         * Delegate to the slideshow master
         */
        loadSong : function(song) {
            var self = this;
            
            function callback() {
                self.onSongComplete();
            }
            
            slideshow.loadSong(song, callback);
        },
        
        /**
         * Monket-patch slideshow to use pre-given image set
         */
        loadImages : function(images) {
            var imagesLoaded = 0;
            var self = this;
            
            // slideshow.getImages = getImages;
            images.forEach(function(url) {
                $("#image-list").append("<li><img src=" + url +" /></li>");
                $("#image-list li:last-child img").load(function() {
                   imagesLoaded++;
                   console.log("Images loaded:" + imagesLoaded);
                   if(imagesLoaded >= images.length) {
                       self.onImagesComplete();
                   } 
                });
            })        
        },
        
        /**
         * Can be called internally or via selenium
         */
        isReady : function() {
           if(this.imagesLoaded && this.musicDataLoaded) {
               return true;
           }
            
           return false;
        },
        
        /**
         * Has the animation been recorded
         */
        isDone : function() {
            return false;
        },
        
        /**
         * Have we preloaded media assets needed for recording
         */
        checkReady : function() {
           console.log("checkReady: Images loaded:" + this.imagesLoaded + " music data:" +  this.musicDataLoaded);
           if(this.isReady()) {
               this.start();
           }
        },
        
        onImagesComplete : function() {
            this.imagesLoaded = true;
            this.checkReady();
        },
    
        onSongComplete : function() {
            this.musicDataLoaded = true;
            this.checkReady();
        },
        
        /**
         * Do tick-by-hand
         */
        nextTick : function() {
            console.log("Manual tick:" + slideshow.clock + " " + slideshow.play);               
            slideshow.tick();        
            //setTimeout(timeout, 100);        
        },
    
        /**
         * Prepare manual event loop
         */
        start : function() {
            if (slideshow.analysis == null) {
                throw "still needs beat data";
            }
                         
            slideshow.onClock(0);                       
            slideshow.prepareCanvasAssets(true);
        },
      
        setClock : function(clock) {
            slideshow.onClock(clock);
        },
        
        grabFrame : UseXPCOM(function() {
            var canvas = slideshow.canvas;
            
            var ctx = slideshow.ctx;
            var imageData = ctx.getImageData(0, 0, slideshow.width, slideshow.height);
            var data = imageData.data;
            // var data = canvas.toDataURL();
    
            console.log("got another write");
            var byteArray = [];
            var dl = data.length;
            var f = String.fromCharCode;
            var byteString = new String('');
            for (var i = 0; i < dl; i++) {
                byteString = byteString.concat(f(data[i]))
            }

            this.stream.writeBytes(byteString, byteString.length);
            //this.stream.write(data, data.length);
    	    console.log("success");
            //        this.stream.flush();
    
            //var dataURL = canvas.toDataURL("image/png");
            console.log("Grabbed frame, raw pixel data - " + data.length + " bytes");
            //console.log(data);
            return "";    
        }),
        
        prepareFrame : function(clock) {
            this.setClock(clock);
            this.nextTick();        
        },
        
        closeStream : UseXPCOM(function () {
            if (this.stream instanceof Components.interfaces.nsISafeOutputStream) {
    	        this.stream.finish();
            } else {
                this.stream.close();
            }
        })
    }
);

$(document).ready(function() {
    var recorder = Recorder();
    
    // Expose to Selenium
    window.recorder = recorder;    
    
    recorder.init();
    recorder.loadSong("static/music/flautin.mp3");
    recorder.loadImages(["static/images/coffee.jpg", "static/images/kakku.png"]);

    $("button[name=tick]").click(function() {
        var clock = slideshow.clock;
        clock += 250; 
        recorder.prepareFrame(clock);
    });

    $("button[name=grab]").click(function() {
        var data = recorder.grabFrame();
    });    
});
 
