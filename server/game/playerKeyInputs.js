'use strict';
// Function used to manage all players keyboard inputs
// The ones for player directions set a boolean inside concerned player.
//
var playerKeyInputs = function(player, data) {
    if (data.inputId === 'left')
	player.pressingLeft = data.state;
    else if (data.inputId === 'up')
	player.pressingUp = data.state;
    else if (data.inputId === 'right')
	player.pressingRight = data.state;
    else if (data.inputId === 'down')
	player.pressingDown = data.state;
    else if (data.inputId === 'split')
	player.split();
    console.log("Key press " + data.inputId + ": " + data.state);
}
module.exports = playerKeyInputs;
