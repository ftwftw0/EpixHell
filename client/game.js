window.game = (function(win, $) {
    g_socket = io();
    let elements = {};
    let player = {};

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
	for (var i = 0; i < data.length; i++)
	{
	    if (data[i] && elements[data[i].id])
	    {
		var aplayer = elements[data[i].id];
		aplayer.update(data[i]);
	    }
	    else
		console.log("Cannot update " + data[i].name + "(id:" + data[i].id + ")");
	}
    });

    // New player instantiation :
    g_socket.on('newElem', function(data) {
	if (data.type == "player")
	{
	    // the easy way
	    elements[data.id] = 	new Player(data.id, data.name, data.size, data.x, data.y, data.z);
	    if (data.name === player.name)
	    {
		console.log("Your player is born. (id: " + data.id + ") : " + data.name + " (" + data.x + ", " + data.y + ", " + data.z + ")");
		player = elements[data.id];
	    }
	    console.log("New player connected (id: " + data.id + ") : " + data.name + " (" + data.x + ", " + data.y + ", " + data.z + ")");
	}
	else
	{
	    // the hard way, gotta work on other-than-player objects instanciation
	    console.log("New elem : " + data.name + " (" + data.x + ", " + data.y + ", " + data.z + ")");
	    var shape = epixlib.addSphere(getRandomInt(0x000000, 0xffffff),
					  Math.sqrt(data.size), 10, 10, 0.9);

	    var newplayer = new Player(data.name, shape, data.size);
	    newplayer.shape.position.x = data.x;
	    newplayer.shape.position.y = data.y;
	    newplayer.shape.position.z = data.z;
	    newplayer.id = data.id;
	    elements[data.id] = newplayer;
	}


    });

    g_socket.on('elementDied', function(data) {
	if (!elements[data.id])
	{
	    console.log("An uninstantiated player (" +
			data.name + ") just died.");
	    return ;
	}
	g_scene.remove(elements[data.id].shape);
	console.log(data.name + " just died.");
	delete elements[data.id];
    });

    function update()
    {
	if (elements[player.id])
	{
	    g_camera.position.x = elements[player.id].shape.position.x;
	    g_camera.position.y = elements[player.id].shape.position.y;
	    g_camera.position.z = elements[player.id].shape.position.z + 100 + player.size *  1 / 2;
            g_camera.lookAt(player.shape);
	}
	else
	    console.log("Your player does not exist at the moment : " + elements[player.id] + player);

	// Player debug
	if (elements[player.id])
	{
	    console.log("My position : " + player.shape.position.x +
			", " + player.shape.position.y +
			", " + player.shape.position.z);
	}
    }

    return {
	init: init,
	update: update
    }

})(window, jQuery);
