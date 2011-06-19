slideshow = {

    init : function() {
		this.createCanvas();
		this.createImages();
		//this.createFakeBeats();
        this.beats = [193, 1693, 3195, 4691, 6188, 7692, 9195, 10692, 12191, 13694, 15197, 16693, 18193, 19696, 21200, 22699, 24199, 25701, 27198, 28696, 30199, 31698, 33198, 34696, 36200, 37708, 39199, 40698, 42197, 43701, 45198, 46700, 48196, 49699, 51199, 52696, 54196, 55699, 57195, 58696, 60199, 61701, 63199, 64696, 66198, 67703, 69203, 70732, 72205, 73693, 75198, 76701, 78192, 79695, 81199, 82695, 84192, 85689, 87191, 88694, 90191, 91695, 93196, 94694, 96193, 97697, 99196, 100698, 102199, 103695, 105198, 106702, 108203, 109702, 111198, 112699, 114200, 115697, 117191, 118692, 120196, 121699, 123200, 124699, 126197, 127694, 129194, 130695, 132197, 133693, 135263, 136989, 138580, 140078, 141576, 143077, 144575, 146076, 147573, 149070, 150570, 152075, 153578, 155076, 156577, 158077, 159573, 161073, 162572, 164067, 165571, 167068, 168566, 170069, 171574, 173084, 174588, 176078, 177576, 179072, 180571, 182069, 183569, 185070, 186574, 188073, 189581, 191077, 192568, 194065, 195571, 197068, 198565, 200065, 201568, 203072, 204567, 206070, 207570, 209067, 210566, 212069, 213566, 215065, 216561, 218071, 219574, 221073, 222571, 224079, 225572, 227068, 228566, 230063, 231569, 233069, 234567, 236068, 237570, 239069, 240568, 242070, 243568, 245071, 246572, 248070, 249571, 251076, 252574, 254074, 255576, 257069, 258571, 260070, 261572, 263070, 264568, 266068, 267572, 269073, 270572, 272069, 273565, 275065, 276565, 278066, 279575, 281073, 282577, 284072, 285576, 287071, 288572, 290070, 291568, 293069, 294571, 296076, 297571, 299070, 300566, 302068, 303571, 305068, 306570, 308078, 309581, 311074, 312573, 314068, 315566, 317064, 318563, 320065, 321564, 323064, 324567, 326061, 327564, 329062, 330574, 332076, 333573, 335073, 336572, 338073, 339563, 341070, 342571, 344067, 345564, 347068, 348566, 350065, 351576, 353072, 354566, 356064, 357565, 359070, 360566, 362065, 363562, 365066, 366568, 368067, 369565, 371067, 372564, 374067, 375564, 377055, 378549, 380060, 381560, 383061, 384564, 386066, 387568, 389069, 390569, 392059, 393562, 395065, 396565, 398067, 399571, 401068, 402567, 404069, 405572, 407068, 408568, 410069, 411569, 413065, 414561, 416065, 417568, 419067, 420570, 422067, 423564, 425069, 426567, 428064, 429566, 431068, 432603, 434075, 435539];

        this.createPlayer();		
        this.createFileManager();        
		
		// Animation time since start in ms
		this.clock = this.lastClock = 0;

        // Visual dimensions of output
		this.width = this.height = 400;
	
	},	
		
	createCanvas : function() {
        this.canvas = document.getElementById("slideshow");
        this.ctx = this.canvas.getContext("2d");
        
	},
	
	createImages : function() {
   
        var targets = [
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
		
		var step = 120/60*1000;
		
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
		this.player.init();
		this.player.start($.proxy(this.onClock, this));
	},
	
    createFileManager : function() {
        this.fileManager = filemanager;
        this.fileManager.init();
    },
    		
	prepareTick : function() {
        setTimeout($.proxy(this.tick, this), 50);
	},
	
	loop : function() {
	   console.log("Entering animation loop");
	   this.prepareTick();	
	},
	
	/**
	 * Clock callback from audio
	 * 
	 * @param {Object} time
	 */
	onClock : function(time) {
		//console.log("Got clock:" + time);
		 this.clock = time;
	},
	
	tick : function() {		
	  var delta = this.clock - this.lastClock;
	  this.lastClock = this.clock;
	  //this.clock += 
	  this.animate(delta, this.clock); 
	  this.prepareTick();
	  
	  $("#pos").text(this.clock);
	  
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

        //console.log("Drawing:" + x + " w:" + w);        

        ctx.drawImage(image, 0, x, w, h);

	}
	
};

player = {
		
	init : function() {
		this.soundPos = 0;		
	},
	
	start : function(clockCallback) {
		
	    soundManager.url = 'static/swf/';
	    soundManager.flashVersion = 8; // optional: shiny features (default = 8)
	    soundManager.useFlashBlock = false; // optionally, enable when you're ready to dive in
	    // enable HTML5 audio support, if you're feeling adventurous. iPad/iPhone will always get this.
	    soundManager.useHTML5Audio = true;
	    soundManager.debugMode = false;
	
	    var self = this; 
		    
	    soundManager.onready(function(){
			var thisSound = soundManager.createSound({
				id: 'slideshow',
				url: 'static/music/flautin.mp3',
				autoLoad: true,
				autoPlay: false,
				debugMode: false,
				
				onload: function(){
					var that = this;
					
					$('#loading').hide();
					$('#controls').append($('<a>Start</a>'));
					$('#controls a').click(function(){
						that.play();
					});
				},
				
				whileloading: function(){
				},
				
				whileplaying: function(){
					clockCallback(this.position);
					self.soundPos = this.position;
				},
				
				volume: 100
			});
		});
	   // Ready to use; soundManager.createSound() etc. can now be called.		
					
	}
	
};

var filemanager = {	
    init : function() {
        alert("in fm init");
        // Initialize the jQuery File Upload widget:
        $('#fileupload').fileupload();
    }
};

$($.proxy(slideshow.init, slideshow));
