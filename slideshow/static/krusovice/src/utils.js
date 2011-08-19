"use strict";

var krusovice = krusovice || {};

/**
 * Return random value between -max ... max
 */
krusovice.splitrnd = function (max) {
	max = max*2;
    return Math.random()*max - max/2;
}

/**
 * http://stackoverflow.com/questions/5876757/how-do-i-pick-a-random-element-from-an-array/5876763#5876763
 */
krusovice.pickRandomElement = function(array) {
	return array[Math.floor(Math.random() * array.length)];
}


/**
 * Calculate ease value of a slideshow element for slide in, slide out
 * 
 * element: Output element
 * 
 * timepoint: relative to the element start time 
 *
 * return 0...1 (on screen always 1).
 *
 */
krusovice.calculateElementEase = function(elem, timepoint) {
			
	// Pick ease value using jQuery.easing options
	function ease(method, s, duration) {
		
		if(!method) {
			throw "Animation type is missing";
		}
		
		var func = jQuery.easing[method];	
		
		if(!func) {
			console.error(func);
			throw "Unknown easing method:" + method;
		}
		
		// x, t: current time, b: begInnIng value, c: change In value, d: duration
		return func(null, 0, 0, s, duration);	
	}
	
	var method;
	
	// in 
	if(timepoint < elem.transitionIn.duration) {
		method=elem.transitionIn.easing;
		return ease(method, timepoint, elem.transitionIn.duration);
	}	
	
	// on screen
	timepoint -= elem.transitionIn.duration;
	
	if(timepoint < elem.onScreen.duration) {
		method = elem.onScreen.easing;
		return ease(method, timepoint, elem.onScreen.duration);
	}
	
	// out
	timepoint -= elem.onScreen.duration;
	if(timepoint < elem.transitionOut.duration) {
		method = elem.transitionOut.easing;
		return ease(method, timepoint, elem.transitionOut.duration);
	}	
		
	// gone already
	return 0;
	
}

/**
 * Return arbitary HTML color in #ffeeaa format which is brighter than #888
 */
krusovice.pickRandomColor = function() {
	var r = Math.random(127) + 128;
	var g = Math.random(127) + 128;
	var b = Math.random(127) + 128;
	return "#" + Math.floor(r).toString() + Math.floor(g).toString() + Math.floor(b).toString();
}