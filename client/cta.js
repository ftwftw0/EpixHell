// CTA means Call to action, w/e that means.
window.cta = (function(win, $, TweenMax, THREEx) {
    var domEvents;
    var shape;

    function init() {
        shape = addDodecahedron(0xff0000, 50);
        render();
	// Add events
        domEvents = new THREEx.DomEvents(g_camera, g_renderer.domElement);
        domEvents.addEventListener(shape, 'click', function(event) {
            var AN_TIME = 0.15;
            TweenMax.to(shape.scale, AN_TIME, {x: 1.4, y: 1.4, z: 1.4});
            TweenMax.to(shape.scale, AN_TIME, {x: 1, y: 1, z: 1, delay: AN_TIME});
        }, false);
        domEvents.addEventListener(shape, 'mouseover', function(event) {
            var AN_TIME = 0.45;
            TweenMax.to(shape.material, AN_TIME, {opacity: 1});
        }, false);
        domEvents.addEventListener(shape, 'mouseout', function(event) {
            var AN_TIME = 0.45;
            TweenMax.to(shape.material, AN_TIME, {opacity: 0.3});
        }, false);
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

    function render() {
        if (typeof shape === 'object') {
            shape.rotation.x += 0.01;
            shape.rotation.y += 0.01;
        }
    }

    return {
        init: init,
        render: render
    };

})(window, this.jQuery, this.TweenMax, this.THREEx);