'use strict';

module("Planner");

test("Create basic show plan, no music", function(){

	// Create a show with two elements
	var showElements = [
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
	
		
	var timeliner = krusovice.Timeliner.createSimpleTimeliner(elements, null);

	var plan = timeliner.createPlan();
	
	equal(plan.length, 2);

}); 