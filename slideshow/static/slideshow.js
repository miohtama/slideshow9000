soundManager.url = 'static/swf/';
soundManager.flashVersion = 8; // optional: shiny features (default = 8)
soundManager.useFlashBlock = false; // optionally, enable when you're ready to dive in
// enable HTML5 audio support, if you're feeling adventurous. iPad/iPhone will always get this.
soundManager.useHTML5Audio = true;
soundManager.debugMode = false;
soundManager.timeout = 5000;

slideshow = {
    init : function() {
        this.createCanvas();
        //this.createFakeBeats();
        this.beats = [193, 1693, 3195, 4691, 6188, 7692, 9195, 10692, 12191, 13694, 15197, 16693, 18193, 19696, 21200, 22699, 24199, 25701, 27198, 28696, 30199, 31698, 33198, 34696, 36200, 37708, 39199, 40698, 42197, 43701, 45198, 46700, 48196, 49699, 51199, 52696, 54196, 55699, 57195, 58696, 60199, 61701, 63199, 64696, 66198, 67703, 69203, 70732, 72205, 73693, 75198, 76701, 78192, 79695, 81199, 82695, 84192, 85689, 87191, 88694, 90191, 91695, 93196, 94694, 96193, 97697, 99196, 100698, 102199, 103695, 105198, 106702, 108203, 109702, 111198, 112699, 114200, 115697, 117191, 118692, 120196, 121699, 123200, 124699, 126197, 127694, 129194, 130695, 132197, 133693, 135263, 136989, 138580, 140078, 141576, 143077, 144575, 146076, 147573, 149070, 150570, 152075, 153578, 155076, 156577, 158077, 159573, 161073, 162572, 164067, 165571, 167068, 168566, 170069, 171574, 173084, 174588, 176078, 177576, 179072, 180571, 182069, 183569, 185070, 186574, 188073, 189581, 191077, 192568, 194065, 195571, 197068, 198565, 200065, 201568, 203072, 204567, 206070, 207570, 209067, 210566, 212069, 213566, 215065, 216561, 218071, 219574, 221073, 222571, 224079, 225572, 227068, 228566, 230063, 231569, 233069, 234567, 236068, 237570, 239069, 240568, 242070, 243568, 245071, 246572, 248070, 249571, 251076, 252574, 254074, 255576, 257069, 258571, 260070, 261572, 263070, 264568, 266068, 267572, 269073, 270572, 272069, 273565, 275065, 276565, 278066, 279575, 281073, 282577, 284072, 285576, 287071, 288572, 290070, 291568, 293069, 294571, 296076, 297571, 299070, 300566, 302068, 303571, 305068, 306570, 308078, 309581, 311074, 312573, 314068, 315566, 317064, 318563, 320065, 321564, 323064, 324567, 326061, 327564, 329062, 330574, 332076, 333573, 335073, 336572, 338073, 339563, 341070, 342571, 344067, 345564, 347068, 348566, 350065, 351576, 353072, 354566, 356064, 357565, 359070, 360566, 362065, 363562, 365066, 366568, 368067, 369565, 371067, 372564, 374067, 375564, 377055, 378549, 380060, 381560, 383061, 384564, 386066, 387568, 389069, 390569, 392059, 393562, 395065, 396565, 398067, 399571, 401068, 402567, 404069, 405572, 407068, 408568, 410069, 411569, 413065, 414561, 416065, 417568, 419067, 420570, 422067, 423564, 425069, 426567, 428064, 429566, 431068, 432603, 434075, 435539];

        this.createPlayer();        
        this.createFileManager();        
        this.createVideoHelper();       
        this.createPreviewButton();
        this.createStopButton();
        
        
        // Animation time since start in ms
        this.clock = this.lastClock = 0;

        // Play loop control flag
        this.play = false;   
		
		// Initialize button states
		this.updateButtons();
		
		var self = this;
		
		$("select[name=song-selector]").change(function() {
			self.updateButtons();
		});
		
		
	
    },  
        
    createCanvas : function() {
        this.canvas = document.getElementById("slideshow");

        // Visual dimensions of output
        this.width = $(this.canvas).attr("width");
        this.height = $(this.canvas).attr("height");

        this.ctx = this.canvas.getContext("2d");
        
    },
    
    createVideoHelper : function() {
        var v =  document.getElementById("background-video");
        this.videoHelper = new CanvasVideoHelper(this.canvas, v, this.width, this.height);
    },
    
    getImages : function () {
        var imgs = $('#image-list img');
        var results = [];
        $.map(imgs, function(e) {
            results.push(e);
        });
        return results;
    },
	
	/**
	 * Update state of various buttons
	 */
	updateButtons : function() {

        $("#send-button").attr("disabled", false);

		if(this.play) {
			$("#preview-button").attr("disabled", true);
			$("#stop-button").attr("disabled", false);
		} else {
			$("#preview-button").attr("disabled", false);
			$("#stop-button").attr("disabled", true);
		}
		
		// No images added
		if(this.getImages().length == 0) {
			$("#preview-button").attr("disabled", true);
            $("#send-button").attr("disabled", true);
			$("#drop-note").show();
		} else {
			$("#drop-note").hide();
		}

        // No song selected
        if($("select[name=song-selector]").val() == "") {
            $("#preview-button").attr("disabled", true);
            $("#send-button").attr("disabled", true);
        }

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
        
        // console.log("Got beats:" + this.beats);
    },
    
    createPlayer : function() {
        this.player = player;
        this.player.init($.proxy(this.onClock, this));
        this.player.loadSong();
    },
    
    createFileManager : function() {
        this.fileManager = filemanager;
        this.fileManager.init(this);
    },
    
    createPreviewButton : function() {

        var self = this;

        $("#preview-button").click(function() {                             
            self.preparePreview();            
			self.updateButtons();
        });
        
    },

    createStopButton : function() {
        var self = this;
        
        $("#stop-button").click(function() {                             
            self.stopLoop();            
            self.player.stop();
            self.updateButtons();
        });
        
    },
	
	/**
	 * Make sure we create all heavy objects before hand to get smooth animation
	 */
	preparePreview : function() {
		
		$("#preview-note").slideDown();

        this.renderer = new Renderer();     
        this.renderer.init(this, this.getImages(), this.beats);
		
		
		var self = this;
		
		function done() {
            $("#preview-note").slideUp();
			self.loop();
		}
		
		this.renderer.prepare(done);
	},

    prepareTick : function() {
        setTimeout($.proxy(this.tick, this), 50);
    },
    
	/**
	 * Enter the main rendering loop
	 */
    loop : function() {
       console.log("-----------------------")    	
	   console.log("loop start")	
       console.log("-----------------------")       
	
	   if(this.play) {
	   	// Already playing
		return;
	   }
	   
	   this.player.start();
	   
	   // Reset clock
	   this.clock = 0;
	   
	   // Canvas full reset
	   // http://diveintohtml5.org/canvas.html#divingin
	   this.canvas.width = this.canvas.width;
	   this.ctx = this.canvas.getContext("2d");
		
	   
	   this.renderer.start();
		
       this.play = true;
	   
	   this.updateButtons();
	   
       console.log("Entering animation loop");
       this.prepareTick();  
    },
    
    stopLoop : function() {
        this.play = false;
    },
    
    /**
     * Clock callback from audio
     * 
     * @param {Object} time
     */
    onClock : function(time) {
        this.clock = time;
    },
    
    tick : function() {     
    
      // Stopped
      if(!this.play) {
        return;
      }
    
      var delta = this.clock - this.lastClock;
      this.lastClock = this.clock;
    
	  // 
	  this.renderer.tick(this.clock);
	
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
         //     return;
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
     * Find last beat from the array of all beats.
     * 
     * @param clock Clock position
     * 
     * @param skip Skip rate. 1= every beat, 2 = every second beat
     */
    findLastBeat :function(clock, skip) {
        
        var beat = 0;
        
        var beats = this.beats;
        var i;
        for(i=0; i<beats.length;i++) {
            var t = beats[i];                       
            if(t > clock) {
                break;
            }           
            beat = t;                       
        }
                
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
        
        var beat = this.findLastBeat(clock, skip);
        
        var distance = clock - beat;       

            
        // -1 ... 1 intensivity within beat window
        var normalized = (window-distance) / window;                    

        // console.log("Clock:" + clock + " beat:" + beat + " window:" + window + " skip:" + skip + " distance:" + distance);

        return normalized;

    },
    
    animate : function(delta, time) {
        
        var ctx = this.ctx;
        // ctx.clearRect(0, 0, this.width, this.height); // clear canvas
        
        this.videoHelper.fetchFrame(time);
        
        // ctx.fillStyle = "rgb(200,0,0)";
        // ctx.fillRect (x+10, 10, x+55, 50);
        
        // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        // ctx.fillRect (30, 30, 55, 50);

        // var beat = this.calculateBeatIntensivity(time, 200, 5);         
        
        this.renderer.render(ctx, this.width, this.height);
    }
    
};

/**
 * Music player helper
 */
player = {
    init : function(clockCallback) {
        this.soundPos = 0;      
        this.sound = null;
		// this.startCallback = startCallback;
        this.clockCallback = clockCallback;
        this.loadSong();
    },
    
    loadSong : function() {

        var self = this;

        soundManager.onready(function(){        
            var thisSound = soundManager.createSound({
                id: 'slideshow',
                url: '/static/music/flautin.mp3',
                autoLoad: true,
                autoPlay: false,
                debugMode: false,
                
                onload: function(){
                    var that = this;
                },
				
				onplay : function() {
					//self.startCallback();
				},
                
                whileloading: function() {
                },
                
                whileplaying: function(){
                    self.clockCallback(this.position);
                },
                
                volume: 100
            });
            
            self.sound = thisSound;
        });
    },
    
    start : function() {					
        this.sound.play();                    
    },
    
    stop : function() {
        if(this.sound) {
            this.sound.stop();
        }
    },
	
	// http://introducinghtml5.com/examples/ch05/todataurl.html
	saveToPng : function() {
		
	}
};

var filemanager = { 
    init : function(slideshow) {
        this.slideshow = slideshow;
		
        // Initialize the jQuery File Upload widget:
        $('#fileupload').fileupload({
            dropZone: $('body'),
            autoUpload: true,
            add: this.add.bind(this),
            progress: this.progress.bind(this)
        });
	
        $('#image-list').sortable({
            placeholder: "image-placeholder-style"
        });
        $('#image-list').disableSelection();
    },

    add : function(e, data) {
        var elements = [];
        var that = this;
        $.each(data.files, function (index, file) {
            elements.push(that.createElement());
        });

        data.contextElements = elements;
        data.submit()
            .success(function (result, textStatus, jqXHR) { 
                result.forEach(function (e, i) {
                    elements[i].find('img').attr('src', e.name);

                    // remove progress bar
                    var e = elements[i].find('.progressbar-overlay');
                    e.hide('slow', function () {
                        e.remove();
                    });
                });
            })
            .error(function (jqXHR, textStatus, errorThrown) {
                elements.forEach(function (e) {
                    e.remove();
                });
            });

        // Make Preview button available
        this.slideshow.updateButtons();
    },

    progress : function (e, data) {
        if (data.contextElements) {
            var progress = data.loaded * 100 / data.total;
            data.contextElements.forEach(function (e) {
                e.find('.progressbar-overlay').progressbar('value', progress);
            });
        }
    },

    createElement : function() {
	var item = $('<li><img /><div class="closebox">⨂</div><div class="progressbar-overlay"></div></li>');
        $('#image-list').append(item);
        $('#image-list').sortable('refresh');
        item.find('.progressbar-overlay').progressbar();
        item.find('.closebox').click(function() {
            item.remove();
            $('#image-list').sortable('refresh');
        });
        return item;
    }
};

var loadTemplate = function(url, id) {
    var deferred = $.Deferred();
    $.get(url, function(template) {
        var el = $('<script type="text/x-jquery-tmpl"></script>').attr('id', id).text(template).appendTo('head');
        deferred.resolve(el);
    });
    return deferred;
};

$(function() {
    var templates = [
        loadTemplate('/static/templates/template-upload.tmpl', 'template-upload'),
        loadTemplate('/static/templates/template-download.tmpl', 'template-download')
    ];
    $.when.apply($, templates).then(function () {
        $.proxy(slideshow.init, slideshow)();
    });
});
