// Core for NodeJs server to run
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
// FS makes you able to read files like controllers, views, etc.
var fs = require('fs');
// Load middlewares
var favicon = require('serve-favicon');		// Loads your website icon
// Load Socket.IO
var serv = http.Server(app);
var io = require('socket.io')(serv, {});

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
io.sockets.on('connection', function(socket) {
    socket.id = Math.random();
    console.log('New socket connection (id: ' + socket.id + ')');
    socket.x = 0;
    socket.y = 0;
    socket.z = 0;
    socket.size = 1;
    SOCKET_LIST[socket.id] = socket;

    socket.on('newPlayer', function(data) {
	console.log('New player : ' + data.name);
	// TAKE CARE TO EXISTING NAMES, AS NAMES ARE USED AS IDs A DOUBLE ENTRY WOULD FUCK TWO PLAYERS
	socket.name = data.name;
	for (var i in SOCKET_LIST)
	{
	    var other = SOCKET_LIST[i];
	    other.emit('newPlayer', {name: socket.name,
				     x: socket.x,
				     y: socket.y,
				     z: socket.z,
				     size:socket.size});
	    if (other.name && other != socket)
	    {
		// THIS SHOULD CAUSE DOUBLE ENTRIES IN CLIENTS. SOLVE THAT LATER BROH.
		socket.emit('newPlayer', {name: other.name,
					  x: other.x,
					  y: other.y,
					  z: other.z,
					  size:other.size});
		console.log("Sending " + other.name + " infos to " + socket.name);
		console.log("Sending " + socket.name + " infos to " + other.name);
	    }
	}
    });

    socket.on('disconnect', function(socket){
	console.log('Socket disconnected (id: ' + this.id + ')');
	delete SOCKET_LIST[socket.id];
    });
});

// Game loop, called once every 17ms (like 1000/60), which does 60times/sec
setInterval(function(){
    var pack = [];

    for (var i in SOCKET_LIST)
    {
	var socket = SOCKET_LIST[i];
	if (socket.name)
	{
	    socket.x += Math.floor(Math.random() * 3 - 1);
	    socket.y += Math.floor(Math.random() * 3 - 1);
	    socket.z += Math.floor(Math.random() * 3 - 1);
	    pack.push({
		name: socket.name,
		x:socket.x,
		y:socket.y,
		z:socket.z,
		size:socket.size
	    });
	}
    }
    for (var i in SOCKET_LIST)
    {
	var socket = SOCKET_LIST[i];
	socket.emit('newPositions', pack);
    }

}, 1);

// --- makes the server listen on port previously set with app.set('port', 8081)
serv.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

