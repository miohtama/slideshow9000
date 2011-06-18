slideshow = {

    init : function() {
		this.createCanvas();
		this.createImages();
		
		this.clock = 0;
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
	
	
	prepareTick : function() {
        setTimeout($.proxy(this.tick, this), 100);
	},
	
	loop : function() {
	   console.log("Entering animation loop");
	   this.prepareTick();	
	},
	
	tick : function() {
		
	  var delta = 0.1;
	  this.clock += 0.1;	  
	  this.animate(delta, this.clock); 
	  this.prepareTick();
	},
	
	animate : function(delta, time) {

        var ctx = this.ctx;

		var x = time * 5;

        ctx.clearRect(0, 0, this.width, this.height); // clear canvas
		
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (x+10, 10, x+55, 50);
        
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);      
		
		ctx.drawImage(this.images[0], 0, x);
		 
	}
	
};

$(document).ready($.proxy(slideshow.init, slideshow));
