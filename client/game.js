window.game = (function(win, $) {
    g_socket = io();
    var players = {};
    var playerName = "";

    // Game event handlers
    function init()
    {
	// New player request to server
	for (var i = 0 ; i < 5 ; i++ ) // Random name generator
	    playerName += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
	playerName.charAt(0).toUpperCase();
	console.log("Requesting server for this name : " + playerName);
	g_socket.emit('newPlayer', {name: playerName});
    }

    // Position updates :
    g_socket.on('newPositions', function(data) {
	for (var i = 0; i < data.length; i++)
	{
	    if (data[i] && players[data[i].name])
	    {
		var player = players[data[i].name];
		player.update(data[i]);

/*		player.size = data[i].size;
		player.shape.position.x = data[i].x;
		player.shape.position.y = data[i].y;
		player.shape.position.z = data[i].z;
*/
	    }
	    else
		console.log("Cannot update an uninstantiated player");
	}
    });

    // New player instantiation :
    g_socket.on('newElem', function(data) {
	if (data.type == "player")
	{
	    console.log("New player connected : " + data.name + " (" + data.x + ", " + data.y + ", " + data.z + ")");
	    var shape = epixlib.addSphere(0xffffff, data.size, 10, 10, 0.9);
	    var newplayer = new Player(data.name, shape, data.size);
	    newplayer.shape.position.x = data.x;
	    newplayer.shape.position.y = data.y;
	    newplayer.shape.position.z = data.z;
	    players[data.name] = newplayer;
	}
    });

    g_socket.on('playerDied', function(data) {
	g_scene.remove(players[data.name].shape);
	console.log(data.name + " just died.");
	delete players[data.name];
    });

    function update()
    {
	if (players[playerName])
	{
	    g_camera.position.x = players[playerName].shape.position.x;
	    g_camera.position.y = players[playerName].shape.position.y;
	    g_camera.position.z = players[playerName].shape.position.z + 100+ players[playerName].size * 12 - players[playerName].size * 4;
            g_camera.lookAt(players[playerName].shape);
	}
	else
	    console.log("Your player does not exist at the moment.");

	// Position debug
	if (players[playerName])
	{
	    console.log("My position : " + players[playerName].shape.position.x +
			", " + players[playerName].shape.position.y +
			", " + players[playerName].shape.position.z);
	}
    }

    return {
	init: init,
	update: update
    }
})(window, jQuery);
