// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var NumberZero = function(ctx){
    'use strict';
    this.ctx = ctx;
    this.x   = width/2;
    this.y   = height/2;
};

NumberZero.prototype = {
    update : function(){
        'use strict';

        this.ctx.beginPath();
        this.ctx.stroke();
        this.ctx.
    }
};

// ================
var shape;
init();
loop();

function init(){
    shape = new NumberZero(ctx):

    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    shape.update(duration);

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
