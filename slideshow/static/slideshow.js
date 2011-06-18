slideshow = {

    init : function() {
		this.createCanvas();
		this.createImages();
		this.createFakeBeats();

        this.createPlayer();		
		
		// Animation time since start in ms
		this.clock = 0;

        // Visual dimensions of output
		this.width = this.height = 400;
		
	},	
		
	createCanvas : function() {
        this.canvas = document.getElementById("slideshow");
        this.ctx = this.canvas.getContext("2d");
        
	},
	
	createImages : function() {
   
        var targets = [
		  "/static/images/asikainen.png",
		  "/static/images/kakku.png"
		];
			
		var readyCount = 0;
        var images = this.images = [];   

        var self = this;

        function ready() {
			console.log("Ready!");
			readyCount++;
			if(readyCount >= targets.length) {
				self.loop();
			}
		}				
				
        targets.forEach(function(src) {
			console.log("Loading img:" + src);
			var img = new Image();			
			img.onload = ready;		
			img.src = src;	
			images.push(img);
		});    
	
	},
	
	
	/**
	 * Make a beat array where we have 90 BPM for one minute
	 */
	createFakeBeats : function() {
		
		this.beats = [];
		
		var step = 60/90*1000;
		
		var i;
		var clock = 0;
		
		for(i=0; i<60; i++) {
			this.beats.push(clock);
			clock += step;
		}
		
		console.log("Got beats:" + this.beats);
	},
	
	
	createPlayer : function() {
		this.player = player;
		player.init();
		player.start();
	}
	
	prepareTick : function() {
        setTimeout($.proxy(this.tick, this), 100);
	},
	
	
	loop : function() {
	   console.log("Entering animation loop");
	   this.prepareTick();	
	},
	
	tick : function() {
		
	  var delta = 100;
	  this.clock += 100;	  
	  this.animate(delta, this.clock); 
	  this.prepareTick();
	},
	
	/**
	 * Find next beat from the array of all beats.
	 * 
	 * @param clock Clock position
	 * 
	 * @param skip Skip rate. 1= every beat, 2 = every second beat
	 */
	findNextBeat :function(clock, skip) {
		
		var beat = 0;
		var i = 0;
		
		this.beats.forEach(function(t) {
		
		  //if(i % skip != 0) {
		 // 	return;
		  //}
		
		  //console.log("Test: " + clock + " " + t);
		  if(t < clock) {	        
		  	beat = t;
		  }
		  
		  i+=1;
		});
		
		return beat;
	},
	
	/**
	 * Calculate beat intensivity as linear function.
	 * 
	 *  Like this:
	 *     
	 *    /\
	 *   /  \
	 *  /    \
	 *        [window/2]
	 *  
	 * 
	 * @param {Object} clock animation time in ms
	 * @param {Object} window 0.... 100% beat intensivity in ms
	 */
	calculateBeatIntensivity : function(clock, window, skip) {
		
		var beat = this.findNextBeat(clock, skip);

		var distance = clock - beat;       

			
        // -1 ... 1 intensivity within beat window
		var normalized = (distance-window) / window;					

        //console.log("Clock:" + clock + " beat:" + beat + " window:" + window + " skip:" + skip + " distance:" + distance);

        return normalized;

	},
	
	animate : function(delta, time) {
		
        var ctx = this.ctx;

		var x = time * 5 / 1000;

        ctx.clearRect(0, 0, this.width, this.height); // clear canvas
		
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (x+10, 10, x+55, 50);
        
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);      
				
		var image = this.images[0];
						
		var beat = this.calculateBeatIntensivity(time, 200, 5);
		
		var scale;

		if(beat > 0) {
            scale = 1 + beat; 			
		} else {
			scale = 1;
		}		
		
		var w = image.width*scale;
		var h = image.height*scale;

        console.log("Drawing:" + x + " w:" + w);        

        ctx.drawImage(image, 0, x, w, h);

	}
	
};

player : {
		
	init : function() {
		this.soundPos = 0;		
	},
	
	getTime : function() {
		return this.soundPos;
	},
	
	start : function() {
		
	    soundManager.url = 'swf/';
	    soundManager.flashVersion = 8; // optional: shiny features (default = 8)
	    soundManager.useFlashBlock = false; // optionally, enable when you're ready to dive in
	    // enable HTML5 audio support, if you're feeling adventurous. iPad/iPhone will always get this.
	    soundManager.useHTML5Audio = true;
	    soundManager.debugMode = true;
	
	    var self = this; 
		    
	    soundManager.onready(function() {
	       var thisSound = soundManager.createSound({
	           id: 'slideshow',
	           url: 'static/music/song1.mp3',
	           autoLoad: true,
	           autoPlay: false,
	           debugMode: false,

	           onload: function() {
	               var that = this;
	               
				   self.soundPos = $('#pos');
				   
	               $('#loading').hide();
	               $('#controls').append($('<a>Start</a>'));
	               $('#controls a').click(function() {
	                   that.play();
	               });
	           },

	           whileloading: function() {
	               $("#loading-status").text('sound '+this.sID+' loading, '+this.bytesLoaded+' of '+this.bytesTotal);
	           },

	           whileplaying: function() {
			   	   self.soundPos = this.position;
	               //soundPos.text("" + this.position);
	           },

	           volume: 100
	       });
	       
	       // Ready to use; soundManager.createSound() etc. can now be called.		
					
	}
	
}

$(document).ready($.proxy(slideshow.init, slideshow));


