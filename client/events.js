window.events = (function(win, $) {
    // Event handlers

    $(win).bind('onkeydown', function(event) {
	
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
