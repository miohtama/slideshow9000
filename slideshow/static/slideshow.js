slideshow = {

    init : function() {
		this.createCanvas();
		this.createImages();
		
		this.clock = 0;
		
		this.loop();
	},	
		
	createCanvas : function() {
        this.canvas = document.getElementById("slideshow");
        this.ctx = canvas.getContext("2d");
        
	},
	
	createImages : function() {
		this.images = [];	
		this.images.push(new Image("/images/asikainen.png"));
		this.images.push(new Image("/images/kakku.png"));		
	},
	
	
	prepareTick : function() {
        setTimeout($.proxy(this.tick, this), 100);
	},
	
	loop : function() {
	   this.prepareTick();	
	},
	
	tick : function() {
	  var delta = 0.1;
	  this.clock += 0.1;	  
	  animate(delta, time); 
	},
	
	animate : function(delta, time) {
		var x = time * 5;

        ctx = this.ctx;
		
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (x+10, 10, x+55, 50);
        
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);      
		 
	}
	
};

$(document).ready(slideshow.init);
