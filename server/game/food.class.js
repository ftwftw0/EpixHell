/*
**		Food class
** Contains food infos, not related to sockets.
** body is a reference to a CANNON.js shape
*/
'use strict';
var Food = function (name, size, x, y, z) {
    this.id = Math.random();

    //*******************//
    // Constructor mastaa
    //*******************//
    // TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs ON CLIENT, A \DOUBLE ENTRY WOULD FUCK CONCERNED FOODS
    // Add physics to food, its a sphere
    this.body = new CANNON.Body({
        mass: size, // kg
        position: new CANNON.Vec3(x,y,z), // m
        shape: new CANNON.Sphere(size)
    });
    
    // Add collisions to newfood's body
    this.body.collisionResponse = 0; // no impact on other bodys
    this.body.element = this;
    this.body.addEventListener("collide", function(e){
        this.element.collidedWith(e.body.element);
    });
    // Add food to world
    world.addBody(this.body);
    this.name = name;
    this.type = "food";
    this.size = size;
    // Adds the element to element list
    ELEMENT_LIST[this.id] = this;
}

// Methods

/*
** This function should removeBody from the world, but idk why, if we do not add
** a new body right after having removed the old one, it does not work...
** A workaround is to add a new body (of size 0 in our case) which does not have
** collision listener on it, so that it does like if it does not exist.
** Problems might occur when a billion of foods will have been eaten, as a 
** billion of useless sphere will be loaded into the world. We'll see in the future.
*/
Food.prototype.Die = function() {
    this.setSize(0);
//    world.removeBody(this.body);
    sendElementDied(this);
//    delete this.body; // WTF IT BUGS WHEN NOT COMMENTED.
// GO WORK ON THIS, BIATCH!!
// FIX IT FIX IT FIX IT !
    ELEMENT_LIST[this.id] = null;
    console.log("Successful delete : " + delete ELEMENT_LIST[this.id]);
    for (var i in ELEMENT_LIST)
    {
	var element = ELEMENT_LIST[i];
	if (element.id === this.id)
	    console.log(this.name + "(id: " + this.id + ") has not been deleted from ELEMENT_LIST...");
    }
    delete this;
}

Food.prototype.replaceBody = function(size) {
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

// What happens when a food collides with another
Food.prototype.collidedWith = function(element) {
    if (element.type === 'player')
    {
	console.log(this.name + '('+this.size+')');
	console.log(" has be eaten by ");
	console.log(element.name + '(' + element.size + ')');
	this.Die();
    }
}

Food.prototype.setSize = function(newsize) {
    this.size = newsize;
    this.replaceBody(newsize);
}
module.exports = Food;
