'use strict';
var sendNewElem = function(elem) {
    // Sends new player infos to everyone, and everyones info to new player
    console.log("Sending new " + elem.name + " to everyone");

    // May have double entries for the new player.
    // Newelem might receive itself as a elem
    for (var i in SOCKET_LIST)
    {
	var other = SOCKET_LIST[i];
	other.emit('newElem', {name: elem.name,
			       id: elem.id,
			       type: elem.type,
			       x: elem.body.position.x,
			       y: elem.body.position.y,
			       z: elem.body.position.z,
			       size: elem.size});
    }
}
module.exports = sendNewElem;
