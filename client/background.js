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
            point = addSphere(0xffffff, 2, 6, 6);
	    point.position.x = getRandomArbitrary(-400, 400);
	    point.position.y = getRandomArbitrary(500, -500);
            point.position.z = getRandomArbitrary(-400, 100);
	}

	update();
	render();
    }

    function addLights()
    {
	var light = new THREE.AmbientLight( 0xff9955 );
	light.position.set( getRandomArbitrary(-1000, 1000), getRandomArbitrary(-1000, 1000), getRandomArbitrary(-1000, 1000));
	g_scene.add( light );
	return light;
    }

    function render() {

    }

    function update() {
	var MAX_CAM = 120;
	var MIN_CAM = -120;

	standStill = false;
	debouncer = clearTimeout(debouncer);
	debouncer = setTimeout(function() {
            standStill = true;
	}, 100);
	g_camera.position = g_camera.localToWorld(new THREE.Vector3(0, 0, 10 * g_scrollPercentage));
	console.log("plop");
    }

    function addSphere(color, radius, widthSegments, heightSegments)
    {
	var geometry;
	var material;
	var shape;

	geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	material = new THREE.MeshLambertMaterial({
            emissive: 0x000000,
            color: color,
            transparent: true,
            opacity: 0.5
	});
	shape = new THREE.Mesh(geometry, material);
	g_scene.add(shape);
	return shape;
    }

    return {
	init: init,
	update: update,
	render : render
    }

})(window, this.jQuery);
