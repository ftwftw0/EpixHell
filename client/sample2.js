// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function() {
    var socket = io();
    var $el;
    g_renderer = null;
    g_scene = null;
    g_camera = null;
    g_scrollPercentage = 0.50;

    $(window).ready(function() {
	createBaseScene($('body'));
	background.init();
	cta.init($('body'));

	// New player request to server
	socket.emit('newplayer', {name: 'IceTea'});

	// Position updates :
	socket.on('newPosition', function(data) {
	    g_camera.position.x = data.x;
	    g_camera.position.y = data.x;
	});




	// Load my debug tools
	debug.init();


	render();
    });

    function createBaseScene($element) {
        var ASPECT = window.innerWidth / window.innerHeight;
	var FAR = 1000;
        var FOV = 45;
	var NEAR = 0.1;

	$el = $element;
	g_scene = new THREE.Scene();
        g_camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
        g_renderer = new THREE.WebGLRenderer({antialias: true});
	g_renderer.setClearColor(0x000000);
        g_renderer.shadowMapEnabled = true;
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_renderer.setPixelRatio( window.devicePixelRatio );

	$el.append(g_renderer.domElement);

	// Pull the cameru up 120 and outwards 300
	g_camera.position.y = 10;
	g_camera.position.z = 10;
	g_camera.position.x = 10;
	g_camera.lookAt(g_scene.position);


    }

    function update() {
    }

    // That's the display loop, should be called 60times/sec
    function render() {
//	var timer = Date.now() * 0.0001;
	update();
	background.render();
	cta.render();

	g_renderer.render(g_scene, g_camera);
	requestAnimationFrame(render);
    }

});

