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
io.sockets.on('connection', function(socket){
    console.log('New socket connection !');
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;
    socket.z = 0;
    SOCKET_LIST[socket.id] = socket;

    socket.on('newplayer', function(data){
	console.log('New player : ' + data.name);
    });
});

setInterval(function(){
    for (var i in SOCKET_LIST)
    {
	var socket = SOCKET_LIST[i];
	socket.x++;
	socket.y++;
	socket.emit('newPosition', {
	    x:socket.x,
	    y:socket.y
	});
    }
});

// --- makes the server listen on port previously set with app.set('port', 8081)
serv.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

