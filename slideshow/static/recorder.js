/**
 * Selenium recorder for video playback
 * 
 * Interact with Selenium driver to capture frames one by one
 * 
 */


function Recorder() {
    
} 


Recorder.prototype = {
    
    
    init : function() {
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	}
	catch (e) {
		// TODO better failure mode!
		document.title = "Recorder failed UniversalXPConnect";
	}        

        slideshow.init();
        
        
        var self = this;        
        function nextTick() {
            //self.nextTick();            
        }
        
        // No timed evenst, honour recording clock 
        slideshow.prepareTick = nextTick;
        
        // Audio is mixed in afterwards
        slideshow.player = null;
        
        // Loading flags of async media content
        this.imagesLoaded = this.videosLoaded = this.musicDataLoaded = false;
                
    },
    
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
        
        if(slideshow.analysis == null) {
            throw "still needs beat data";
        }
                     
        slideshow.onClock(0);                       
        slideshow.prepareCanvasAssets(true);
                
    },

    
    setClock : function(clock) {
        slideshow.onClock(clock);
    },
    
    grabFrame : function() {
        var canvas = slideshow.canvas;
        
        var ctx = slideshow.ctx;
        var imageData = ctx.getImageData(0, 0, slideshow.width, slideshow.height);
        var data = canvas.toDataURL();
        //var dataURL = canvas.toDataURL("image/png");
        console.log("Grabbed frame, encoded PNG base64 length" + data.length);
        //console.log(data);                
        return data;               
    },
    
    prepareFrame : function(clock) {
        this.setClock(clock);
        this.nextTick();        
    },
    
    
    
    
}


$(document).ready(function() {
    
    var recorder = new Recorder();
    
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
 
