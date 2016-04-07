window.epixlib = (function () {
    function addSphere(color, radius, widthSegments, heightSegments, opacity = 0.5)
    {
	var geometry;
	var material;
	var shape;

	geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	material = new THREE.MeshLambertMaterial({
            emissive: 0x000000,
            color: color,
            transparent: true,
            opacity: opacity
	});
	shape = new THREE.Mesh(geometry, material);
	g_scene.add(shape);
	return shape;
    }

    function addDodecahedron(color, radius) {
        var DETAIL = 0;
        var geometry;
        var material;
        var shape;

	geometry = new THREE.DodecahedronGeometry(radius, DETAIL);
        material = new THREE.MeshPhongMaterial({
            emissive: 0x000000,
            color: color,
            transparent: true,
            opacity: 0.5,
            wireframe: true
	});
	shape = new THREE.Mesh(geometry, material);
	g_scene.add(shape);
	return shape;
    }

    return {
	addSphere: addSphere,
	addDodecahedron: addDodecahedron
    };
}());

