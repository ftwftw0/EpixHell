window.debug = (function(win, $) {
    var axis;
    var grid;
    var plane;

    function init()
    {
	axis = new THREE.AxisHelper(1);
	grid = new THREE.GridHelper(10, 1);
	plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 30),
			       new THREE.MeshLambertMaterial({
				   color: 0xffffff }));
	g_scene.add(axis);
	g_scene.add(grid);
    }

    function update()
    {
	
    }

    return {
        init: init,
        update: update
    };

})(window, jQuery);


