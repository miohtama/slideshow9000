var krusovice = krusovice || {};

// Randomizer helper to place elements
function krusovice.splitrnd(max) {
	max = max*2;
    return Math.random()*max - max/2;
}