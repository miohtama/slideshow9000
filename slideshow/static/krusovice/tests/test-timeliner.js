'use strict';

var TimelinerTest = TestCase("Timeliner");

// Some test data


/**
 * Test construction of very simple timeline
 */
TimelinerTest.prototype.testBasicNoMusic = function() {
				
	var timeliner = krusovice.Timeliner.createSimpleTimeliner(simpleElements, null);
	var plan = timeliner.createPlan();
	assertEquals(plan.length, 2);
};


/**
 * Test construction of very simple timeline with music
 */
TimelinerTest.prototype.testBasicMusic = function() {

	assertObject("Could not load song data", sampleSongData);
		
	var timeliner = krusovice.Timeliner.createSimpleTimeliner(simpleElements, sampleSongData);
	var plan = timeliner.createPlan();
	assertEquals(plan.length, 2);
	
};

/**
 * We cannot construct slideshow without valid input elements
 */
TimelinerTest.prototype.testNoInput = function() {
	
	function test() {
		var timeliner = krusovice.Timeliner.createSimpleTimeliner();
	};
	
	// you must give list of elements to show
	assertException("Must fail - bad input", test);
}; 


/**
 * Check that item has been assigned a wake up time correctly
 */
TimelinerTest.prototype.testHasWakeUpTime = function() {
	
	var timeliner = krusovice.Timeliner.createSimpleTimeliner(simpleElements, null);
	var plan = timeliner.createPlan();

	var elem = plan[0];
	
	assertTrue(elem.wakeUpTime >= 0);
	assertTrue(elem.wakeUpTime < 5);
	
}; 

/**
 * Check that item has been assigned a wake up time correctly
 */
TimelinerTest.prototype.testHasAnimationTypes = function() {
	
	var timeliner = krusovice.Timeliner.createSimpleTimeliner(simpleElements, null);
	var plan = timeliner.createPlan();

	plan.forEach(function(e) {
		assertString(e.transitionIn.type);
		assertString(e.transitionOut.type);
		assertString(e.onScreen.type);

		assertString(e.transitionIn.easing);
		assertString(e.transitionOut.easing);
		assertString(e.onScreen.easing);
		
	});
	
}; 

/**
 * Check that item has been assigned a wake up time correctly
 */
TimelinerTest.prototype.testCalculateEase = function() {
	
	var timeliner = krusovice.Timeliner.createSimpleTimeliner(simpleElements, null);
	var plan = timeliner.createPlan();
	
	plan[0].transitionIn.easing = "linear";
	plan[0].transitionIn.duration = 1.0;

	plan[0].onScreen.easing = "linear";
	plan[0].onScreen.duration = 1.0;

	
	plan[0].transitionOut.easing = "linear";
	plan[0].transitionOut.duration = 1.0;

	// Assert midpoint in one second
	var val = krusovice.calculateElementEase(plan[0], 0.5);
	assertEquals(0.5, val);
}; 