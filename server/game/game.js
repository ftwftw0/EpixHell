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
    global.createNewPlayer = require("./createNewPlayer");
    global.sendNewPlayerInfos = require("./sendNewPlayerInfos");
    global.playerKeyInputs = require("./playerKeyInputs");
    global.getPlayersInfos = require("./getPlayersInfos");
    global.sendPlayerDied = require("./sendPlayerDied");

    /*
    ** Game configuration starts here
    */
    // Images per second
    var FPS = 150;
    // Setup our world, and its gravity
    global.world = new CANNON.World();
    world.gravity.set(0, 0, 0); // m/s²

    // --- GLOBAL GAME OBJECTS ---
    global.SOCKET_LIST = {};
    global.PLAYER_LIST = {};
    global.ELEMENT_LIST = {};


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
	    var player = createNewPlayer(world, data);
	    // Adds the player to player list
	    PLAYER_LIST[socket.id] = player;
	    // Adds a reference to the player into corresponding socket
	    socket.player = player;
	    player.socket = socket;

	    // Sends new player infos to everyone,
	    // and everyones info to new player
	    sendNewPlayerInfos(socket, player);

            // Keypress events
	    socket.on('keyPress', function(data) {
		playerKeyInputs(player, data);
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
	if (lastTime !== undefined){
	    var dt = (date.getTime() - lastTime) / 1000;
	    world.step(fixedTimeStep, dt, maxSubSteps);
	}
	lastTime = date.getTime();

	// Updates all players, like position, etc.
	for (var i in PLAYER_LIST)
	{
	    var player = PLAYER_LIST[i];
//	    if (typeof(element) === 'Player')
		player.update();
	}
	// Packaging all players infos into a table.
	var pack = getPlayersInfos(PLAYER_LIST);
	// Send the package to every sockets connected, even those not playing.
	for (var i in SOCKET_LIST)
	{
	    var socket = SOCKET_LIST[i];
	    socket.emit('newPositions', pack);
	}
    }, 1000/FPS);

    return {
	elements: ELEMENT_LIST,
	players: PLAYER_LIST
    };
}


