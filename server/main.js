//
// Web server configuration
//
// Core for NodeJs server to run
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
// FS is used to read files like controllers, views, etc.
var fs = require('fs');
// Load middlewares
var favicon = require('serve-favicon');		// Loads your website icon
// Load Socket.IO
var serv = http.Server(app);
var io = require('socket.io')(serv, {});

//
// Game configuration starts here
//
var FPS = 150;
// Cannon is a 3D Physic Engine. Rigidbody physics, simple collision detection, various body shapes, contacts, friction and constraints.
var CANNON = require('cannon');
// Setup our world
var world = new CANNON.World();
world.gravity.set(0, 0, -9.82); // m/s²
// Create a sphere
var radius = 1; // m
var sphereBody = new CANNON.Body({
    mass: 5, // kg
    position: new CANNON.Vec3(0, 0, 10), // m
    shape: new CANNON.Sphere(radius)
});
world.addBody(sphereBody);
// Create a plane
var groundBody = new CANNON.Body({
    mass: 0 // mass == 0 makes the body static
});
var groundShape = new CANNON.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);

var fixedTimeStep = 1.0 / FPS; // seconds
var maxSubSteps = 3;

// Start the simulation loop
/*r lastTime;
(function simloop(time){
    requestAnimationFrame(simloop);
    if(lastTime !== undefined){
	var dt = (time - lastTime) / 1000;
	world.step(fixedTimeStep, dt, maxSubSteps);
    }
    console.log("Sphere z position: " + sphereBody.position.z);
    lastTime = time;
})();
*/











// --- database connection ---
// None for the moment. Gonna use XML for the beginning.
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/mydb');

// --- some environment variables ---
app.set('port', 8081);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/assets/images/favicon.png'));
app.use(express.static(path.join(__dirname, '../client/')));
app.use(express.static(path.join(__dirname, './assets/')));

// --- dynamically include routes (Controllers) ---
fs.readdirSync('./controllers').forEach(function (file) {
    if (file.substr(-3) == '.js') {
	route = require('./controllers/' + file);
	route.controller(app);
    }
});

// --- managing socket connections ---
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function(name){
    var self = {
	name: name,
	x: 0,
	y: 0,
	z: 0,
	size: 1,
	speed: 1,
	pressingLeft: false,
	pressingUp: false,
	pressingRight: false,
	pressingDown: false
    }

    self.update = function() {
	if (self.pressingLeft)
	    self.x -= self.speed;
	if (self.pressingUp)
	    self.y += self.speed;
	if (self.pressingRight)
	    self.x += self.speed;
	if (self.pressingDown)
	    self.y -= self.speed;
	// Still moving randomly on z-axis. Idk how to manage it from now.
	//	self.z += Math.floor(Math.random() * 3 - 1);
    }

    return self;
}

io.sockets.on('connection', function(socket) {
    socket.id = Math.random();
    console.log('New socket connection (id: ' + socket.id + ')');
    SOCKET_LIST[socket.id] = socket;

    // When new player request, sends the new player to all others, and send all others to new players
    // So that the client can instanciate every current players.
    socket.on('newPlayer', function(data) {
	console.log('New player : ' + data.name);
	// TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs ON CLIENT, A DOUBLE ENTRY WOULD FUCK CONCERNED PLAYERS
	var player = Player(data.name);
	PLAYER_LIST[socket.id] = player;
	socket.player = player;
	console.log("Sending " + player.name + " infos to everyone");
	for (var i in SOCKET_LIST)
	{
	    var other = SOCKET_LIST[i];
	    other.emit('newPlayer', player);
	    var otherplayer = PLAYER_LIST[i];
	    if (otherplayer && otherplayer != player)
	    {
		socket.emit('newPlayer', otherplayer);
		console.log("Sending " + otherplayer.name + " infos to " + player.name);
	    }
	}
    });

    socket.on('keyPress', function(data) {
	if (data.inputId === 'left')
	    socket.player.pressingLeft = data.state;
	else if (data.inputId === 'up')
	    socket.player.pressingUp = data.state;
	else if (data.inputId === 'right')
	    socket.player.pressingRight = data.state;
	else if (data.inputId === 'down')
	    socket.player.pressingDown = data.state;
    });

    socket.on('disconnect', function(socket){
	console.log('Socket disconnected (id: ' + this.id + ')');
	delete SOCKET_LIST[socket.id];
	delete PLAYER_LIST[socket.id];
    });
});

// Game loop, called once every 17ms (like 1000/60), which does 60times/sec
setInterval(function(){
    var pack = [];

    // Creating a package containing all players (so they are currently playing) infos.
    for (var i in PLAYER_LIST)
    {
	var player = PLAYER_LIST[i];
	player.update();
	pack.push(player);
    }
    // Sending the package to every sockets connected, even the ones not playing.
    for (var i in SOCKET_LIST)
    {
	var socket = SOCKET_LIST[i];
	socket.emit('newPositions', pack);
    }

}, 1000/FPS);

// --- makes the server listen on port previously set with app.set('port', 8081)
serv.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

