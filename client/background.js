window.background = (function(win, $) {
    var standStill = false;
    var debouncer;

    function init()
    {
	var STARS = 600;
	var point;

	addLights();
	for (var i = 0; i < STARS; i++)
	{
            point = epixlib.addSphere(getRandomArbitrary(0x000000, 0xffffff), 2, 6, 6, 0.2);
	    point.position.x = getRandomArbitrary(-400, 400);
	    point.position.y = getRandomArbitrary(500, -500);
            point.position.z = getRandomArbitrary(-400, 100);
	}
	update();
    }

    function addLights()
    {
	var light = new THREE.AmbientLight( 0xff9955 );
	light.position.set( getRandomArbitrary(-1000, 1000), getRandomArbitrary(-1000, 1000), getRandomArbitrary(-1000, 1000));
	g_scene.add( light );
	return light;
    }

    function update() {
	var MAX_CAM = 120;
	var MIN_CAM = -120;

	standStill = false;
	debouncer = clearTimeout(debouncer);
	debouncer = setTimeout(function() {
            standStill = true;
	}, 100);
    }

    return {
	init: init,
	update: update
    }

})(window, this.jQuery);
