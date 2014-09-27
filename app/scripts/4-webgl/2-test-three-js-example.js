var container, stats;
var camera, scene, renderer;
var group;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var mesh1, mesh2, mesh3;

init();
animate();



function init() {

    //container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 500;

    scene = new THREE.Scene();

    group = new THREE.Object3D();
    scene.add( group );

    // earth

    var loader = new THREE.TextureLoader();
    loader.load( 'image/earth.jpg', function ( texture ) {

        var geometry = new THREE.SphereGeometry( 40, 40, 40 );

        var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = 0;
        //group.add( mesh );
        scene.add(mesh);

        mesh1 = mesh;
    } );

    loader.load( 'image/portfolio.jpg', function(texture){
        var geometry = new THREE.SphereGeometry( 40, 40, 40 );

        var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = -200;
        //group.add( mesh );

        scene.add(mesh);

        mesh2 = mesh;
    });

    loader.load("image/pony.jpg", function(texture){
        var geometry = new THREE.SphereGeometry( 40, 40, 40 );

        var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = 200;
        //group.add( mesh );

        scene.add(mesh);

        mesh3 = mesh;
    });

    // shadow

    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
        0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
    );
    gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
    gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;

    var geometry = new THREE.PlaneGeometry( 300, 300, 3, 3 );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;

    //group.add( mesh );

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('c'), alpha: true });
    renderer.setClearColor( 0x000,.2 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    //container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
//    document.body.appendChild( stats.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {


    //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.lookAt( scene.position );

    mesh1.rotation.y -= 0.005;
    mesh2.rotation.y -= 0.005;
    mesh3.rotation.y -= 0.005;

    renderer.render( scene, camera );

}