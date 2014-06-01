// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

sw = 1000;
sh = 1000;
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

var Circles = function(ctx){
    var circle;
    this.circles = [];
    var side = 300;

    for(var x = 0; x < this.sideNum; x++){
        for(var y = 0; y < this.sideNum; y++){

            if(x % 3 == 0 && y % 3 == 0) circle = new Rect(ctx, side * (x - this.sideNum/2), side * (y - this.sideNum/2))
            else                         circle = new Circle(ctx, side * (x - this.sideNum/2), side * (y - this.sideNum/2))



            this.circles.push(circle);
        }
    }
};

Circles.prototype = {
    sideNum : 24,
    t : 0,
    update : function(){
        this.t += .01;
        camera.focus = 50 - 40 * Math.cos(this.t);

        for(var i in this.circles){
            this.circles[i].update();
        }
    }
};

var Circle = function(ctx, x, y){
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.z = -100;

    this.rad =100;
    this.col = '#fff';


};

Circle.prototype = {
    update : function(){
        this.ctx.fillStyle = '#fff';

        var scale = ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - this.z))* camera.zoom;

        var xPos = this.x * scale;
        var yPos = this.y * scale;
        var rad  = this.rad * scale;


        this.ctx.save();

        this.ctx.translate(camera.display.x, camera.display.y);

        this.ctx.beginPath();
        this.ctx.arc(xPos, yPos, rad, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.restore();
    }
};

var Rect = function(ctx, x, y){
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.z = -100;

    this.rad =100;
    this.col = '#fff';
};

Rect.prototype = {
    update : function(){
        this.ctx.fillStyle = '#fff';

        var scale = ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - this.z))* camera.zoom;

        var xPos = this.x * scale;
        var yPos = this.y * scale;
        var rad  = this.rad * scale;


        this.ctx.save();

        this.ctx.translate(camera.display.x, camera.display.y);

        this.ctx.beginPath();
        this.ctx.fillRect(xPos - rad, yPos -rad , rad * 2, rad * 2);
        this.ctx.closePath();

        this.ctx.restore();
    }
};



// ================
var circles;

init();
loop();

function init(){
    circles = new Circles(ctx);

    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    circles.update();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;