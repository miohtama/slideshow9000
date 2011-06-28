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
        
        slideshow.init();
        
        
        var self = this;        
        function nextTick() {
            self.nextTick();            
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
     * Have we preloaded media assets needed for recording
     */
    checkReady : function() {
       console.log("checkReady: Images loaded:" + this.imagesLoaded + " music data:" +  this.musicDataLoaded);
       if(this.imagesLoaded && this.musicDataLoaded) {
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
        console.log("Manual tick");
        
        function timeout() {
            slideshow.onClock(0.1);
            slideshow.tick();
        }  
        
        setTimeout(timeout, 100);
        
    },

    /**
     * Prepare manual event loop
     */
    start : function() {
                     
        slideshow.onClock(0);
                
        slideshow.prepareCanvasAssets(true);
                
    },

    
    setClock : function(clock) {
        
    },
    
    grabFrame : function() {
        
    }
    
}

$(document).ready(function() {
    
    var recorder = new Recorder();
    
    recorder.init();
    recorder.loadSong("static/music/celine.mp3");
    recorder.loadImages(["static/images/coffee.jpg", "static/images/kakku.png"]);
                 
});
