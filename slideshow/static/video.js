/**
 * Handle slideshow background video w/canvas co-operation
 */

function CanvasVideoHelper(canvas, video, width, height) {
	this.canvas = canvas;
	this.video = video;
	this.width = width;
	this.height = height;
	
	this.init();
}

CanvasVideoHelper.prototype = {
	
	init : function() {
	
		var v = this.video;
	    var canvas = this.canvas;
	    
		this.canvasContext = canvas.getContext('2d');

        if(!this.canvasContext) {
			alert("fasdfas");
		}
				
	    var back = document.createElement('canvas');
	    var backcontext = back.getContext('2d');
	
	    this.backContext = backcontext;
	    var cw,ch;	
		
	},
	
    start : function() {
		this.video.play();
	},
	
	stop : function() {
		this.video.stop();
	},
		
	/**
	 * Pick video frame and put it to the canvas
	 * 
	 * @param {Object} clock
	 */
	fetchFrame : function(clock) {
		
		try {
        
		    // work with seconds here
		    clock = clock / 1000;
		    
			// Do our custom looping
			while(clock > this.video.duration && this.video.duration > 1) {
				clock -= this.video.duration;
			}
		
		    this.video.currentTime = clock;
		
			this.canvasContext.drawImage(this.video, 0, 0, this.width, this.height);
		} catch(e) {
			// Chrome bug? can't set currentTime
			console.log(e);
		}
	},

    // Draw frame from <video> to <canvas>
    draw: function(v, c, bc, w, h){
	
		if (v.paused || v.ended) 
			return false;
		// First, draw it into the backing canvas
		bc.drawImage(v, 0, 0, w, h);
		
		// Grab the pixel data from the backing canvas
		var idata = bc.getImageData(0, 0, w, h);
		var data = idata.data;
		// Loop through the pixels, turning them grayscale
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			var brightness = (3 * r + 4 * g + b) >>> 3;
			data[i] = brightness;
			data[i + 1] = brightness;
			data[i + 2] = brightness;
		}
		idata.data = data;
		// Draw the pixels onto the visible canvas
		c.putImageData(idata, 0, 0);
		// Start over!
		setTimeout(function(){
			draw(v, c, bc, w, h);
		}, 0);
		
	}
}

