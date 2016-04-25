/*
**		Player class
** Contains player infos, not related to sockets.
** body is a reference to a CANNON.js shape
*/
'use strict';
/* Hey look, client side player has a shape when server side player
   has a body! In fact, your size (and shape) on the client may be
   set differently than on the server, making a server-only collider
   system */
window.Player = function (name, shape, size) {
    // Constructor
    this.name = name;
    this.size = size;
    this.speed = 1;
    this.shape = shape;
    this.pressingLeft = false;
    this.pressingUp = false;
    this.pressingRight = false;
    this.pressingDown = false;
}

// Methods
Player.prototype.update = function(data) {
    if (this.size < data.size){
	console.log("Upgraded from size " + this.size + " to " + data.size);
	this.size = data.size;
	g_scene.remove(this.shape);
	this.shape = epixlib.addSphere(0xffffff, data.size, 10, 10, 0.9);
    }
    this.type = data.type;
    this.shape.position.x = data.x;
    this.shape.position.y = data.y;
    this.shape.position.z = data.z;
}