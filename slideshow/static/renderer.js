/**
 * 
 * Slideshow image state handling & rendering
 * 
 * 
 */


/**
 * Convert raw photo to a framed image with drop shadow
 * 
 * @param img Image object (loaded)
 */
function createFramedImage(img) {
        
   // Drop shadow blur size in pixels
   // Shadow is same length to both X and Y dirs
   var shadowSize = 5;
   
   // Picture frame color
   var frameColor = "#FFFFFF";
           
   // Actual pixel data dimensions, not ones presented in DOM tree
   var nw = img.naturalWidth;
   var nh = img.naturalHeight;

   // horizontal and vertical frame border sizes
   var borderX = nw * 0.05;
   var borderY = nh * 0.05;
   
   // calculate the area we need for the final image
   var w = borderX * 2 + shadowSize * 2 + nw;
   var h = borderY * 2 + shadowSize * 2 + nh;
   
   console.log("Got dimensions:" + nw + " " + w + " " + nh + " " + h);

   // Create temporary <canvas> to work with, with expanded canvas (sic.) size     
   var buffer = document.createElement('canvas');
   
   buffer.width = w;
   buffer.height = h;
   
   // Remember, remember, YTI Turbo Pascal
   var context = buffer.getContext('2d');
   
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;
   context.shadowBlur = shadowSize;
   context.shadowColor = "black";

   context.fillStyle = "#FFFFFF";
   context.fillRect(shadowSize, shadowSize, nw+borderX*2, nh+borderY*2);       
                
   //Turn off the shadow
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;
   context.shadowBlur = 0;
   context.shadowColor = "transparent";
   
   // Slap the imge in the frame
   context.drawImage(img, shadowSize+borderX, shadowSize+borderY);
   
   // We don't need to convert canvas back to imge as drawImage() accepts canvas as parameter
   // http://kaioa.com/node/103
   return buffer;
            
}

// Randomizer helper to place elements
function splitrnd(max) {
	max = max*2;
    return Math.random()*max - max/2;
}

/**
 * Base object for different slideshow slide-ins and outs
 */
function SlideshowObject() {	
}


SlideshowObject.prototype = {
	
	 
	init : function(renderer, image) {
		
		// Set master
		this.renderer = renderer;

		this.image = image;
		     	
		// This should have been prepared beforehand
		this.framedImage = this.image.framedImage;

        // Initialize animation variables
        this.x = this.y = this.w = this.h = 0;
		
		// How many degrees this image has been rotated
		this.rotation = 0;
		
		this.opacity = 1;
	},

    changeState : function(name, clock, duration) {
        this.state = name;      
        this.duration = duration;
        this.stateStartClock = clock;
        this.stateEndClock = clock + duration;      
    
	    if(name == "in") {
			this.prepareIn(clock);
		} else if(name == "out") {
			this.prepareOut(clock);
		} else if(name == "onscreen") {
			this.prepareOnScreen(clock);
		}
	
	},
			
	start : function() {
		
	},
	
    tick : function(clock) {
		
		// console.log("Tick:" + this.state + " " + this.image + " " + clock + " "  + this.stateStartClock + " " + this.stateEndClock);

        if(this.state == "in") {
            this.doIn(clock);
        } else if(this.state == "onscreen") {
            this.doOnScreen(clock);
        } else {
            this.doOut(clock);
        }
		
        if(clock > this.stateEndClock) {
			if(this.state == "in") {

                // Always go out on a beat
                // Find the beat when we are going out, 
				var estimate = clock + this.renderer.onScreenTime;
				
				var beat = this.renderer.findNextBeat(estimate, 1000);
				var timeOnScreen;
				
				if(beat != null) {				
				    console.log("Got out time " + clock + " " + estimate + " " + beat);			
				    timeOnScreen = beat - clock;
				} else {
					timeOnScreen = this.renderer.onScreenTime;
				}
				
				this.changeState("onscreen", clock, timeOnScreen);

			} else if(this.state == "onscreen") {
				this.changeState("out", clock, this.renderer.outTime);
			} else {
				this.changeState("dead", 0);
			}
		}		
		
    },
	
	isFinished : function() {
		return (this.state == "out" || this.state == "dead");
	},

    /**
     * Calculate easing function relative to the start and end time of the current object state
     * 
     * @param {Object} clock
     * @param {Object} start
     * @param {Object} end
     * @param {Object} method
     */
    calculateEasing : function(clock, start, end, method) {		

	   var relativeClock = clock - this.stateStartClock;		
	   
	   var delta = end - start;
	   
	   if(!method) {
	   	 method = "swing";
	   }
	   
	   func = jQuery.easing[method];
	   
       return func(null, relativeClock, start, delta, this.duration);	
    },
	
	// Initialize variables for slide in anmation
	prepareIn : function() {
		
	},
	
	doIn : function() {
		throw "Should not happen";
	},
	
	prepareOut : function() {
		
	},
	
	// Initialize variables for out animation
	doOut : function() {
		throw "Should not happen";
	},
	
	// Initialize variables to on screen animation
	prepareOnScreen : function() {
		
	},
	
	doOnScreen : function() {
		throw "Should not happen";
	},
	
	render : function(ctx, width, height) {
		
		console.log("Rendering " + this.state + " " + this.x + " " + this.y +  " " + this.w + " " + this.h + " " + this.rotation);
		
		if(this.state == "dead") {
			return;
		}
		
		// Image sizes are always relative to the canvas size
		
		// This is actually canvas object contained a frame buffer
		var img = this.image.framed;
		
        // Calculate aspect ration from the source material		
		var sw = img.width;
		var sh = img.height;		
		var aspect = sw/sh;
		
		// Create image dimensions relative to canvas size
		// so that height == 1 equals canvas height
		var nh = height;
		var nw = nh*aspect;
		
		var x = width/2 + width/2*this.x;
		var y = height/2 + height/2*this.y;
        
		var w=  nw*this.w;
		var h = nh*this.h;
		ctx.save();
        
		// Put bottom center at origin
        ctx.translate(x, y);
        // Rotate
        // Beware the next translations/positions are done along the rotated axis
        
		ctx.rotate(this.rotation);
		
		ctx.globalAlpha = this.opacity;
        
		// console.log("w:" + w + " h:" + h);
		
		ctx.drawImage(img, -nw/2, -nh/2, w, h);
		
        ctx.restore();
		
	}

};


/**
 * Object which flies in from distance and then fades out
 */
function SlideInFadeOut() {
		
}

$.extend(SlideInFadeOut.prototype, SlideshowObject.prototype, {
	
		
	start : function(clock) {
				
		this.pivotX = 0;
		this.pivotY = 0;
		
		//this.size = 0;
				
	},
	
	
	prepareIn : function(clock) {
		// how many degrees we turn during 
		
		this.rotationTarget = splitrnd(Math.PI*0.05);			
		this.rotationStart = splitrnd(Math.PI*0.5); 
		
		// Where we start moving in
		this.sx = splitrnd(0.3);
        this.sy = splitrnd(0.3);

		
	},
	
	doIn : function(clock) {
				
		var size = this.calculateEasing(clock, 0, 1, "easeInSine");		
        if(isNaN(size)) {
			size = 0;
		}
				
		this.w = size;
		this.h = size;
        		
		this.x = this.calculateEasing(clock, this.sx, 0);
		this.y = this.calculateEasing(clock, this.sy, 0);
		
		//this.x = 0
		//this.y = 0;
		
		// Give it a twist
        this.rotation =  this.calculateEasing(clock, this.rotationStart, this.rotationTarget);
		
	},
	
	prepareOnScreen : function(clock) {
		this.sx = this.x;
		this.sy = this.y;
		this.tx = this.x + splitrnd(0.05);
		this.ty = this.y + splitrnd(0.05);
		
	},
	
	// Some linear movement when we are on the screen itself
	doOnScreen : function(clock) {	   
	
	    //console.log("sx:" + this.sx + " tx:" + this.tx);
	
        this.x = this.calculateEasing(clock, this.sx, this.tx, "swing");
		this.y = this.calculateEasing(clock, this.sy, this.ty, "swing");
	},
	
	prepareOut : function(clock) {
		// Fade us out
		this.ts = 3;
	},
	
	doOut  : function(clock) {
		
	   // Blow us up
	   var s = this.calculateEasing(clock, 1, this.ts, "easeOutExpo");
	   
	   if(isNaN(s)) {
	   	  s = 1;
	   }
	   
	   this.w = s;
	   this.h = s;
		
	   this.opacity = 1 - this.calculateEasing(clock, 0, 1);    
	   
	   if(isNaN(this.opacity)) {
    	   	this.opacity= 0;
	   }
	   
	}
		
});


function Renderer() {
		
}


Renderer.prototype = {

    init : function(slideshow, images, analysis) {
		
		this.slideshow = slideshow;

        this.inTime = 2000;
		
		this.outTime = 1000;

	    // Each photo should stay 5 s on screen
	    this.onScreenTime = 5000;
	    
	    // Max time to look for the beat when leaving the screen
	    this.maxBeatWindow = 500;
		
		// Array of images left to show
		this.images = images.slice(0); // make a working copy
		
		// Something we can align our image transitions
		this.analysis = analysis;
		
		this.imagesProcessed = 0;
	},
	
	start : function() {
		// Start looping
		this.lastImage = null;
		this.currentImage = null;
		
        this.prepareNextImage(0);		
		
	},
	
	/**
	 * Create canvas data
	 */
	prepare : function(doneCallback) {
		
		var processing = this.images.slice(0);
		
		function createNextFramedImage() {
			var image = processing.pop();
			
			if(image == null) {
				doneCallback();
				return;
			}
			
			if(image.framed) {
				// Already prepared once
			} else {			
    			image.framed = createFramedImage(image);
	        }
			setTimeout(createNextFramedImage, 1);
		}
				
		setTimeout(createNextFramedImage, 1);
		
	},
	
	prepareNextImage : function(clock) {
		
		var img = this.images.shift();
		
		if(img == null) {
			// End of slideshow images
			this.currentImage =  null;
			return;
		}
		
		this.imagesProcessed += 1;
		
		this.currentImage = new SlideInFadeOut();
		console.log(this.currentImage);
		
		this.currentImage.init(this, img);
		this.currentImage.changeState("in", clock, this.inTime); 		
	},
	
	/**
	 * Animate objects
	 * 
	 * @param {Object} clock
	 */
	tick : function(clock) {
		
		//console.log("Ticking " + clock + " " + this.imagesProcessed);

        if (this.currentImage != null) {
            this.currentImage.tick(clock);

	        if(this.currentImage.isFinished()) {
	            this.lastImage = this.currentImage;
	            this.prepareNextImage(clock);
	        }

        }
				
		if (this.lastImage != null) {
			this.lastImage.tick(clock);

		}
			
		
	},
	
	render: function(ctx, width, height) {
	
		if (this.lastImage != null) {
			this.lastImage.render(ctx, width, height);
		}
		
		if (this.currentImage != null) {
		  this.currentImage.render(ctx, width, height);
	    }
	},
	
	findNextBeat : function(clock, window) {
		var beat = this.analysis.findNextBeat(clock, window);
	}
	
	
};
