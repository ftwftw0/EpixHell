/*
**		Player class
** Contains player infos, not related to sockets.
** body is a reference to a CANNON.js shape
*/
'use strict';
class Player{
//module.exports = (name, body, size) => {
    constructor(name, body, size){
        this.name = name,
        this.size = size,
        this.speed = 1,
        this.body = body,
	this.pressingLeft = false,
        this.pressingUp = false,
	this.pressingRight = false,
        this.pressingDown = false
    }

    update() {
        if (self.pressingLeft)
	    self.body.position.x -= self.speed;
        if (self.pressingUp)
	    self.body.position.y += self.speed;
        if (self.pressingRight)
	    self.body.position.x += self.speed;
        if (self.pressingDown)
	    self.body.position.y -= self.speed;
	    // Still moving randomly on z-axis. Idk how to manage it from now.
            //  self.body.position.z += Math.floor(Math.random() * 3 - 1);
    }

//    return self;
}