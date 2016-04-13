'use strict';
var sendPlayerDied = function(deadplayer) {
    // Sends new player infos to everyone, and everyones info to new player
    console.log("Sending that " + deadplayer.name + " died to everyone");
    for (var i in SOCKET_LIST)
    {
	var socket = SOCKET_LIST[i];
	socket.emit('playerDied', {name: deadplayer.name});
    }
}
module.exports = sendPlayerDied;
