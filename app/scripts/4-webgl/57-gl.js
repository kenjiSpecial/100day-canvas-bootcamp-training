window.onload = loadScene;

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
    velRadArr0,
    velRadArr1,
    boldRateArr,
    drawType,
    numLines = 30000;

var colorArr = [];
var colorVbo;

var target = [];
var type = [];

var randomTargetXArr = [], randomTargetYArr = [];
drawType = 2;


/**
 * Initialises WebGL and creates the 3D scene.
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

    //    Load the vertex shader that's defined in a separate script
    //    block at the top of this page.
    //    More info about shaders: http://en.wikipedia.org/wiki/Shader_Model
    //    More info about GLSL: http://en.wikipedia.org/wiki/GLSL
    //    More info about vertex shaders: http://en.wikipedia.org/wiki/Vertex_shader

    //    Grab the script element
    var vertexShaderScript = document.getElementById("shader-vs");
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderScript.text);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert("Couldn't compile the vertex shader");
        gl.deleteShader(vertexShader);
        return;
    }

    //    Load the fragment shader that's defined in a separate script
    //    More info about fragment shaders: http://en.wikipedia.org/wiki/Fragment_shader
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
    //var vertexPosition = gl.getAttribLocation(gl.program, "a_position");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);


    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
;

    //color vbo



    // ------------------

    setup();

    // ------------------


    vertices = new Float32Array(vertices);
    velocities = new Float32Array(velocities);
    //console.log(c)
    colorArr = new Float32Array(colorArr);
    console.log(colorArr.length)

    /*
    thetaArr = new Float32Array(thetaArr);
    velThetaArr = new Float32Array(velThetaArr);
    velRadArr = new Float32Array(velRadArr);*/


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var colorVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
    gl.bufferData(gl.ARRAY_BUFFER, colorArr, gl.STATIC_DRAW);
    var colorPosAttrbLocation = gl.getAttribLocation(gl.program, "a_color");
    gl.enableVertexAttribArray(colorPosAttrbLocation);
    gl.vertexAttribPointer(colorPosAttrbLocation, 4.0, gl.FLOAT, false, 0, 0);


    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    var vertexPosAttribLocation = gl.getAttribLocation(gl.program, "a_position");
    gl.enableVertexAttribArray(vertexPosAttribLocation);
    gl.vertexAttribPointer(vertexPosAttribLocation, 2.0, gl.FLOAT, false, 0, 0);




    var resolutionLocation = gl.getUniformLocation( gl.program, "u_resolution" );
    gl.uniform2f( resolutionLocation, window.innerWidth, window.innerHeight );


    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    animate();
    //setTimeout(timer, 1500);
}
var count = 0;
var cn = 0;

function animate() {
    requestAnimationFrame(animate);
    drawScene();
}


function drawScene() {
    draw();

    gl.lineWidth(1);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, numLines);



    gl.flush();
}

// ===================================

var centerRadX = 90;
var centerRadY = 120;
var centerTheta = 0;
var centerVelTheta = .03;

function setup() {

    vertices = [];
    velThetaArr = [];

    velRadArr0 = [];
    velRadArr1 = [];

    ratio = cw / ch;
    velocities = [];
    thetaArr = [];
    freqArr = [];
    boldRateArr = [];

    // -------------------------------

    for (var ii = 0; ii < numLines; ii++) {
        var rad, rad2;
        var random1 = Math.random();
        var random2 = Math.random();

        if(random1 < .33) rad = 10;
        else if(random1 < .66) rad = 60;
        else    rad = 120;

        if(random2 < .33) rad2 = 60;
        else if(random2 < .66) rad2 = 100;
        else    rad2 = 140;

        var theta = Math.random() * Math.PI * 2;

        var freq = Math.random() * 0.12 + 0.03;
        var boldRate = Math.random() * .04 + .01;
        var randomPosX = (Math.random() * 2  - 1) * window.innerWidth / window.innerHeight;
        var randomPosY = Math.random() * 2 - 1;

        vertices.push(rad * Math.cos(theta), rad * Math.sin(theta));
        vertices.push(rad * Math.cos(theta), rad * Math.sin(theta));

        thetaArr.push(theta);


        velRadArr0.push(rad);
        velRadArr1.push(rad2);

        freqArr.push(freq);
        boldRateArr.push(boldRate);


        randomTargetXArr.push(randomPosX);
        randomTargetYArr.push(randomPosY);

        var colRand = Math.random();
        var col;
        if(colRand < 1/3)       {
            type.push(0);
            col = [0.8, 0.0, 0.0];
            var velTheta = (Math.random() * .2 + .8) * Math.PI * 2 / 300;
        }
        else if(colRand < 2/3) {
            type.push(1);
            col = [0.0, 0.8, 0.0];
            var velTheta = (Math.random() * .2 + .8) * Math.PI * 2 / 100;
        }else {
            type.push(2);
            col = [0.0, 0.0, 0.8];
            var velTheta = (Math.random() * .2 + .8) * Math.PI * 2 / 200;
        }

        colorArr.push(col[0], col[1], col[2], 0.06 );
        colorArr.push(col[0], col[1], col[2], 0.06 );

        velThetaArr.push(velTheta);

    }


    freqArr = new Float32Array(freqArr);

}

// -------------------------------


// ===================================
// -------------------------------
var theta1 = 0, theta2 = 0;
var rCount = Math.PI/2;
function draw() {



    cn += .1;

    var i, n = vertices.length, p, bp;
    var px, py;
    var cenX, cenY;
    var pTheta;
    var rad;
    var num;
    rCount += 0.03;
    var rRad = 10 * Math.sin(rCount);
    var transX, transY;

    centerTheta += centerVelTheta;
    cenX = centerRadX * Math.cos(centerTheta);
    cenY = centerRadY * Math.sin(centerTheta);

    theta1 += .01;
    theta2 += .02;

    for (i = 0; i < numLines * 2; i += 2) {
        bp = i * 2;

        num = parseInt(i / 2);

        if(type[num] == 0){
            transX = rRad * Math.cos(0);
            transY = rRad * Math.sin(0);
        }else if(type[num] == 2){
            transX = rRad * Math.cos(120/180*Math.PI);
            transY = rRad * Math.sin(120/180*Math.PI);
        }else{
            transX = rRad * Math.cos(240/180*Math.PI);
            transY = rRad * Math.sin(240/180*Math.PI);
        }
        pTheta = thetaArr[num];

        pTheta = pTheta + velThetaArr[num];
        thetaArr[num] = pTheta;

        rad = velRadArr0[num];

        px = rad * Math.cos(pTheta - theta2) + transX;
        py = rad * Math.sin(pTheta - theta1) + transY;

        vertices[bp + 2] = px + cenX;
        vertices[bp + 3] = py + cenY;

        rad = velRadArr1[num];
        px = rad * Math.cos(pTheta + theta1 ) +transX;
        py = rad * Math.sin(pTheta + theta2 ) +transY;

        vertices[bp] = px;
        vertices[bp + 1] = py;

    }
}

// -------------------------------


function timer() {
    drawType = (drawType + 1) % 3;

    setTimeout(timer, 1500);
}
