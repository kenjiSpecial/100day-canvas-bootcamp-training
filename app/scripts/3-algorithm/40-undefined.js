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

var xNum = 15;
var yNum = 7;
var halfXNum = 8;
var halfYNum = 4;

var kankaku = 20;

var xPosArr = [];
var yPosArr = [];

init();
loop();

var curRad = 20;

function init(){

    var halfWidth = width/2;
    var halfHeight = height/2;

    for(var xx = 0; xx < xNum; xx++){
        xPosArr[xx] = [];
        yPosArr[xx] = [];
        for(var yy = 0; yy < yNum; yy++){
            var xPos = halfWidth  + (xx - halfXNum) * kankaku;
            var yPos = halfHeight + (yy - halfYNum) * kankaku;

            xPosArr[xx][yy] = xPos;
            yPosArr[xx][yy] = yPos;

        }
    }

    prevTime = +new Date;

    timer()
}

function timer(){
    var rad =  curRad + 20;
    if(rad > 300) rad = 20;

    TweenLite.to(this,.5, { curRad: rad});

    setTimeout(timer, 600);
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.globalCompositeOperation  = 'source-over';

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    for(var xx = 0; xx < xNum; xx++) {
        for (var yy = 0; yy < yNum; yy++) {
            //xPosArr[xx][yy] += Math.random() - .5;
            //yPosArr[xx][yy] += Math.random() - .5;

            ctx.globalCompositeOperation = 'xor';

            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.arc(xPosArr[xx][yy], yPosArr[xx][yy], curRad, 0, 2*Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }
    }



    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;