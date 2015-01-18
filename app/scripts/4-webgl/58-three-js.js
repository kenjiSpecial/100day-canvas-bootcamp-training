/**
 * Created by kenji-special on 12/26/14.
 */

var scene, camera, renderer;
var geometry, material, mesh;
var prevSecondTheta;
var hour, min, second;
var secondTheta;

var secondHandGeometry, secondHandMaterial, secondHandLine;
var id;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 100, 10000 );
    camera.position.z = 300;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );

    secondHandGeometry = new THREE.Geometry();
    secondHandGeometry.vertices.push(new THREE.Vector3( 0, 200, 0));
    secondHandGeometry.vertices.push(new THREE.Vector3( 0, -20, 0));
    secondHandMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
    secondHandLine = new THREE.Line(secondHandGeometry, secondHandMaterial);
    scene.add(secondHandLine);

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById("c")});
    renderer.setSize( window.innerWidth, window.innerHeight );

    //document.body.appendChild( renderer.domElement );

    keyEvent.on(ESC_DOWN, onEscapeDonwHandler);
}

function animate() {


    id = requestAnimationFrame( animate );
    var dd = new Date();

    second = dd.getSeconds();
    secondTheta = second / 60 * 2 * Math.PI * -1;

    secondHandLine.rotation.set(0, 0, secondTheta);

    // calculation of the area of the animation.


    // ----------------------------

    prevSecondTheta = secondTheta;

    renderer.render( scene, camera );
}

function onEscapeDonwHandler(){
    cancelRequestAnimFrame(id);
    //cancelAnimationFrame(requestId);
}
