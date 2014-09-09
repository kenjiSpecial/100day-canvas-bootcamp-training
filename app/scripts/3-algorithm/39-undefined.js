// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var rad = 10;

var CircleTopLeft = function( xPos, yPos ){
    this.ctx = ctx;

    this.x = xPos;
    this.y = yPos;

    this.changePos();
};

CircleTopLeft.prototype = {
    col : "#fff",

    changePos : function(){

    },

    update : function(){
        this.ctx.save();

        this.ctx.translate(this.x, this.y);

        this.ctx.beginPath();
        this.ctx.moveTo( 0, 0);
        this.ctx.lineTo( rad * Math.cos(Math.PI), rad * Math.sin(Math.PI) );
        this.ctx.arc(0, 0, rad, Math.PI, Math.PI * 3 / 2, false);
        this.ctx.lineTo( rad * Math.cos(3 / 2 * Math.PI), rad * Math.sin(3 / 2 * Math.PI) );
        this.ctx.closePath();

        this.ctx.fillStyle = this.col;
        this.ctx.fill();

        this.ctx.restore();
    }
};

var CircleTopRight = function( xPos, yPos ){
    this.ctx = ctx;

    this.x = xPos;
    this.y = yPos;

};

CircleTopRight.prototype = {
    col : "#fff",
    update : function(){

    }
};

var CircleBottomLeft = function( xPos, yPos ){

};

CircleBottomLeft.prototype = {
    col : "#fff",
    update : function(){

    }
};

var CircleBottomRight = function( xPos, yPos ){

};

CircleBottomRight.prototype = {
    col : "#fff",
    update : function(){

    }
};

// ================
var circleTopLeft;
// ================

init();
loop();

function init(){
    circleTopLeft = new CircleTopLeft(width/2, height/2);


    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    circleTopLeft.update();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;