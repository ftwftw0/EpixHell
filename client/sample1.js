// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    

// Petit cube colore sur chaque face, qui spin sur deux axes!!
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );

    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
	var hex = Math.random() * 0xff0000;
	geometry.faces[ i ].color.setHex( hex );
	geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
//  Fin du petit cube...





// Text
/*
    var container, stats, permalink, hex, color;
    var camera, cameraTarget, scene, renderer;
    var group, textMesh1, textMesh2, textGeo, material;
    var firstLetter = true;
    var text = "three.js",
    height = 20,
    size = 70,
    hover = 30,
    curveSegments = 4,
    bevelThickness = 2,
    bevelSize = 1.5,
    bevelSegments = 3,
    bevelEnabled = true,
    font = undefined,
    fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = "bold"; // normal bold

    var mirror = true;
    var fontMap = {
	"helvetiker": 0,
	"optimer": 1,
	"gentilis": 2,
	"droid/droid_sans": 3,
	"droid/droid_serif": 4
    };
    var weightMap = {
	"regular": 0,
	"bold": 1
    };

    
    var textGeo = new THREE.TextGeometry( text, {
	font: font,
	size: size,
	height: height,
	curveSegments: curveSegments,
	bevelThickness: bevelThickness,
	bevelSize: bevelSize,
	bevelEnabled: bevelEnabled,
	material: material,
	extrudeMaterial: 1
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    var text = new THREE.Mesh( textGeo, material );

    scene.add( text );
*/
// Fin du texte





    material.transparent = true;
    camera.position.z = 5;
    
    function render()
    {
	requestAnimationFrame( render );
	renderer.render( scene, camera );

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.01;

    }
    
    render();



});
