window.game = (function(win, $) {
    var socket = io();
    var players = {};
    var playerName = "";

    // Game event handlers
    function init()
    {
	// New player request to server
	for (var i = 0 ; i < 5 ; i++ ) // Random name generator
	    playerName += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 52));
//	playerName.charAt(0).toUpperCase();
	socket.emit('newPlayer', {name: playerName});
    }

    // Position updates :
    socket.on('newPositions', function(data) {
	for (var i = 0; data.length; i++)
	{
	    if (data[i])
	    {
		var player = players[data[i].name];
		player.shape.position.x = data[i].x;
		player.shape.position.y = data[i].y;
		player.shape.position.z = data[i].z;
		player.size = data[i].size;
	    }
	    else
		console.log("Cannot update an uninstantiated player.");
	}
    });

    // New player instantiation :
    socket.on('newPlayer', function(data) {
	console.log("New player connected : " + data);
	var newplayer = {};
	newplayer.shape = epixlib.addSphere(0xffffff, 1, 10 * data.size, 10, 0.9);
	newplayer.shape.position.x = data.x;
	newplayer.shape.position.y = data.y;
	newplayer.shape.position.z = data.z;
	newplayer.size = data.size;
	players[data.name] = newplayer;
    });

    function update()
    {
	if (players[playerName])
	{
            // Pull the cameru up 120 and outwards 300
	    g_camera.position.x = players[playerName].shape.position.x + 2;
	    g_camera.position.y = players[playerName].shape.position.y + 2;
	    g_camera.position.z = players[playerName].shape.position.z + players[playerName].size * 100;
            g_camera.lookAt(players[playerName].shape);
	}
	else
	    console.log("Your player does not exist at the moment.");
    }

    return {
	init: init,
	update: update
    }
})(window, jQuery);
