"use strict";

var krusovice = krusovice || {};

/**
 * Return random value between -max ... max
 */
krusovice.splitrnd = function (max) {
	max = max*2;
    return Math.random()*max - max/2;
}