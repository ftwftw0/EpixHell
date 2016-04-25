'use strict';
var createFood = function(x, y, z) {
    const NEW_FOOD_SIZE = 1;

    // TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs ON CLIENT, A DOUBLE ENTRY WOULD FUCK CONCERNED PLAYERS
    // - Creates food -
    var element = new Food("food", NEW_FOOD_SIZE, x,y,z);
    ELEMENT_LIST[Math.random()] = element;
    return element;
}
module.exports = createFood;

