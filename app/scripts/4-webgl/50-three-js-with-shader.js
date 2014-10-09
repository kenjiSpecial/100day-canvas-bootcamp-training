// --------------------------

var width, height, prevTime;
var velArr;
var xPosArr;

                                                                                                                                                                                                                                                                                                                                                                                                                                     var isText = false;

var totalWidth = 0;
var canvas = document.getElementById('c');

var canvasTexture;
var textureCanvas = document.createElement("canvas");
textureCanvas.width = window.innerWidth;
textureCanvas.height = window.innerHeight;
var textureCtx    = textureCanvas.getContext("2d");

var camera, scene, renderer;
var uniforms;

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

var col = {bl: 100};
var tl = new TimelineLite();
tl.to( col, 2, {bl: 200, onComplete: onComplete1});

function onComplete1(){
    tl.to( col, 2, {bl: 100, onComplete: onComplete2, delay:.5});
}

function onComplete2(){
    tl.to( col, 2, {bl: 200, onComplete: onComplete1, delay:.5});
}


// ================

// ================

init();
loop();

function init(){

    setCanvasTexture();
    setText();

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneGeometry( 2, 2 );

    uniforms = {
        canvasSource : {type: 't', value: canvasTexture},
        time : {type: "f", value: 1.0},
        resolution : { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial({
        uniforms : uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer({canvas: canvas});
    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;

    renderer.setSize( window.innerWidth, window.innerHeight );



}

function loop(){
    uniforms.time.value += 0.05;
    setText();

    renderer.render( scene, camera );

    requestAnimationFrame(loop);
}

function setText(){

    textureCtx.fillStyle = "#fff";
    textureCtx.fillRect( 0, 0, width, height );

    /*
     yoCtx.fillStyle = "#000000";
     yoCtx.fillRect(width/4, height/4, width/2, height/4);
     */
    var date = new Date();
    var curHour = date.getHours();
    var curHourStr = curHour < 10 ? "0" + curHour : curHour;
    var curMin = date.getMinutes();
    var curMinStr = curMin <10 ? "0" + curMin : curMin;
    var curSec = date.getSeconds();
    var curSecStr = curSec < 10 ? "0" + curSec : curSec;
    var curTime = curHourStr + ":" + curMinStr + ":" + curSecStr;

    var textLeft;
    var textTop;
    var xPos, yPos;
    textureCtx.font = "Bold 80px Helvetica";

    var textWidth = textureCtx.measureText(curTime);
    var textExtraWidth = textWidth.width * 1.2;

    var extraHeight = 80 ;

    if(!velArr){
        velArr = [];
        for(var yy = 0; yy < height/extraHeight + 1; yy++){
            velArr[yy] = -Math.random()  - .5;
        }

        xPosArr = [];


        for(var yy = 0; yy < height/extraHeight + 1; yy++){
            xPosArr[yy] = [];
            for(var xx = 0; xx < width / textExtraWidth + 2; xx++){
                xPos = textExtraWidth * xx + Math.random()*10 - 5 + velArr[yy];
                xPosArr[yy][xx] = xPos;

            }
        }

        totalWidth += parseInt(width / textExtraWidth + 3) * textExtraWidth;
    }

    var colNum = parseInt(col.bl)
    var colRgb = "rgb(" + colNum + ", " + colNum + ", " + colNum + ")";
    textureCtx.fillStyle = colRgb;

    for(var yy = 0; yy < height/extraHeight + 1; yy++){

        for(var xx = 0; xx < width / textExtraWidth + 2; xx++){


            textureCtx.font = "Bold 80px Helvetica";

            xPosArr[yy][xx] += velArr[yy];
            if(xPosArr[yy][xx] < -textExtraWidth) xPosArr[yy][xx] += totalWidth;

            yPos = extraHeight * yy ;

            //var fontNum = parseInt(75 + 10 *Math.random());

            //yoCtx.font = "Bold 80px Arial";
            textureCtx.save();
            textureCtx.translate(xPosArr[yy][xx], yPos);


            textureCtx.fillText(curTime,0,0);
            textureCtx.restore();
        }

    }


    if(canvasTexture) canvasTexture.needsUpdate = true;
}

function setCanvasTexture(){
    canvasTexture = new THREE.Texture(textureCanvas);

    canvasTexture.magFilter = THREE.NearestFilter;
    canvasTexture.needsUpdate = true;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;