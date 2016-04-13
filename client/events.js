window.events = (function(win, $) {
    // Event handlers

    $(win).bind('keydown', function(event) {
	if (event.keyCode === 65 || event.keyCode === 37)
	    g_socket.emit('keyPress', {inputId: 'left', state: true});
	else if (event.keyCode === 87 || event.keyCode === 38)
	    g_socket.emit('keyPress', {inputId: 'up', state: true});
	else if (event.keyCode === 68 || event.keyCode === 39)
	    g_socket.emit('keyPress', {inputId: 'right', state: true});
	else if (event.keyCode === 83 || event.keyCode === 40)
	    g_socket.emit('keyPress', {inputId: 'down', state: true});
	else if (event.keyCode === 32)
	    g_socket.emit('keyPress', {inputId: 'split', state: true});
	console.log("Move : " + event.keyCode);
    });

    $(win).bind('keyup', function(event) {
	if (event.keyCode === 65 || event.keyCode === 37)
	    g_socket.emit('keyPress', {inputId: 'left', state: false});
	else if (event.keyCode === 87 || event.keyCode === 38)
	    g_socket.emit('keyPress', {inputId: 'up', state: false});
	else if (event.keyCode === 68 || event.keyCode === 39)
	    g_socket.emit('keyPress', {inputId: 'right', state: false});
	else if (event.keyCode === 83 || event.keyCode === 40)
	    g_socket.emit('keyPress', {inputId: 'down', state: false});
    });

    // Camera moves on y upon scrolling (mouse wheel)
    $(win).bind('mousewheel', function(event) {
        if (event.originalEvent.wheelDelta >= 0) {
            if (g_scrollPercentage > 0)
                g_scrollPercentage -= 10 / $(win).height();
        }
        else if (g_scrollPercentage < 1)
            g_scrollPercentage += 10 / $(win).height();
        background.update();
	g_camera.position.z = 200 * g_scrollPercentage - 100;
    });

    // On resize
    $(window).resize(function () {
	// Redefine the size of the renderer
//	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.aspect = 16 / 9;
	g_camera.updateProjectionMatrix();
	g_renderer.setSize( window.innerWidth, window.innerHeight );
	console.log("Resized.");
    });

})(window, jQuery);
