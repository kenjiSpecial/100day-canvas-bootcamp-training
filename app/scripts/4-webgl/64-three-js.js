var container, stats;

var camera, scene, renderer;
var sqLength = 80;
var yy = 0;

var group;
var meshArr = [];

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var width = window.innerWidth;
var height = window.innerHeight;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);


    scene = new THREE.Scene();

    //camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.set(0, 150, 500);
    scene.add(camera);

    var light = new THREE.PointLight(0xffffff, 0.8);
    camera.add(light);

    function addShape(shape, extrudeSettings, color, x, y, z) {
        var points = shape.createPointsGeometry();
        var spacedPoints = shape.createSpacedPointsGeometry(50);

        // flat shape

        var geometry = new THREE.ShapeGeometry(shape);

        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: color,
            ambient: color,
            side: THREE.DoubleSide
        }));
        mesh.position.set(x, y, 0);
        scene.add(mesh);

        return mesh;
    }


    // Square

    var squareShape = new THREE.Shape();
    squareShape.moveTo(-sqLength / 2, -sqLength / 2);
    squareShape.lineTo(-sqLength / 2, sqLength / 2);
    squareShape.lineTo(sqLength / 2, sqLength / 2);
    squareShape.lineTo(sqLength / 2, -sqLength / 2);
    squareShape.lineTo(-sqLength / 2, -sqLength / 2);

    var extrudeSettings = {amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1};

    // addShape( shape, color, x, y, z, rx, ry,rz, s );
    var countX = 0;
    var countY = 0;

    for (var xx = -10; xx <= 10; xx++) {
        var addValue;
        meshArr[countX] = [];

        for (var yy = -10; yy <= 10; yy++) {

            if (yy % 2 == 0) addValue = 1;
            else            addValue = 0;

            var xPos = sqLength * (xx * 2 + addValue);
            var yPos = sqLength * yy ;

            var squareMesh = addShape(squareShape, extrudeSettings, 0x000000, xPos, yPos, 0);
            squareMesh.originalX = xPos;
            squareMesh.originalY = yPos;
            meshArr[countX][countY] = squareMesh;


            countY++;
        }

        countX++;
        countY = 0;
    }

    randomGenerator();

    //

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function onDocumentMouseDown(event) {

    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

}

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

}

function onDocumentMouseUp(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentMouseOut(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

    }

}

//

function animate() {

    requestAnimationFrame(animate);

    for(var ii = 0; ii < meshArr.length; ii++){
        //meshArr[ii][yy].position.x ++;
        meshArr[ii][yy].position.y = meshArr[ii][yy].originalY + sqLength * (2 * (Math.random() + Math.random() +Math.random())/3   - 1);
    }

    render();

}

function render() {

    renderer.render(scene, camera);

}

function randomGenerator(){
    yy++;// = (Math.random() * 12 ) | 0;

    setTimeout(randomGenerator, 1000);
}
