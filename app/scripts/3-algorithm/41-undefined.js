// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

var bigRad = 200;

// ================
var Circle = function(baseTheta){
    this.ctx = ctx;

    this.rad = parseInt(100 + 30 * Math.random());

    this.theta = 0;
    this.tehtaVel = Math.PI / 20;

    this.baseTheta = baseTheta | 0;

    this.x = width/2 + Math.cos(baseTheta) * bigRad;
    this.y = height/2 + Math.sin(baseTheta) * bigRad;

    this.ptX = this.x + this.rad * Math.cos(this.theta);
    this.ptY = this.y + this.rad * Math.sin(this.theta);
    this.ptRad = 10;

    this.velTheta = Math.random() * 0.05 + 0.01;
};

Circle.prototype = {
    update : function(){
        this.baseTheta += 0.01;
        this.theta += this.velTheta;

        this.x = width/2  + Math.cos(this.baseTheta) * bigRad;
        this.y = height/2 + Math.sin(this.baseTheta) * bigRad;
        this.ptX = this.x + this.rad * Math.cos(this.theta);

        this.ptY = this.y + this.rad * Math.sin(this.theta);


        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "#fff";
        this.ctx.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = "#fff";
        this.ctx.arc(this.ptX, this.ptY, this.ptRad, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.restore();
    }
};

// ================
var circle1;
var circle2;
var circle3;

init();
loop();

function init(){
    circle1 = new Circle(0);
    circle2 = new Circle(2/3*Math.PI);
    circle3 = new Circle(4/3*Math.PI);


    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    circle1.update();
    circle2.update();
    circle3.update();

    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.moveTo(circle1.ptX, circle1.ptY);
    ctx.lineTo(circle2.ptX, circle2.ptY);
    ctx.lineTo(circle3.ptX, circle3.ptY);
    ctx.lineTo(circle1.ptX, circle1.ptY);
    ctx.stroke();
    ctx.closePath();



    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;