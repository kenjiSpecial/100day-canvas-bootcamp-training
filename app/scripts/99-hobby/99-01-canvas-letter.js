// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

// ================

init();
loop();

function init(){

    ctx.textBaseline="middle";
    ctx.font= 60 + "px Arial";
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

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


    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;