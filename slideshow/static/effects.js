$(document).ready(function() {

    console.log("Starting blinky animations");

    // http://stackoverflow.com/questions/4713477/how-to-make-a-jquery-infinite-animation
    function animate() {
        $('.blinky').animate({opacity: 0.7}, 1500, function(){
            $('.blinky').animate({opacity: 0.3}, 1500, function(){
                $('.blinky').animate({opacity:0.7}, 100, function(){
                    //alert("xxx");    
					console.log("done");
					animate();                
                });
            });
        });
    }
	
	
	 $('.blinky').animate({opacity: 0.7}, 1500, function(){});
    //animate();
    //alert("xxx");
});
