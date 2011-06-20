/**
 * 
 * Slideshow image state handling & rendering
 * 
 * 
 */

function SlideshowObject() {	
}

SlideshowObject.prototype = {
	
	 
	init : function(renderer, image) {
		
		// Set master
		this.renderer = renderer;

		this.image = image;
	
	     	
		this.framedImage = this.createFramedImage(this.image);

        // Initialize animation variables
        this.x = this.y = this.w = this.h = 0;
		
		this.opacity = 1;
	},

    changeState : function(name, clock, duration) {
        this.state = name;      
        this.duration = duration;
        this.stateStartClock = clock;
        this.stateEndClock = clock + duration;      
    },
	
	/**
	 * Convert raw photo to a framed image with drop shadow
	 * 
	 * @param img Image object (loaded)
	 */
	createFramedImage : function(img) {
			
	   // Drop shadow blur size in pixels
	   // Shadow is same length to both X and Y dirs
	   var shadowSize = 5;
	   
	   // Picture frame color
	   var frameColor = "#FFFFFF";
	   	   
	   // horizontal and vertical frame border sizes
	   var borderX = img.width * 0.05;
	   var borderY = img.height * 0.05;
	   
	   // Actual pixel data dimensions, not ones presented in DOM tree
	   var nw = img.naturalWidth;
	   var nh = img.naturalHeight;
	   
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
	  	   	   	
	},
		
	start : function() {
		
	},
	
    tick : function(clock) {
		
		console.log("Tick:" + this.state + " " + this.image + " " + clock + " "  + this.stateStartClock + " " + this.stateEndClock);

        if(this.state == "in") {
            this.doIn(clock);
        } else if(this.state == "onscreen") {
            this.doOnScreen(clock);
        } else {
            this.doOut(clock);
        }
		
        if(clock > this.stateEndClock) {
			if(this.state == "in") {
				this.changeState("onscreen", clock, this.renderer.onScreenTime);
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

    calculateEasing : function(clock, start, end) {		

	   var relativeClock = clock - this.stateStartClock;		
       console.log("Easing: " + relativeClock + " " + this.duration);
       return jQuery.easing.easeOutSine(null, relativeClock, start, end, this.duration)		
    },
	
	doIn : function() {
		throw "Should not happen";
	},
	
	doOut : function() {
		throw "Should not happen";
	},
	
	doOnScreen : function() {
		throw "Should not happen";
	},
	
	render : function(ctx, width, height) {
		
		console.log("Rendering " + this.state + " " + this.x + " " + this.y +  " " + this.w + " " + this.h)
		
		if(this.state == "dead") {
			return;
		}
		
		// Image sizes are always relative to the canvas size
		var img = this.framedImage;
		
        // Calculate aspect ration from the source material		
		var sw = this.framedImage.width;
		var sh = this.framedImage.height;		
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
        //ctx.rotate(45 * Math.PI / 180);
		ctx.globalAlpha = this.opacity;
        
		// console.log("w:" + w + " h:" + h);
		
		ctx.drawImage(this.framedImage, -nw/2, -nh/2, w, h);
		
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
	
	doIn : function(clock) {
				
		var size = this.calculateEasing(clock, 0, 1);		


        console.log("SlideInFadeOut.doIn:" + clock + " " + size);

        if(isNaN(size)) {
			size = 0;
		}
				
		this.w = size;
		this.h = size;
        		
		this.x = 0;
		this.y = 0;        
		
	},
	
	doOnScreen : function(clock) {	   
	   
	   if(!this.onScreenPivotX) {
	   	   this.onScreenPivotX = this.x;
	   }
	   
	   this.x = this.onScreenPivotX + 0.5 * this.calculateEasing(clock, 0, 1);
	},
	
	doOut  : function(clock) {
	   this.opacity = 1 - this.calculateEasing(clock, 0, 1);    
	   
	   if(isNaN(this.opacity)) {
    	   	this.opacity= 0;
	   }
	   
	}
		
});


function Renderer() {
		
}


Renderer.prototype = {

    init : function(slideshow, images, beats) {
		
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
		this.beats = beats;
		
		this.imagesProcessed = 0;
	},
	
	start : function() {
		// Start looping
		this.lastImage = null;
		this.currentImage = null;
		
        this.prepareNextImage(0);		
		
	},
	
	prepareNextImage : function(clock) {
		
		var img = this.images.pop();
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
		
		console.log("Ticking " + clock + " " + this.imagesProcessed);

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
	}
	
	
};
