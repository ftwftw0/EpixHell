/*
**		Player class
** Contains player infos, not related to sockets.
** body is a reference to a CANNON.js shape
*/
'use strict';
var Player = function (id, name, size, x, y, z) {
    //*******************//
    // Constructor mastaa
    //*******************//
    this.id = id;
    // TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs ON CLIENT, A \DOUBLE ENTRY WOULD FUCK CONCERNED PLAYERS
    // Add physics to player, its a sphere
    this.body = new CANNON.Body({
        mass: size, // kg
        position: new CANNON.Vec3(x, y, z), // m
        shape: new CANNON.Sphere(size)
    });
    
    // Add collisions to newplayer's body
    this.body.collisionResponse = 0; // no impact on other bodys
    this.body.element = this;
    this.body.addEventListener("collide", function(e){
        this.element.collidedWith(e.body.element);
    });
    // Add player to world
    world.addBody(this.body);
    this.name = name;
    this.type = "player";
    this.size = size;
    this.speed = 1;
    this.pressingLeft = false;
    this.pressingUp = false;
    this.pressingRight = false;
    this.pressingDown = false;
    // Adds the player to player list, and element list
    PLAYER_LIST[this.id] = this;
    ELEMENT_LIST[this.id] = this;
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
    sendElementDied(this);
    delete this.body;
    delete PLAYER_LIST[this.id];
    delete ELEMENT_LIST[this.id];
    delete this;
}

Player.prototype.replaceBody = function(size) {
    var body = new CANNON.Body({
        mass: size, // kg
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
    this.body.element = this;
    if (size > 0)
    {
	this.body.addEventListener("collide", function(e){
	    body.element.collidedWith(e.body.element);
	});
    }
    world.addBody(this.body);
    console.log("body added");
    return this.body;
}

// What happens when a player collides with another
Player.prototype.collidedWith = function(element) {
    if (element.type === 'player')
    {
	if (PLAYER_LIST[element.socket.id])
	{
	    console.log(this.name + '('+this.size+')');
	    console.log(" collided with ");
	    console.log(element.name + '(' + element.size + ')');
	    if (this.size > element.size)
	    {
		this.setSize(this.size + element.size);
		console.log("GOTTA REMOVE PLAYER_LIST[e.body.player.socket.id] :" + PLAYER_LIST[element.socket.id].name);
		element.Die();
	    }
	}
	else
	    console.log("Collided with an already dead player.");
    }
}

Player.prototype.setSize = function(newsize) {
    this.size = newsize;
    this.replaceBody(newsize);
}

Player.prototype.split = function() {
    this.setSize(this.size + 1);
}

module.exports = Player;
