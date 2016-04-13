'use strict';
var sendNewPlayerInfos = function(newPlayerSocket, newPlayer) {
    // Sends new player infos to everyone, and everyones info to new player
    console.log("Sending " + newPlayer.name + " infos to everyone");
    for (var i in SOCKET_LIST)
    {
	var other = SOCKET_LIST[i];
	console.log("Gonna send " + newPlayer.name + " infos to " + other.id);
	other.emit('newPlayer', {name: newPlayer.name,
				 x: newPlayer.body.position.x,
				 y: newPlayer.body.position.y,
				 z: newPlayer.body.position.z,
				 size: newPlayer.size});
	var otherplayer = PLAYER_LIST[i];
        if (otherplayer && otherplayer != newPlayer)
	{
	    newPlayerSocket.emit('newPlayer', {name: otherplayer.name,
				      x: otherplayer.body.position.x,
				      y: otherplayer.body.position.y,
				      z: otherplayer.body.position.z,
				      size: otherplayer.size});
	    console.log("Sending " + otherplayer.name + " infos to " + newPlayer.name);
	}
    }
}
module.exports = sendNewPlayerInfos;
