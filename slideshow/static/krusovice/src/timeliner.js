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
		throw new Exception("you must give list of elements to show");
	}
	
	if(!jQuery.isArray(this.showElements)) {
		throw new Exception("Array plz");
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
		
	createMusicAnalysis : function() {
		return krusovice.RhytmAnalysis(this.rhytmData);		
	},
	
	/**
	 * Be like a MasterMind. 
	 * 
	 * @return
	 */
	createPlan : function() {
				
		this.analytics = this.createMusicAnalysis(this.rhytmData);
		
		var plan = [];
		
		var clock = 0.0;
		
		var transitionIn = this.settings.transitionIn; 
		var transitionOut = this.settings.transitionOut;
		var onScreen = this.settings.onScreen;
				
		var musicStartTime = this.settings.musicStartTime;
					
		for(var i=0; i<this.input.showElements.length; i++) {
			
			var elem = this.showElements[i];
			
			var out = {};
			this.copyAttrs(out, elem, ["id", "type", "text", "label"]);
			
			this.timeElement(out, elem, clock)		
								
			this.createEffect("in", out.transitionIn, settings.transitionIn.type);					
			this.createEffect("out", out.transitionOut, settings.transitionOut.type);								
			this.createEffect("screen", out.onScreen, settings.onScreen.type);			
									
			clock += out.transitionIn.duration + 
			         out.transitionOut.duration + 
			         out.onScreen.duration + transitionOut.clockSkip;
		}		
		
		return plan;
	},
	
	timeElement : function(target, source, clock) {
				
		var transitionIn = this.settings.transitionIn; 
		var transitionOut = this.settings.transitionOut;
		var onScreen = this.settings.onScreen;		
		
		// start on screen effect on beat
		// stop on screen effect on beat
		var hitsScreen = this.analysis.findBeat(clock + musicStartTime + transitionIn.duration) - musicStartTime;			
		var hitsOut = this.analysis.findBeat(hitsScreen + musicStartTime + onScreen.duration) - musicStartTime;					
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
	
	copyAttrs : function(target, source, attr) {
		attrs.forEach(function(name) {
			target[name] = source[name];
		});
	},
	
	createEffects : function(animation, effect, type) {
				
		effect.type = type;
		
		if(type == "random") {
			if(animation == "screen") {
				effect.type = this.pickRandom(this.onScreenEffects);
			} else if(animation == "out") {
				effect.type = this.pickRandom(this.transitionOutEffects);
			} else {
				effect.type = this.pickRandom(this.transitionInEffects);
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
		
	},
		
	findNextBeat : function(clock, window) {
		
		var beat = this.analysis.findNextBeat(clock);
		
		if(beat.start - clock > window) {
			return null;
		}
		
		return beat;
	}	
	
	
}

