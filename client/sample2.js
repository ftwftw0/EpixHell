// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function() {
    var $el;
    g_renderer = null;
    g_scene = null;
    g_camera = null;
    g_scrollPercentage = 0.50;

    $(window).ready(function() {
	createBaseScene($('body'));
	background.init();
	cta.init($('body'));

	game.init();

	// Load my debug tools
	debug.init();

    });

    function createBaseScene($element) {
        var ASPECT = window.innerWidth / window.innerHeight;
	var FAR = 5000;
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
    }

    
    function render() 
    {
	background.update();
	cta.update();
	game.update();

	g_renderer.render(g_scene, g_camera);
    }

    // That's the display loop, should be called 60times/sec
    setInterval( function () {
	if ( !(document.webkitHidden) )
	    requestAnimationFrame( render );

    }, 1000 / 100 );

});

