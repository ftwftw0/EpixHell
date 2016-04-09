'use strict';
module.exports = (io) => {
    // Load classes you gonna use
    var Player = require("./player.class");

    //
    // Game configuration starts here
    //
    var FPS = 150; // Images per second
    // Cannon is a 3D Physic Engine. Rigidbody physics, simple collision detection,
    // various body shapes, contacts, friction and constraints.
    var CANNON = require('cannon');
    // Setup our world
    var world = new CANNON.World();
    world.gravity.set(0, 0, 0); // m/s²

    // Create a plane, for the ground
    /*
      var groundBody = new CANNON.Body({
      mass: 0 // mass == 0 makes the body static
      });
      var groundShape = new CANNON.Plane();
      groundBody.addShape(groundShape);
      groundBody.position.z = 10;
      groundBody.quaternion.z = 1;
      world.addBody(groundBody);
    */

    // --- managing socket connections ---
    var SOCKET_LIST = {};
    var PLAYER_LIST = {};

// When a user connects to the page
    io.sockets.on('connection', function(socket) {
	socket.id = Math.random();
	console.log('New socket connection (id: ' + socket.id + ')');
	SOCKET_LIST[socket.id] = socket;

	// New player request, usually right after connection
	// Sends the new player to all others, and send all others to new players
	socket.on('newPlayer', function(data) {
	    console.log('New player : ' + data.name);
	    // TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs ON CLIENT, A DOUBLE ENTRY WOULD FUCK CONCERNED PLAYERS
	    // - Creates a player -
	    // Add physics to player, its a sphere
	    var body = new CANNON.Body({
		mass: 1, // kg
		position: new CANNON.Vec3(0,0,0), // m
		shape: new CANNON.Sphere(1)
	    });
	    if (Player.exists) console.log("Player class seems loaded.");
	    var player = new Player(data.name, body, 1);
	    body.player = player;
	    // Add collisions to newplayer's body
	    body.collisionResponse = 0; // no impact on other bodys
	    body.addEventListener("collide", function(e){	
		console.log("sphere collided with " + e.body.player.name);
	    });
	    // Add player to world
	    world.addBody(body);
	    // Adds the player to player list
	    PLAYER_LIST[socket.id] = player;
	    // Adds a reference to the player into corresponding socket
	    socket.player = player;
	    // Sends new player infos to everyone, and everyones info to new player
	    console.log("Sending " + player.name + " infos to everyone");
	    for (var i in SOCKET_LIST)
	    {
		var other = SOCKET_LIST[i];
		console.log("Gonna send " + player.name + " infos to " + other.id);
		other.emit('newPlayer', {name: player.name,
					 x: player.body.position.x,
					 y: player.body.position.y,
					 z: player.body.position.z,
					 size: player.size});
		var otherplayer = PLAYER_LIST[i];
		if (otherplayer && otherplayer != player)
		{
		    socket.emit('newPlayer', {name: otherplayer.name,
					      x: otherplayer.body.position.x,
					      y: otherplayer.body.position.y,
					      z: otherplayer.body.position.z,
					      size: otherplayer.size});
		    console.log("Sending " + otherplayer.name + " infos to " + player.name);
		}
	    }

	    // Keypress events
	    socket.on('keyPress', function(data) {
		if (data.inputId === 'left')
		    player.pressingLeft = data.state;
		else if (data.inputId === 'up')
		    player.pressingUp = data.state;
		else if (data.inputId === 'right')
		    player.pressingRight = data.state;
		else if (data.inputId === 'down')
		    player.pressingDown = data.state;
		console.log("Key press " + data.inputId + ": " + data.state);
	    });


	});


	socket.on('disconnect', function(socket){
	    console.log('Socket disconnected (id: ' + this.id + ')');
	    delete SOCKET_LIST[socket.id];
	    delete PLAYER_LIST[socket.id];
	});
    });


// Game loop, called once every 1000/FPS millisec, FPS = Frames per second
    var fixedTimeStep = 1.0 / FPS; // seconds
    var maxSubSteps = 3;
    var lastTime;
    var date = new Date();
    setInterval(function(){
	// Physics
	if(lastTime !== undefined){
	    var dt = (date.getTime() - lastTime) / 1000;
	    world.step(fixedTimeStep, dt, maxSubSteps);
	}
	lastTime = date.getTime();

	// Packaging all players infos.
	var pack = [];
	for (var i in PLAYER_LIST)
	{
	    var player = PLAYER_LIST[i];
	    player.update();
	    pack.push({name: player.name,
		       x: player.body.position.x,
		       y: player.body.position.y,
		       z: player.body.position.z,
		       size: player.size})
	}
	// Send the package to every sockets connected, even those not playing.
	for (var i in SOCKET_LIST)
	{
	    var socket = SOCKET_LIST[i];
	    socket.emit('newPositions', pack);
	}

    }, 1000/FPS);





    return {
	players: PLAYER_LIST
    };
}