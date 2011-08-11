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
	array[Math.floor(Math.random() * array.length)];
}