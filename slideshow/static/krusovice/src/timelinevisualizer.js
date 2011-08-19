'use strict';

var krusovice = krusovice || {};

/**
 * Visualize show timeline for diagnosis
 */
krusovice.TimelineVisualizer = function(plan, rhytmData) {
	
	this.plan = plan;
	if(!rhytmData) {
		rhytmData = null;
	}
	this.rhytmData = rhytmData;
	this.secondsPerPixel = 0.1;
	
	// visualization length in seconds
	this.duration = 60;
	
	// length in pixels
	this.lineLength = this.duration / this.secondsPerPixel;
	
	// How often render clock seconds on the timeline (pixels)
	this.clockSpan = 100;
	
	// One visualization line height in pixels
	this.lineHeight = 80;
	
	// No of renderer beats (for testing purposes)
	this.renderedBeats = 0;
}

krusovice.TimelineVisualizer.prototype = {
		
		formatClock : function(time) {
			var minutes = Math.floor(time/60);
			var seconds = time - minutes;			
			return minutes + ":" + Math.round(seconds, 2);		
		},
		
		/**
		 * Does this visualization have data for beats
		 */
		hasBeats : function() {
			return (this.rhytmData != null);
		},
		
		createLabelLine : function() {
			var line = $("<div class=timeline>");		
			return line;
		},	
		
		createLabel : function(parent, x, text) {
			var label = $("<div class=label></div>");	
			label.css("left", x + "px");
			label.text(text);
			parent.append(label);
			return label;
		},
		
		createDataLine : function() {
			var canvas = $("<canvas class=timeline width=" + this.lineLength + " height=" + this.lineHeight + ">");
			canvas.css("width", this.lineLength + "px");				
			var context = canvas.get(0).getContext("2d");
			return [canvas, context];
		},
		
		createClockLine : function () {
					
			var line = this.createLabelLine ();
			
			var i=0; 
			
			for(i=0; i<this.lineLength; i+=this.clockSpan) {
				var time = i * this.secondsPerPixel;
				var text = this.formatClock(time);			
				this.createLabel(line, i, text);
			}
			
			return line;
		},
		
		
		createBeatLine : function() {

			console.log("Rendering beat line");
			
			var line = this.createDataLine();
			
			var canvas = line[0];
			var context = line[1];
			
			var i=0; 
			
			var clock = 0;
						
			context.strokeStyle = "#ff0000";
			context.lineWidth = 1;
			
			if(this.hasBeats()) {
			
				var beats = this.rhytmData.beats;
				var currentBeat = 0;
				
				//console.log("Rendering beats");
				
				// Render each pixel of the timeline image
				for(i=0; i<this.lineLength; i++) {
					 					
					 var currentClock = i*this.secondsPerPixel;
					 var nextClock =  currentClock + this.secondsPerPixel;
					
					 //console.log("Rendering clock span " + currentClock + "-" + nextClock);
					 //console.log(beats[currentBeat]);					 
					 
					 // max of all beat values during the clock span
					 var peakBeat = 0;
					 
					 var beatsHit = 0;
					 
					 // Wind beat cursor to the start of current clock span
					 while(currentBeat < beats.length && beats[currentBeat].start/1000 < currentClock) {
						 currentBeat++;
					 }

					 
					 while(beats[currentBeat].start/1000 >= currentClock && beats[currentBeat].start/1000 < nextClock) {
						 peakBeat = Math.max(beats[currentBeat].confidence, peakBeat);
						 beatsHit++;			
						 currentBeat++;
					 }
					 
					 // console.log("Pixel " + i + " beat peak " + peakBeat + " hits:" + beatsHit + " current beat:" + currentBeat);
					 
					 // Beat line height in pixels
					 var height =  peakBeat * this.lineHeight;
					 
					 this.renderedBeats += 1;
					 
					 // canvas assumes 0.5 is in the middle of pixel
					 // hurray for subpixel mess
					 context.beginPath();
					 context.moveTo(i + 0.5, this.lineHeight - height);
					 context.lineTo(i + 0.5, this.lineHeight);
					 context.stroke();
				}
			}
			
			return canvas;
	
		},
		
		/**
		 * Create position indicator line
		 */
		createPositionIndicator : function() {
			return $("<div class=position-indicator>");
		},
		
		render : function (elem) {
			
					
			var elem = $(elem);
			
			elem.addClass("timeline-visualization");
			
			elem.css("width", this.lineLength + "px");	
			
			if(elem.size() == 0) {
				throw "Render target cannot be empty for timeline visualizer";
			}
			
			var clock = this.createClockLine();
			var beats = this.createBeatLine();
			
			elem.append(clock);
			elem.append(beats);
			
			this.positionIndicator = this.createPositionIndicator();
			elem.append(this.positionIndicator)
			
			this.elem = elem;
						
		},
		
		
		/**
		 * Set position indicating cursor to a
		 */
		setPositionIndicator : function(elem, time) {
			
		}
};