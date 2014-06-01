// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

var dtr = function(v) {return v * Math.PI/180;}
var camera = {
    focus : 10,
    self : {
        x : 0,
        y : 0,
        z : 0
    },
    rotate : {
        x : 0,
        y : 0,
        z : 0
    },
    up : {
        x : 0,
        y : 1,
        z : 0
    },
    zoom : 1,
    display : {
        x : width/2,
        y : height/2,
        z : 0
    }
};

var Point = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
};





var Shape = function(ctx){
    this.ctx = ctx;

    this.x = width / 2;
    this.y = height / 2;

    this.sideNum = 3;
    this.side    = 200;

    //    200              200
    // ----------      ----------
    // \        /     |          |
    //  \      /      |          |
    //   \    /       |          |
    //    \  /        |          |
    //     \/          ----------
    //  triangle

    var agnle = 180 * (number - 3)

    var triangleRad = this.side / Math.cos(Math.PI/6);
    var rectRad     = this.side / Math.cos()

};

Shape.prototype = {
    add    : function(){

    },

    update : function(){

    }
};

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