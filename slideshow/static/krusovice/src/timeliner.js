'use strict';

var krusovice = krusovice || {};

/**
 * Create timelines based on sample input
 */
krusovice.Timeliner = function(input) {
	
	this.showElements = input.showElements;
	this.settings = input.settings;
	
	this.rhytmData = input.rhytmData;

	if(!this.showElements) {
		throw new TypeError("you must give list of elements to show");
	}
	
	if(!jQuery.isArray(this.showElements)) {
		throw new TypeError("Array plz");
	}
 	
	this.transitionInEffects = input.transitionInEffects; // list of available transition effect ids
	this.transitionOutEffects = input.transitionOutEffects; // list of available transition effect ids
	this.onScreenEffects = input.onScreenEffects;	
	
}

/**
 * Shortcut to create a presentation easily.
 */
krusovice.Timeliner.createSimpleTimeliner = function(elements, rhytmData) {
	var input = {
			showElements : elements,
			rhytmData : rhytmData,
			settings : krusovice.Timeliner.defaultSettings,
			transitionInEffects : ["fadein"],
			transitionOutEffects : ["fadeout"],
			onScreenEffects: ["slightMove"]
	};
	
	return new krusovice.Timeliner(input);
};

krusovice.Timeliner.defaultSettings = {
				
		// Time in seconds where song starts playing
		musicStartTime : 0,
		
	    transitionIn : {
		    type : "random",
		    duration : 2.0,                                                
		},
		
		transitionOut : {
		    type : "random",
		    duration : 2.0,          
		    clockSkip : 0.0 // How many seconds we adjust the next object coming to the screen
		},   
		
		onScreen : {
		    type : "slightMove",
		    duration : 2.0,
		}                          
}

krusovice.Timeliner.prototype = {
		
	/**
	 * Create rhytm analysis interface for laoded rhytm data.
	 * 
	 * Optionally we can use null data and no beats.
	 */
	createMusicAnalysis : function() {
		if(this.rhytmData) {
			return krusovice.RhytmAnalysis(this.rhytmData);
		} else {
			return null;
		}
	},
	
	/**
	 * Be like a MasterMind. 
	 * 
	 * @return
	 */
	createPlan : function() {
				
		this.analysis = this.createMusicAnalysis(this.rhytmData);
		
		var plan = [];
		
		var clock = 0.0;
		
		var transitionIn = this.settings.transitionIn; 
		var transitionOut = this.settings.transitionOut;
		var onScreen = this.settings.onScreen;
				
		var musicStartTime = this.settings.musicStartTime;
					
		for(var i=0; i<this.showElements.length; i++) {
			
			var elem = this.showElements[i];
			
			// Construct show element 
			var out = {};
			
			// Populate it with default values from input
			this.copyAttrs(out, elem, ["id", "type", "text", "label"]);
			
			// Place element on the timeine based on our current clock
			this.timeElement(out, elem, clock)		
								
			// Setup element effects
			out.transitionIn = this.createEffect("in", this.settings.transitionIn.type);					
			out.transitionOut = this.createEffect("out", this.settings.transitionOut.type);								
			out.onScreen = this.createEffect("screen", this.settings.onScreen.type);			
								
			// Adjance clock to the start of the next show item based
			// on the duration of this show item
			clock += out.transitionIn.duration + 
			         out.transitionOut.duration + 
			         out.onScreen.duration + transitionOut.clockSkip;
		
			plan.push(out);
		}		
		
		return plan;
	},
	
	/**
	 * @param out Show element
	 */
	timeElement : function(out, source, clock) {
				
		var transitionIn = this.settings.transitionIn; 
		var transitionOut = this.settings.transitionOut;
		var onScreen = this.settings.onScreen;
		
		var musicStartTime = this.settings.musicStartTime;
		
		// start on screen effect on beat
		// stop on screen effect on beat
		var hitsScreen = this.findNextBeat(clock + musicStartTime + transitionIn.duration) - musicStartTime;			
		var hitsOut = this.findNextBeat(hitsScreen + musicStartTime + onScreen.duration) - musicStartTime;					
		out.wakeUpTime = hitsScreen - transitionIn;
		
		out.transitionIn = {
				duration : hitsScreen - clock					
		};
		
		out.onScreen = {
				duration : hitsScreen - hitsOut
		};		
		
		out.transitionOut = {
				duration : transitionOut.duration					
		};		
	},
	
	/**
	 * Shallow copy named attributes of an object
	 */
	copyAttrs : function(target, source, attr) {
		$.each(source, function(name, value) {
			target[name] = value;
		});
	},
	
	/**
	 * 
	 */
	createEffect : function(animation, type) {
		
		var effect = {};
		
		effect.type = type;
		
		if(type == "random") {
			if(animation == "screen") {
				effect.type = krusovice.pickRandomElement(this.onScreenEffects);
			} else if(animation == "out") {
				effect.type = krusovice.pickRandomElement(this.transitionOutEffects);
			} else {
				effect.type = krusovice.pickRandomElement(this.transitionInEffects);
			}
		}
		
		if(animation == "in") {
			effect.easing = "easeInSine";
		} else if(animation == "out") {
			effect.easing = "swing";
		} else {
			effect.easing = "easeOutExpo";
		}		
		
		effect.positions = null;
		effect.rotations = null;
		
		return effect;
	},
		
	/**
	 * 
	 * 
	 * @param clock Clock in song time
	 * 
	 * @return Next beat in song time or clock if no data avail
	 */
	findNextBeat : function(clock, window) {
		
		if(!this.analysis) {
			return null;
		}
		
		if(!window) {
			window = 1500;
		}
		
		var beat = this.analysis.findNextBeat(clock);
		
		if(beat.start - clock > window) {
			return null;
		}
		
		return beat;
	},	
	

	
}

