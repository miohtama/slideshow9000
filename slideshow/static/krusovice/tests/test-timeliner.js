'use strict';

var TimelinerTest = TestCase("Timeliner");

// Some test data

// Create a show with two elements
var simpleElements = [
		{
			type : "image",
			id : 0,
			label : null,
			duration : 2.0,
			image : new Image()
		},
		
		{
			type : "text",
			id : 0,
			label : "Foobar",
			text : "long long long long text",
			duration : 2.0
		}
];

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