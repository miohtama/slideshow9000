/**
 * Slideshow creator core
 * 
 * @copyright Copyright 2011 Mikko Ohtamaa
 * 
 * @author Mikko Ohtamaa, Antti Haapala
 * 
 */

soundManager.url = 'static/swf/';
soundManager.flashVersion = 8; // optional: shiny features (default = 8)
soundManager.useFlashBlock = false; // optionally, enable when you're ready to dive in
// enable HTML5 audio support, if you're feeling adventurous. iPad/iPhone will always get this.
soundManager.useHTML5Audio = true;
soundManager.debugMode = false;
soundManager.timeout = 5000;

slideshow = {

    debug : false,

    /**
     * It's time for rock'n' roll babe
     */
    init : function() {

        // Animation time since start in ms
        this.clock = this.lastClock = 0;

        // Play loop control flag
        this.play = false;   
        
        // No MP3 in
        this.songLoaded = false;
        this.analysis = null;
						
        this.createCanvas();

        this.createPlayer();        
        this.createFileManager();        
        this.createVideoHelper();       
        this.createPreviewButton();
        this.createStopButton();
		this.createSongSelector();
		                		
		// Initialize button states
		this.updateButtons();
				
        this.lastVisualizedBeat = null;
		
		if(this.debug) {
			this.initDebug();
		}
		
		$("#send-button").click(function() {
			alert("Still a demo :)");
		});	
	
    },  
	
	
	/**
	 * Prepare some stuff so that the human debugger does not need to make choices himself
	 */
	initDebug : function() {
		
		// Choose song
		$("select[name=song-selector]").val("static/music/flautin.mp3");
		
		// Put in some images
		$("#image-list").append("<img src=static/images/coffee.jpg width=128 height=128/>");
		$("#image-list").append("<img src=static/images/kakku.png  width=128 height=128/>");
				
		this.loadSong("static/music/flautin.mp3");
		
		this.updateButtons();
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
	
	createSongSelector : function() {
		
		var self = this;
		
        $("select[name=song-selector]").change(function() {     
		    
			if (self.play) {
				self.stop();
			}  
            var song = $("select[name=song-selector]").val();                       
            self.loadSong(song);            
            self.updateButtons();
        });		
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
        if($("select[name=song-selector]").val() == "" || this.songLoaded == false) {
            $("#preview-button").attr("disabled", true);
            $("#send-button").attr("disabled", true);
        }

	},
    
    
    createPlayer : function() {
        this.player = player;
        this.player.init($.proxy(this.onClock, this));
    },
    
    createFileManager : function() {
        this.fileManager = filemanager;
        this.fileManager.init(this);
    },
    
    createPreviewButton : function() {

        var self = this;

        $("#preview-button").click(function() {                             
            self.prepareCanvasAssets();            
			self.updateButtons();
        });
		
		// Also create beat detector hider
		
		$("#slideshow").bind("dblclick", function() {
			$("#beat-detector").toggle();
		});
        
    },
	
	stop : function() {
            this.stopLoop();            
            this.player.stop();
            this.updateButtons();		
	},

    createStopButton : function() {
        var self = this;
        
        $("#stop-button").click(function() {
			self.stop();                             
        });
        
    },
	
	/**
	 * Make sure we create all heavy objects before hand to get smooth animation
	 */
	prepareCanvasAssets : function(muted) {
		
		$("#preview-note").slideDown();

        this.renderer = new Renderer();     
        this.renderer.init(this, this.getImages(), this.analysis);
		
		
		var self = this;
		
		function done() {
            $("#preview-note").slideUp();
			self.loop(muted);
		}
		
		this.renderer.prepare(done);
	},

    prepareTick : function() {
        setTimeout($.proxy(this.tick, this), 50);
    },
    
	/**
	 * Enter the main rendering loop
	 */
    loop : function(muted) {
       console.log("-----------------------")    	
	   console.log("loop start")	
       console.log("-----------------------")       
	
	   if(this.play) {
	   	// Already playing
		return;
	   }
	   
	   if(muted == true) {
	       // Recording mode
	   } else {	   
	       this.player.start();
	   }
	   
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
    
    /**
     * Animate all objects and render next frame.
     */
    tick : function() {     
    
      console.log("tick()");
    
      // Stopped      
      if(!this.play) {
        console.log("Stopped");
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
	 * Helps to see if sound and image are in sync
	 */
	visualizeBeat : function(clock) {
		
		var lastBeat = this.analysis.findLastBeat(clock, 1, -0.001);
				
		var lastBar = this.analysis.findLast(this.analysis.data.bars, clock, 1, -0.001);
		
		//console.log(this.analysis.data.beats);
		
		//console.log("Last beat is:" + lastBeat);
		//console.log(lastBeat);
		
		if(!lastBeat) {
			return;
		}			
		
		$("#beat-data").text(JSON.stringify(lastBeat) + " " + JSON.stringify(lastBar));
		
		lastBeat = lastBeat.start;
		
		// On each new beat, randomize color
		if(this.lastVisualizedBeat != lastBeat) {
			var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';  			 
		    $("#beat").css("background", hue);						
			this.lastVisualizedBeat = lastBeat;  
		} 
		
		var diff = clock - lastBeat; 
		
		var intensivity = 0;
		if(diff < 1000) {
			intensivity = (1000 - diff) / 1000;
		} else {
			intensivity = 0;
		}
		
		//console.log(diff + " " + intensivity);
	
	    // Fade color away within one second of the beat	
		$("#beat").css("opacity", intensivity);
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
		
		this.visualizeBeat(time);
    },
	
	
	/**
	 * Load MP3, analysis data and set-up the player.
	 * 
	 * @param {Object} uri
	 */
	loadSong : function(uri, callback) {
				
		console.log("Loading song:" + uri);
		
        this.songLoaded = false;
		this.analysis = null;
		
		if(uri == "") {
			// unload
			return;
		}						 
						 
		$("#load-song-name").text(uri);		
		$("#load-song-note").slideDown();
				
		// XXX: race condition here with fast UI choices
		var song = false;
		var dataLoaded = false;
		
		function finished() {
			
			console.log("Song load process " + song + " " + dataLoaded);
			
			if(song && dataLoaded) {
		      $("#load-song-note").slideUp();		
			}
			
			this.songLoaded = true;
			this.updateButtons();
			
			if(callback) {
			    callback();
			}
		}
		
		function gotSong() {
			song = true;
			$.proxy(finished, this)();
		}
		
		function gotData(data) {
		  this.analysis = new Analysis(data);
		  dataLoaded = true;
		  $.proxy(finished, this)();	
		}
		
		var dataURI = uri.replace(".mp3", ".json");
		
		if(this.player) {
		  // Recording mode does not have audio player
		  this.player.loadSong(uri, $.proxy(gotSong, this))
		}
		
		$.getJSON(dataURI, $.proxy(gotData, this));
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
		this.loaded = false;
		
		var self = this;
		
		soundManager.onready(function() {
			self.loaded = true;
		});
	
		soundManager.load('slideshow-sound');
    },
    
	/**
	 * Load MP3 to player
	 * 
	 * @param {Object} uri
	 * @param {Object} callback
	 */
    loadSong : function(uri, callback) {

        var self = this;
		
		// Waiting for Flash
		if(!this.loaded) {
			soundManager.onready(function() {
				self.loaded = true;
				self.loadSong(uri, callback);				
			});			
			return;
		}

        console.log("Creating sound:" + uri);
		
        // Need soundManager.onready(function() here
		        
        this.sound = soundManager.createSound({
            id: 'slideshow-sound-' + uri,
            url: uri,
            autoLoad: false,
            autoPlay: false,
            debugMode: false,
            
            onload: function(){
                console.log("MP3 loaded");
				if(callback) {
					callback();
				}												
            },
			
			onplay : function() {
				//self.startCallback();
			},
            
            whileloading: function() {
				// console.log("while loading");
            },
            
            whileplaying: function(){
                self.clockCallback(this.position);
            },
            
            volume: 100
        });
        
		
		
        this.sound.load();
		
		if(this.sound.loaded) {
			// Already loaded before
			callback();
		}
		
		console.log("Kicked in");
		
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
        }).bind('fileuploaddrop', function(e, data){
			console.log("Drop");
		});
	
        $('#image-list').sortable({
            placeholder: "image-placeholder-style"
        });
        $('#image-list').disableSelection();
    },

    add : function(e, data) {
		
		console.log("add");
		
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
