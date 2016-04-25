'use strict';
var createFood = function(world, x, y, z) {
    const NEW_FOOD_SIZE = 1;

    // TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs ON CLIENT, A DOUBLE ENTRY WOULD FUCK CONCERNED PLAYERS
    // - Creates a player -
    // Add physics to player, its a sphere
    var body = new CANNON.Body({
	mass: NEW_FOOD_SIZE, // kg
	position: new CANNON.Vec3(x,y,z), // m
	shape: new CANNON.Sphere(1)
    });
    var element = new Food(data.name, body, NEW_FOOD_SIZE);
    // Add collisions to newplayer's body
    body.collisionResponse = 0; // no impact on other bodys
    body.element = element;
    body.addEventListener("collide", function(e){
	body.element.collidedWith(e.body.element);
    });

    // Add player to world
    world.addBody(body);
    return element;
}
module.exports = createFood;

