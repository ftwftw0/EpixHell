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
        shape: new CANNON.Sphere(Math.sqrt(size))
    });
    
    // Add collisions to newfood's body
    this.body.collisionResponse = 0; // no impact on other bodys
    this.body.element = this;
    // Add food to world
    world.addBody(this.body);
    this.name = name;
    this.type = "food";
    this.size = size;
    // Adds the element to element list
    ELEMENT_LIST[this.id] = this;
    // This sends the NewElem to all clients
    sendNewElem(this);
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
    // When a food dies, creates another
    if (this.size > 0)
    {
	new Food("food", NEW_FOOD_SIZE,
		 Math.floor(Math.random() * (2*FOOD_ZONE_SIZE + 1)) - FOOD_ZONE_SIZE,
		 Math.floor(Math.random() * (2*FOOD_ZONE_SIZE + 1)) - FOOD_ZONE_SIZE,
		 0);
    }
//    world.removeBody(this.body);
//    delete this.body; // WTF IT BUGS WHEN NOT COMMENTED.
// GO WORK ON THIS, BIATCH!!
// FIX IT FIX IT FIX IT !
    this.setSize(0);
//   ELEMENT_LIST[this.id] = null;
    sendElementDied(this);
    delete ELEMENT_LIST[this.id];
    delete this;
}

Food.prototype.replaceBody = function(size) {
    // Remove old body to create a new one with new size
    world.removeBody(this.body);
    // New one
    if (size > 0) {
	this.body = new CANNON.Body({
            mass: size, // kg
            position: new CANNON.Vec3(this.body.position.x,
                                      this.body.position.y,
                                      this.body.position.z), // m
            shape: new CANNON.Sphere(Math.sqrt(size))
	});
    }
    else
    {
	this.body = new CANNON.Body({
            mass: size, // kg
            position: new CANNON.Vec3(this.body.position.x,
                                      this.body.position.y,
                                      this.body.position.z) // m
	});
    }
    this.body.collisionResponse = 0; // no impact on other bodys
    this.body.element = this;
    world.addBody(this.body);
    console.log(this.name + "body (size: " + this.size + ") added");
    return this.body;
}

Food.prototype.setSize = function(newsize) {
    this.size = newsize;
    this.replaceBody(newsize);
}
module.exports = Food;
