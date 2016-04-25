'use strict';
var sendElementDied = function(deadelement) {
    // Sends new element infos to everyone, and everyones info to new element
    console.log("Sending that " + deadelement.name + "(id:" + deadelement.id + ")" + " is gone");
    for (var i in SOCKET_LIST)
    {
	var socket = SOCKET_LIST[i];
	socket.emit('elementDied', {id: deadelement.id});
    }
}
module.exports = sendElementDied;
