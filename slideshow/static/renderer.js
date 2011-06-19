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

        this.x = this.y = this.w = this.h = 0;
		
		this.opacity = 1;
	},

    changeState : function(name, clock, duration) {
        this.state = name;      
        this.duration = duration;
        this.stateStartClock = clock;
        this.stateEndClock = clock + duration;      
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
		
		var x = width/2 + width/2*this.x;
		var y = height/2 + height/2*this.y;
        
		var w=  this.image.width*this.w;
		var h = this.image.height*this.h;
		ctx.save();
        
		// Put bottom center at origin
        ctx.translate(x, y);
        // Rotate
        // Beware the next translations/positions are done along the rotated axis
        //ctx.rotate(45 * Math.PI / 180);
		ctx.globalAlpha = this.opacity;
        
		// console.log("w:" + w + " h:" + h);
		
		ctx.drawImage(this.image, 0, 0, w, h);
		
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
