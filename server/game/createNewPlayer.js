'use strict';
var createNewPlayer = function(world, data) {
    const NEW_PLAYERS_SIZE = 1;
    // TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs ON CLIENT, A DOUBLE ENTRY WOULD FUCK CONCERNED PLAYERS
    // - Creates a player -
    // Add physics to player, its a sphere
    var body = new CANNON.Body({
	mass: NEW_PLAYERS_SIZE, // kg
	position: new CANNON.Vec3(0,0,0), // m
	shape: new CANNON.Sphere(1)
    });
    var player = new Player(data.name, body, NEW_PLAYERS_SIZE);
    // Add collisions to newplayer's body
    body.collisionResponse = 0; // no impact on other bodys
    body.player = player;
    body.addEventListener("collide", function(e){
	body.player.collidedWith(e.body.player);
    });

    // Add player to world
    world.addBody(body);
    return player;
}
module.exports = createNewPlayer;

