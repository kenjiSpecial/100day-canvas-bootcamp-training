// --------------------------
var scene, camera, renderer;
var vertexShaderString, fragmentShaderString;
var character = null;

var width, height, prevTime;
var canvas = document.getElementById('c');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================


// ================
var tempCanvas, tempCtx;

createCanvas();
init();
loop();

function createCanvas(){
    tempCanvas = document.createElement("canvas");
    //canvas.width  = width;
    //canvas.height = height;
    tempCtx = tempCanvas.getContext("2d");

    // ----------------
    /*

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    var txt="YO!";
    ctx.fillStyle = '#fff';
    var textWidth = ctx.measureText(txt);
    var textLeft = (width - textWidth.width)/2;
    var textTop = height/2;

    ctx.save();
    ctx.translate(textLeft, textTop);
    ctx.fillText(txt,0,0);
    ctx.restore();

    */
    // ----------------
    tempCtx.font = "Bold 40px Arial";
    tempCtx.fillStyle = "rgba(255,0,0,0.95)";
    tempCtx.fillText('YO!', 0, 50);


}

var texture1;

function init(){
    scene = new THREE.Scene();

    var VIEW_ANGLE= 45;
    var ASPECT = width / height;
    var NEAR = 0.2;
    var FAR = 1000;

    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 0, 5);
    camera.lookAt(scene.position);

    // ---------------

    renderer = new THREE.WebGLRenderer({
        canvas : canvas,
        antialias : true,
        alpha : true
    });
    //renderer.setSize(width, height);

    var g = new THREE.PlaneGeometry(1.0, 1.0);
    var creatureImage = THREE.ImageUtils.loadTexture("/image/texture.png");

    texture1 = new THREE.Texture(tempCanvas);
    texture1.needsUpdate = true;

    texture1.magFilter = THREE.NearestFilter;
    creatureImage.magFilter = THREE.NearestFilter;

    var mat = new THREE.ShaderMaterial({
        uniforms : {
            color : {type: 'f', value: 0.0},
            evilCreature : {type: 't', value: texture1}
        },
        vertexShader : [
            "varying vec2 vUv;",
            "void main(){",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader : [
            "precision highp float;",
            "varying vec2 vUv;",
            "uniform sampler2D evilCreature;",
            "void main(void){",
            "gl_FragColor = texture2D(evilCreature, vUv);",
            "}"
        ].join("\n"),
        transparent: true
    });


    character = new THREE.Mesh(g, mat);
    scene.add(character);

    // --------------------------

    var light = new THREE.PointLight(0xffffff, 1.0);
    light.position.set( 0.0, 0.0, 0.1 );
    scene.add(light);

}

function loop(){
    loopCanvas();


    renderer.render( scene, camera );

    requestAnimationFrame(loop);
}


function loopCanvas(){
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.font = "Bold 40px Arial";
    tempCtx.fillStyle = "rgba(255,0,0,0.95)";
    tempCtx.fillText('YO!', Math.random() * 2 - 1, 50 + Math.random() * 2 - 1);

    texture1.needsUpdate = true;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;