
'use strict';
module.exports = (io) => {
/**************************************/
/**	Load files you gonna use     **/
/**************************************/
    // Cannon is a 3D Physic Engine. Rigidbody physics, simple collisions,
    // various body shapes, contacts, friction and constraints.
    global.CANNON = require('cannon');

/*
    // --- dynamically include game files ---
    fs.readdirSync('./').forEach(function (file) {
	if (file.substr(-3) == '.js') {
            var route = require('./' + file);
            route.controller(app);
	}
    });
*/

    global.Player = require("./player.class");
    global.Food = require("./food.class");
    global.createNewPlayer = require("./createNewPlayer");
    global.sendGameInfosToNewPlayer = require("./sendGameInfosToNewPlayer");
    global.playerKeyInputs = require("./playerKeyInputs");
    global.getElementsInfos = require("./getElementsInfos");
    global.sendElementDied = require("./sendElementDied");
    global.sendNewElem = require("./sendNewElem");

    /*
    ** Game configuration starts here
    */
    // Images per second
    var FPS = 100;
    // Setup our world, and its gravity
    global.world = new CANNON.World();
    world.gravity.set(0, 0, 0); // m/s²
    global.NEW_PLAYERS_SIZE = 2;
    global.PLAYERS_BASE_SPEED = 1;
    global.PLAYERS_MASS_SPEED = 10;
    global.START_FOOD = 1000;
    global.FOOD_ZONE_SIZE = 200;
    global.NEW_FOOD_SIZE = 1;
    
    // --- GLOBAL GAME OBJECTS ---
    global.SOCKET_LIST = {};
    global.PLAYER_LIST = {};
    global.ELEMENT_LIST = {};

    // Game Initialisation
    for (let i = 0; i < START_FOOD; i++)
    {
	// - Creates food -
	let element = new Food("food", NEW_FOOD_SIZE,
	       Math.floor(Math.random() * (FOOD_ZONE_SIZE - -FOOD_ZONE_SIZE + 1)) + -FOOD_ZONE_SIZE,
	       Math.floor(Math.random() * (FOOD_ZONE_SIZE - -FOOD_ZONE_SIZE + 1)) + -FOOD_ZONE_SIZE,
	       0);
    }

    /*
    **  Real code begins now
    */
// When a user connects to the page
    io.sockets.on('connection', function(socket) {
	socket.id = Math.random();
	console.log('New socket connection (id: ' + socket.id + ')');
	SOCKET_LIST[socket.id] = socket;

	// New player request, usually right after connection
	// Sends the new player to all others, and send all others to new players
	socket.on('newPlayer', function(data) {
	    console.log('New player : ' + data.name);

	    // Adds player to player_list and its
	    // character (a sphere) to world
	    var player = new Player(socket.id, data.name, NEW_PLAYERS_SIZE, 0,0,0);
	    // Adds a reference to the player into corresponding socket
	    socket.player = player;
	    player.socket = socket;

	    // and everyones info to new player
	    sendGameInfosToNewPlayer(socket, player);

            // Keypress events
	    socket.on('keyPress', function(data) {
		playerKeyInputs(player, data);
	    });
	});

	socket.on('disconnect', function(socket){
	    console.log('Socket disconnected (id: ' + this.id + ')');
	    delete ELEMENT_LIST[socket.id];
	    delete PLAYER_LIST[socket.id];
	    delete SOCKET_LIST[socket.id];
	});
    });


// Game loop, called once every 1000/FPS millisec, FPS = Frames per second
    var fixedTimeStep = 1.0 / FPS; // seconds
    var maxSubSteps = 3;
    var lastTime;
    var date = new Date();
    setInterval(function(){
	// Physics
	if (lastTime !== undefined){
	    var dt = (date.getTime() - lastTime) / 1000;
	    world.step(fixedTimeStep, dt, maxSubSteps);
	}
	lastTime = date.getTime();

	// Updates all elements, like position, etc.
	for (var i in ELEMENT_LIST)
	{
	    var element = ELEMENT_LIST[i];
	    
	    // Only players are updated for now
	    if (element && element.type === 'player')
		element.update();
	}
	// Packaging all elements infos into a table.
	var pack = getElementsInfos(ELEMENT_LIST);
	// Send the package to every sockets connected, even those not playing.
	for (var i in PLAYER_LIST)
	{
	    var socket = PLAYER_LIST[i].socket;
	    socket.emit('newPositions', pack);
	}
    }, 1000/FPS);

// Players mass loop
    setInterval(function(){
	for (var i in PLAYER_LIST)
	{
	    var player = PLAYER_LIST[i];
	    
	    // Players lose 1percent on their mass each second
	    player.setSize(player.size * 0.998);
	    if (player.size < NEW_FOOD_SIZE)
		player.Die();
	}

	// Debug
	// NONE
	
    }, 1000);

    return {
	elements: ELEMENT_LIST,
	players: PLAYER_LIST
    };
}


