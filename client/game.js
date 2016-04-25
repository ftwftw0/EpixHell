window.game = (function(win, $) {
    g_socket = io();
    var players = {};
    var player = {};

    // Game event handlers
    function init()
    {
	player.name = "";
	// New player request to server
	for (var i = 0 ; i < 5 ; i++ ) // Random name generator
	    player.name += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
	player.name.charAt(0).toUpperCase();
	console.log("Requesting server for this name : " + player.name);
	g_socket.emit('newPlayer', {name: player.name});
    }

    // Position updates :
    g_socket.on('newPositions', function(data) {
	if (players.length === 0)
	    return ;
	for (var i = 0; i < data.length; i++)
	{
	    if (data[i] && players[data[i].id])
	    {
		var aplayer = players[data[i].id];
		aplayer.update(data[i]);
	    }
	    else
		console.log("Cannot update " + data[i].name + "(id: " + data[i].id + ")");
	}
    });

    // New player instantiation :
    g_socket.on('newElem', function(data) {
	if (data.type == "player")
	{
	    console.log("New player connected (id: " + data.id + ") : " + data.name + " (" + data.x + ", " + data.y + ", " + data.z + ")");
	    var shape = epixlib.addSphere(0xffffff, data.size, 10, 10, 0.9);

	}
	else
	{
	    console.log("New elem : " + data.name + " (" + data.x + ", " + data.y + ", " + data.z + ")");
	    var shape = epixlib.addSphere(getRandomInt(0x000000, 0xffffff),
					  data.size, 10, 10, 0.9);

	}
	var newplayer = new Player(data.name, shape, data.size);
	newplayer.shape.position.x = data.x;
	newplayer.shape.position.y = data.y;
	newplayer.shape.position.z = data.z;
	newplayer.id = data.id;
	// This line should create issue when two players have same names.
	// One of them will have the camera focused on one of the other
	if (newplayer.name = player.name)
	    player = newplayer;
	players[data.id] = newplayer;
    });

    g_socket.on('elementDied', function(data) {
	g_scene.remove(players[data.id].shape);
	console.log(data.name + " just died.");
	delete players[data.id];
    });

    function update()
    {
	if (players[player.id])
	{
	    g_camera.position.x = players[player.id].shape.position.x;
	    g_camera.position.y = players[player.id].shape.position.y;
	    g_camera.position.z = players[player.id].shape.position.z + 100 + players[player.id].size * 12 - players[player.id].size * 4;
            g_camera.lookAt(players[player.id].shape);
	}
	else
	    console.log("Your player does not exist at the moment.");

	// Position debug
	if (players[player.id])
	{
	    console.log("My position : " + players[player.id].shape.position.x +
			", " + players[player.id].shape.position.y +
			", " + players[player.id].shape.position.z);
	}
    }

    return {
	init: init,
	update: update
    }
})(window, jQuery);
