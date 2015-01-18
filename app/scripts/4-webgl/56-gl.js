
window.onload = loadScene;

function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

var tempCanvas = document.createElement('canvas');
var tempCtx = tempCanvas.getContext('2d');
var scaleFactor = backingScale(tempCtx);

var canvas, gl,
    ratio,
    vertices,
    velocities,
    freqArr,
    cw,
    ch,
    colorLoc,
    thetaArr,
    velThetaArr,
    velRadArr,
    boldRateArr,
    drawType,
    numLines = 80000;
var targetArr = [];

var randomTargetXArr = [], randomTargetYArr = [];
drawType = 2;


/**
 * Initialises WebGL and creates the 3D scene.
 */


function Target(rad){
    this.x = 0;
    this.y = 0;
    this.rotate = 0;
    this.radius = 0;
    this.baseRad = rad;

    this.update();
};

Target.prototype = {
    freqSpecial : 0.0,
    update : function() {
        this.rotate_speed = curObject.rotateSpeed + Math.random() * curObject.rotateSpeedRandom;//Math.random(1) * 0.2 + 0.001;
        //this.friction = Math.random(1) * 0.8 + 0.1;
        this.speed = Math.random(1) * curObject.speed + curObject.speed;
        this.step = Math.random() * curObject.stepRandom + curObject.step;

        this.freq = curObject.freq + curObject.freqRandom * Math.random() + this.freqSpecial;
        this.bold_rate = this.baseRad * (curObject.boldRate + Math.random()*curObject.boldRandom) ;
        //console.log(this.)
    }
}


var curObject = {
    rotateSpeed : 0.000,
    rotateSpeedRandom: 0,
    speed : 0.03,
    speedRandom : 0.0,
    step        : 0,
    stepRandom  : 0.0,
    freq : 0.01,
    freqSpecial : 0.0,
    freqRandom : 0.00,
    boldRate    : 1.0,
    boldRandom  :0,
    update : function(){
        onControllerChange(0);
    }
};

var onControllerChange = function(value){

    for(var ii = 0; ii < targetArr.length; ii++) {
     targetArr[ii].update();

    }
};

var gui = new dat.GUI();
var rotSpeedController = gui.add(curObject, 'rotateSpeed', 0.000, 0.005);
var rotSpeedRandomController = gui.add(curObject, 'rotateSpeedRandom', 0.00, 0.1);
var stepController = gui.add(curObject, 'step', 0.0, 1);
var stepRandomController = gui.add(curObject, 'stepRandom', 0.0, 1);
var speedController = gui.add(curObject, 'speed', 0, 0.2);
var speedRandomController = gui.add(curObject, 'speedRandom', 0, 0.6);
var freqController = gui.add(curObject, 'freq', 0.00, 1);
var freqRandomController = gui.add(curObject, 'freqRandom', 0.00,.1);
var boldRateController = gui.add(curObject, "boldRate", 0, 1.0);
var bolRandomController = gui.add(curObject, "boldRandom", 0, 1.0);
var updateController = gui.add(curObject, 'update');

rotSpeedController.onChange(onControllerChange);
rotSpeedRandomController.onChange(onControllerChange);
speedController.onChange(onControllerChange);
speedRandomController.onChange(onControllerChange);
boldRateController.onChange(onControllerChange);
bolRandomController.onChange(onControllerChange);
freqController.onChange(onControllerChange);
freqRandomController.onChange(onControllerChange);
stepController.onChange(onControllerChange);
stepRandomController.onChange(onControllerChange);


var incNum = 0.02;
var incSign = +1;
var count = 0;
function onChangeTimer(){
    curObject.step +=  incNum * incSign * (count + 1);
    curObject.freq += incNum * incSign * (count + 1);

    onControllerChange(0);

    //count = count + count + 1;
    count++;
    if(count < 4) setTimeout(onChangeTimer, 500);
    else setTimeout(backTimer, 500);

}
circleCount = 1;
function backTimer(){

    circleCount++;

    if(circleCount > 7){
        circleCount = 1;

        targetArr = [];
        var targetRad = 1.0;
        var target = new Target(targetRad);
        targetArr.push(target);

    }else {

        for (var ii = (circleCount - 1) * (circleCount - 1); ii < circleCount * circleCount; ii++) {
            var targetRad = 1.0;
            var target = new Target(targetRad);
            targetArr.push(target);
        }


        var targetNumber = targetArr.length;
        var kankaku = 2.0 / ( circleCount );

        for (var xx = 0; xx < circleCount; xx++) {
            for (var yy = 0; yy < circleCount; yy++) {
                var num = xx + yy * circleCount;

                targetArr[num].baseRad = .9 / circleCount;
                targetArr[num].x = 1.0 - kankaku * (xx + .5);
                targetArr[num].y = 1.0 - kankaku * (yy + .5);
                targetArr[num].freqSpecial = (xx + yy) * 0.01;
            }
        }
    }



    count = 0;
    curObject.step = 0.00; curObject.freq = 0.01;
    onControllerChange(0);



    setTimeout(onChangeTimer, 300);
}

/*
rotSpeedController.onChange(function(value) {
    // Fires on every change, drag, keypress, etc.
    console.log("change")
});
*/






function loadScene() {
    //    Get the canvas element
    canvas = document.getElementById("c");
    //    Get the WebGL context
    gl = canvas.getContext("experimental-webgl");
    //    Check whether the WebGL context is available or not
    //    if it's not available exit
    if (!gl) {
        alert("There's no WebGL context available.");
        return;
    }
    //    Set the viewport to the canvas width and height
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;
    gl.viewport(0, 0, canvas.width, canvas.height);

    var vertexShaderScript = document.getElementById("shader-vs");
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderScript.text);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert("Couldn't compile the vertex shader");
        gl.deleteShader(vertexShader);
        return;
    }

    var fragmentShaderScript = document.getElementById("shader-fs");
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderScript.text);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert("Couldn't compile the fragment shader");
        gl.deleteShader(fragmentShader);
        return;
    }

    //    Create a shader program.
    gl.program = gl.createProgram();
    gl.attachShader(gl.program, vertexShader);
    gl.attachShader(gl.program, fragmentShader);
    gl.linkProgram(gl.program);
    if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
        alert("Unable to initialise shaders");
        gl.deleteProgram(gl.program);
        gl.deleteProgram(vertexShader);
        gl.deleteProgram(fragmentShader);
        return;
    }

    gl.useProgram(gl.program);
    var vertexPosition = gl.getAttribLocation(gl.program, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    gl.clearColor(0.1, 0.1, 0.12, 1.0);
    gl.clearDepth(1.0);

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // ------------------

    setup();

    // ------------------


    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //    Define the viewing frustum parameters
    //    More info: http://en.wikipedia.org/wiki/Viewing_frustum
    //    More info: http://knol.google.com/k/view-frustum
    var fieldOfView = 30.0;
    var aspectRatio = canvas.width / canvas.height;
    var nearPlane = 1.0;
    var farPlane = 10000.0;
    var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
    var bottom = -top;
    var right = top * aspectRatio;
    var left = -right;

    //     Create the perspective matrix. The OpenGL function that's normally used for this,
    //     glFrustum() is not included in the WebGL API. That's why we have to do it manually here.
    //     More info: http://www.cs.utk.edu/~vose/c-stuff/opengl/glFrustum.html
    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = (farPlane + nearPlane) / (farPlane - nearPlane);
    var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
    var x = (2 * nearPlane) / (right - left);
    var y = (2 * nearPlane) / (top - bottom);
    var perspectiveMatrix = [
        x, 0, a, 0,
        0, y, b, 0,
        0, 0, c, d,
        0, 0, -1, 0
    ];

    //     Create the modelview matrix
    //     More info about the modelview matrix: http://3dengine.org/Modelview_matrix
    //     More info about the identity matrix: http://en.wikipedia.org/wiki/Identity_matrix
    var modelViewMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    //     Get the vertex position attribute location from the shader program
    var vertexPosAttribLocation = gl.getAttribLocation(gl.program, "vertexPosition");
    //     Specify the location and format of the vertex position attribute
    gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0);
    //gl.vertexAttribPointer(colorLoc, 4.0, gl.FLOAT, false, 0, 0);
    //     Get the location of the "modelViewMatrix" uniform variable from the
    //     shader program
    var uModelViewMatrix = gl.getUniformLocation(gl.program, "modelViewMatrix");
    //     Get the location of the "perspectiveMatrix" uniform variable from the
    //     shader program
    var uPerspectiveMatrix = gl.getUniformLocation(gl.program, "perspectiveMatrix");
    //     Set the values
    gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix));
    gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));

    animate();
    setTimeout(timer, 1500);
}
var count = 0;
var cn = 0;

function animate() {
    requestAnimationFrame(animate);
    drawScene();
}


function drawScene() {
    draw();

    gl.lineWidth(2);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //gl.drawArrays( gl.LINES_STRIP, 0, numLines );
    gl.drawArrays(gl.LINES, 0, numLines);
    //gl.drawArrays( gl.QUAD_STRIP, 0, numLines );

    gl.flush();
}

// ===================================
function setup() {
    setup00();

    setTimeout(onChangeTimer, 300);
}


function draw() {
    /*
     switch (drawType) {
     case 0:
     draw0();
     break;
     case 1:
     draw1();
     break;
     case 2:
     draw2();
     break;
     }
     */

    draw00();
}

// ===================================

function setup00() {

    vertices = [];
    velThetaArr = [];
    velRadArr = [];
    ratio = cw / ch;
    velocities = [];
    thetaArr = [];
    freqArr = [];
    boldRateArr = [];



    // -------------------------------
    //var minSize = Math.min(window.innerWidth, scale.innerHeight);
    var widthScale = window.innerWidth / window.innerHeight;
    var height = 340 * scaleFactor;


    var X_MAX_NUM = parseInt(window.innerWidth / height);
    var Y_MAX_NUM = parseInt(window.innerHeight / height);
    // 2 -> window.innerHeight
    // ? -> 50

    var targetRad =  1.0;
    var xPos, yPos;
    var target = new Target(targetRad);
    target.x = 0;
    target.y = 0;

    targetArr.push(target);

    for(var ii = 0; ii < numLines; ii++){
        vertices.push( 0, 0, 1.83);
        vertices.push( 0, 0, 1.83);
    }


    vertices = new Float32Array(vertices);
    velocities = new Float32Array(velocities);

}

// -------------------------------

function draw00(){

    for(var ii = 0; ii < targetArr.length; ii++ ){
        targetArr[ii].rotate += targetArr[ii].rotate_speed;
    }

    var tRad, tX, tY;
    var bp, px, py;
    var target;
    var side = .5 / window.innerHeight;
    for(var ii = 0; ii < numLines * 2; ii += 2){
        bp = ii * 3;

        target = targetArr[ (ii/2) % targetArr.length];
        tRad   = Math.cos(target.rotate * 2.321 + target.freq * ii ) * target.bold_rate ;

        tX = target.x + Math.cos(target.rotate + target.step * ii) * tRad;
        tY = target.y + Math.sin(target.rotate + target.step * ii) * tRad;



        px = vertices[bp + 3];
        py = vertices[bp + 4];

        px += (tX - px) * .3;
        py += (tY - py) * .3;

        vertices[bp + 3] = px;
        vertices[bp + 4] = py;


        vertices[bp ] = px-side;
        vertices[bp + 1] = py-side;

    }

}


// ===================================

// -------------------------------

function timer() {

    /*
     for(var ii = 0; ii < targetArr.length; ii++) {
     targetArr[ii].update();
     }


     setTimeout(timer, 1500);*/
}
