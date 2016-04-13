/*
**		Player class
** Contains player infos, not related to sockets.
** body is a reference to a CANNON.js shape
*/
'use strict';
var NEW_PLAYERS_SIZE = 1;

var Player = function (name, body, size) {
    // Constructor
    this.name = name;
    this.size = size;
    this.speed = 1;
    this.body = body;
    this.pressingLeft = false;
    this.pressingUp = false;
    this.pressingRight = false;
    this.pressingDown = false;
}

// Methods
Player.prototype.update = function(data) {
    if (this.pressingLeft)
        this.body.position.x -= this.speed;
    if (this.pressingUp)
        this.body.position.y += this.speed;
    if (this.pressingRight)
        this.body.position.x += this.speed;
    if (this.pressingDown)
        this.body.position.y -= this.speed;
    

}

/*
** This function should removeBody from the world, but idk why, if we do not add
** a new body right after having removed the old one, it does not work...
** A workaround is to add a new body (of size 0 in our case) which does not have
** collision listener on it, so that it does like if it does not exist.
** Problems might occur when a billion of players will have been eaten, as a 
** billion of useless sphere will be loaded into the world. We'll see in the future.
*/
Player.prototype.Die = function() {
    this.setSize(0);
//    world.removeBody(this.body);
    sendPlayerDied(this);
    delete this.body;
    delete PLAYER_LIST[this.socket.id];
    delete this;
}


Player.prototype.replaceBody = function(size) {
    var body = new CANNON.Body({
        mass: NEW_PLAYERS_SIZE, // kg
        position: new CANNON.Vec3(this.body.position.x,
                                  this.body.position.y,
                                  this.body.position.z), // m
        shape: new CANNON.Sphere(size)
    });
    body.collisionResponse = 0; // no impact on other bodys

    // Remove old body to create a new one with new size
    this.body.removeEventListener("collide");
    world.removeBody(this.body);
    delete this.body;
    this.body = body;
    this.body.player = this;
    if (size > 0)
    {
	this.body.addEventListener("collide", function(e){
	    body.player.collidedWith(e.body.player);
	});
    }
    world.addBody(this.body);
    console.log("body added");
    return this.body;
}

// What happens when a player collides with another
Player.prototype.collidedWith = function(otherplayer) {
    if (PLAYER_LIST[otherplayer.socket.id])
    {
	console.log(this.name + '('+this.size+')');
	console.log(" collided with ");
	console.log(otherplayer.name + '(' + otherplayer.size + ')');
	if (this.size > otherplayer.size)
	{
	    this.setSize(this.size + otherplayer.size);
            console.log("GOTTA REMOVE PLAYER_LIST[e.body.player.socket.id] :" + PLAYER_LIST[otherplayer.socket.id].name);
            otherplayer.Die();
	}
    }
    else
	console.log("Collided with an already dead player.");
}

Player.prototype.setSize = function(newsize) {
    this.size = newsize;
    this.replaceBody(newsize);
}

Player.prototype.split = function() {
    this.setSize(this.size + 1);
}

module.exports = Player;
