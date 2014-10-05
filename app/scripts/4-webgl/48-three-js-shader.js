var scene, camera, renderer;
var vertexShaderString, fragmentShaderString;
var character = null;

var width, height, prevTime;
var canvas = document.getElementById('c');

width = window.innerWidth;
height = window.innerHeight;

canvas.width = width;
canvas.height = height;

var yoCanvas = document.createElement("canvas")
yoCanvas.width = width;
yoCanvas.height = height;
var yoCtx    = yoCanvas.getContext('2d');

var canvasTexture;

// ==================

var mRenderer;
var mScene;
var mCamera;
var mUniforms;
var mColors;
var mColorsNeedUpdate = true;
var mLastTime = 0;

var mTexture1, mTexture2;
var mGSMaterial, mScreenMaterial;
var mScreenQuad;

var mToggled = false;

var mMinusOnes = new THREE.Vector2(-1, -1);
/*
var presets = [
    { // Default
        //feed: 0.018,
        //kill: 0.051
        feed: 0.037,
        kill: 0.06
    },
    { // Holes
        feed: 0.039,
        kill: 0.058
    },

    { // Chaos and holes (by clem)
        feed: 0.034,
        kill: 0.056
    },

    { // The U-Skate World
        feed: 0.062,
        kill: 0.06093
    }
]; */
var presets = [
    { // Default
        //feed: 0.018,
        //kill: 0.051
        feed: 0.037,
        kill: 0.06
    },
    { // Solitons
        feed: 0.03,
        kill: 0.062
    },
    { // Pulsating solitons
        feed: 0.025,
        kill: 0.06
    },
    { // Worms.
        feed: 0.078,
        kill: 0.061
    },
    { // Mazes
        feed: 0.029,
        kill: 0.057
    },
    { // Holes
        feed: 0.039,
        kill: 0.058
    },
    { // Chaos
        feed: 0.026,
        kill: 0.051
    },
    { // Chaos and holes (by clem)
        feed: 0.034,
        kill: 0.056
    },
    { // Moving spots.
        feed: 0.014,
        kill: 0.054
    },
    { // Spots and loops.
        feed: 0.018,
        kill: 0.051
    },
    { // Waves
        feed: 0.014,
        kill: 0.045
    },
    { // The U-Skate World
        feed: 0.062,
        kill: 0.06093
    }
]
// Configuration.
var count = 0;
var feed = presets[count].feed;
var kill = presets[count].kill;


function init() {
    setText();
    setCanvasTexture();
    var canvas = document.getElementById("c");
    mRenderer = new THREE.WebGLRenderer({canvas: canvas, preserveDrawingBuffer: true, alpha: true});

    mScene = new THREE.Scene();
    mCamera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10000, 10000);
    mCamera.position.z = 100;
    mScene.add(mCamera);

    mUniforms = {
        screenWidth: {type: "f", value: undefined},
        screenHeight: {type: "f", value: undefined},
        tSource: {type: "t", value: undefined},
        canvasSource : {type: "t", value: canvasTexture},
        delta: {type: "f", value: 1.0},
        feed: {type: "f", value: feed},
        kill: {type: "f", value: kill},
        brush: {type: "v2", value: new THREE.Vector2(-10, -10)},
        color1: {type: "v4", value: new THREE.Vector4(0, 0, 0.0, 0)},
        color2: {type: "v4", value: new THREE.Vector4(0.1, .1, .1, 0.2)},
        color3: {type: "v4", value: new THREE.Vector4(1.0,1.0, 1.0, 0.4)},
        color4: {type: "v4", value: new THREE.Vector4(.1,.1,.1, 0.7)},
        color5: {type: "v4", value: new THREE.Vector4(1.0,1.0,1.0, 0.9)}
    };
    mColors = [mUniforms.color1, mUniforms.color2, mUniforms.color3, mUniforms.color4, mUniforms.color5];

    mGSMaterial = new THREE.ShaderMaterial({
        uniforms: mUniforms,
        vertexShader: [
            "varying vec2 vUv;",
            "void main(){",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
        ].join("\n"),
        fragmentShader: [
            "varying vec2 vUv;",
            "uniform float screenWidth;",
            "uniform float screenHeight;",
            "uniform sampler2D tSource;",
            "uniform sampler2D canvasSource;",
            "uniform float delta;",
            "uniform float feed;",
            "uniform float kill;",
            "uniform vec2 brush;",
            "vec2 texel = vec2(1.0/screenWidth, 1.0/screenHeight);",
            "float step_x = 1.0/screenWidth;",
            "float step_y = 1.0/screenHeight;",
            "void main()",
            "{",
            "    if(brush.x < -5.0)",
            "    {",
            "        //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
            "        //return;",
            "    }",
            "    ",
            "    ",
            "    vec2 uv = texture2D(tSource, vUv).rg;",
            "    vec2 uv0 = texture2D(tSource, vUv+vec2(-step_x, 0.0)).rg;",
            "    vec2 uv1 = texture2D(tSource, vUv+vec2(step_x, 0.0)).rg;",
            "    vec2 uv2 = texture2D(tSource, vUv+vec2(0.0, -step_y)).rg;",
            "    vec2 uv3 = texture2D(tSource, vUv+vec2(0.0, step_y)).rg;",
            "    ",
            "    vec2 lapl = (uv0 + uv1 + uv2 + uv3 - 4.0*uv);//10485.76;",
            "    float du = /*0.00002*/0.2097*lapl.r - uv.r*uv.g*uv.g + feed*(1.0 - uv.r);",
            "    float dv = /*0.00001*/0.105*lapl.g + uv.r*uv.g*uv.g - (feed+kill)*uv.g;",
            "    vec2 dst = uv + delta*vec2(du, dv);",
            "    ",
            "    if(brush.x > 0.0)",
            "    {",
            "        vec2 diff = (vUv - brush)/texel;",
            "        float dist = dot(diff, diff);",
            "        if(dist < 10.0)",
            "            dst.g = 0.9;",
            "    }",
            "    float canvasValue = texture2D(canvasSource, vUv).g;",
            "    if(canvasValue < 0.1){ dst.g = 0.0; }",

            /*
            "    if(vUv.x < 0.2)",
            "    {",
            "        dst.g = 0.0;",
            "    }",
            "    ", */
            "    gl_FragColor = vec4(dst.r, dst.g, 0.0, 0);",
            "}"
        ].join("\n")
    });
    mScreenMaterial = new THREE.ShaderMaterial({
        uniforms: mUniforms,
        vertexShader: [
            "varying vec2 vUv;",
            "void main(){",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}"
        ].join("\n"),
        fragmentShader: [
            "varying vec2 vUv;",
            "uniform vec2 brush;",
            "uniform float screenWidth;",
            "uniform float screenHeight;",
            "uniform sampler2D tSource;",
            "uniform sampler2D canvasSource;",
            "uniform float delta;",
            "uniform float feed;",
            "uniform float kill;",
            "uniform vec4 color1;",
            "uniform vec4 color2;",
            "uniform vec4 color3;",
            "uniform vec4 color4;",
            "uniform vec4 color5;",

            "vec2 texel = vec2(1.0/screenWidth, 1.0/screenHeight);",

            "void main()",
            "{",
            "    float value = texture2D(tSource, vUv).g;",
            "    //int step = int(floor(value));",
            "    //float a = fract(value);",
            "    float a;",
            "    vec3 col;",
            "    ",
            "    if(value <= color1.a)",
            "        col = color1.rgb;",
            "    if(value > color1.a && value <= color2.a)",
            "    {",
            "        a = (value - color1.a)/(color2.a - color1.a);",
            "        col = mix(color1.rgb, color2.rgb, a);",
            "    }",
            "    if(value > color2.a && value <= color3.a)",
            "    {",
            "        a = (value - color2.a)/(color3.a - color2.a);",
            "        col = mix(color2.rgb, color3.rgb, a);",
            "    }",
            "    if(value > color3.a && value <= color4.a)",
            "    {",
            "        a = (value - color3.a)/(color4.a - color3.a);",
            "        col = mix(color3.rgb, color4.rgb, a);",
            "    }",
            "    if(value > color4.a && value <= color5.a)",
            "    {",
            "        a = (value - color4.a)/(color5.a - color4.a);",
            "        col = mix(color4.rgb, color5.rgb, a);",
            "    }",
            "    if(value > color5.a)",
            "        col = color5.rgb;",
            "    ",

            "    gl_FragColor = vec4( col.r, col.g, col.b, 1.0);",
            "}"
        ].join("\n")
    });

    var plane = new THREE.PlaneGeometry(1.0, 1.0);
    mScreenQuad = new THREE.Mesh(plane, mScreenMaterial);
    mScene.add(mScreenQuad);


    mTexture1 = new THREE.WebGLRenderTarget(width / 2, height / 2,
        {minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            type: THREE.FloatType});
    mTexture2 = new THREE.WebGLRenderTarget(width / 2, height / 2,
        {minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            type: THREE.FloatType});
    mTexture1.wrapS = THREE.RepeatWrapping;
    mTexture1.wrapT = THREE.RepeatWrapping;
    mTexture2.wrapS = THREE.RepeatWrapping;
    mTexture2.wrapT = THREE.RepeatWrapping;

    mUniforms.screenWidth.value = width / 2;
    mUniforms.screenHeight.value = height / 2;


    loop(0);

    mUniforms.brush.value = new THREE.Vector2(0.5, 0.5);
    mLastTime = new Date().getTime();

    setTimeout(updateScott, 3000);
    setTimeout(updateClear, 1000);
}

function updateClear(){
    mUniforms.brush.value = new THREE.Vector2(0.5, 0.5);
    //mUniforms.brush.value = new THREE.Vector2(-10, -10);
    setTimeout(updateClear, 1000);
}

function updateScott(){

	count = (count + 1) % presets.length;
	console.log(count)
	feed = presets[count].feed;
	kill = presets[count].kill;

    /*
	setTimeout(function(){
		mUniforms.brush.value = new THREE.Vector2(0.5, 0.5);
	}, 100);*/

	setTimeout(updateScott, 3000);
}

function setCanvasTexture(){
    canvasTexture = new THREE.Texture(yoCanvas);

    canvasTexture.magFilter = THREE.NearestFilter;
    canvasTexture.needsUpdate = true;
}

function setText(){

    yoCtx.fillStyle = "#fff";
    yoCtx.fillRect( 0, 0, width, height );

    /*
    yoCtx.fillStyle = "#000000";
    yoCtx.fillRect(width/4, height/4, width/2, height/4);
    */
    var textLeft;
    var textTop;
    var xPos, yPos;
    var txt="YO";
    yoCtx.font = "Bold 80px Arial";

    var textWidth = yoCtx.measureText(txt);
    var textExtraWidth = textWidth.width * 2;

    var extraHeight = 100 ;

    for(var yy = 0; yy < height/extraHeight; yy++){
        for(var xx = 0; xx < width / textExtraWidth; xx++){

            yoCtx.fillStyle = '#000';

            if(yy % 2 == 0) xPos = textExtraWidth * xx;
            else        	xPos = textExtraWidth * (xx - .5);

            yPos = extraHeight * yy + 40;

            yoCtx.save();
            yoCtx.translate(xPos, yPos);
            yoCtx.fillText(txt,0,0);
            yoCtx.restore();
        }

    }


    //canvasTexture.needsUpdate = true;
}

function loop(time) {
    var dt = (time - mLastTime) / 20.0;
    if (dt > 0.8 || dt <= 0)    dt = 0.8;
    dt = .8;
    mLastTime = time;



    //mUniforms.brush.value = new THREE.Vector2(0.5, 0.5);

    mScreenQuad.material = mGSMaterial;
    mUniforms.delta.value = 1;
    mUniforms.feed.value = feed;
    mUniforms.kill.value = kill;

    for (var i = 0; i < 60; ++i) {

        if (!mToggled) {
            mUniforms.tSource.value = mTexture1;
            mRenderer.render(mScene, mCamera, mTexture2, true);
            mUniforms.tSource.value = mTexture2;
        }
        else {
            mUniforms.tSource.value = mTexture2;
            mRenderer.render(mScene, mCamera, mTexture1, true);
            mUniforms.tSource.value = mTexture1;
        }

        mToggled = !mToggled;
        mUniforms.brush.value = mMinusOnes;
        //mUniforms.brush.value = new THREE.Vector2(0.5, 0.5);
    }

    mScreenQuad.material = mScreenMaterial;

    mRenderer.render(mScene, mCamera);

    requestAnimationFrame(loop);
}


//

init();
