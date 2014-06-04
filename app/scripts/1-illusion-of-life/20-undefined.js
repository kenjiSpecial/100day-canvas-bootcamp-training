// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

var Point = function( x, y){
    this.x = x;
    this.y = y;
}

var Shape = function( ctx, x, y){
    this.center = new Point(x, y);
};

Shape.prototype = {
    update : function(){
    }
}

var Line = function(ctx, x, y){
    this.ctx = ctx;

    this.startPt = new Point( 0, 0);
    this.endPt   = new Point( 0, 0);
};

Line.prototype = {
    col : '#fff',
    update : function(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.col;
        this.ctx.moveTo(this.startPt.x, this.startPt.y);
        if(this.ptArr.length > 0){
        }
        this.ctx.lineTo(this.endPt.x, this.endPt.y);
        this.ctx.closePath();
    }
}

// ================

init();
loop();

function init(){

    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);


    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
