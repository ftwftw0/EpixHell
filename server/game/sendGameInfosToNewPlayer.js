'use strict';
var sendNewPlayerInfos = function(newPlayerSocket, newPlayer) {
    // Sends new player infos to everyone, and everyones info to new player
    console.log("Sending " + newPlayer.name + " infos to everyone");
    for (var i in ELEMENT_LIST)
    {
	var elem = ELEMENT_LIST[i];

	newPlayerSocket.emit('newElem', {name: elem.name,
					 id: elem.id,
					 type: elem.type,
					   x: elem.body.position.x,
					   y: elem.body.position.y,
					   z: elem.body.position.z,
					   size: elem.size});	
    }

    // May have double entries for the new player.
    // Newplayer might receive itself as a newElem
    for (var i in SOCKET_LIST)
    {
	var other = SOCKET_LIST[i];
	if (other != newPlayer.socket)
	{
	    console.log("Gonna send " + newPlayer.name + " infos to " + other.id);
	    other.emit('newElem', {name: newPlayer.name,
				   id: elem.id,
				   type: newPlayer.type,
				   x: newPlayer.body.position.x,
				   y: newPlayer.body.position.y,
				   z: newPlayer.body.position.z,
				   size: newPlayer.size});
	}
    }

}
module.exports = sendNewPlayerInfos;
