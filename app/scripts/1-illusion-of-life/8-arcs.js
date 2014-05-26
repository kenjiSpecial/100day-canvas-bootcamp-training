function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var Rect = function( ctx, x, y, wid, hig, rad, i ){
    _.bindAll(this, 'tweenOnUpdate1', 'tweenOnComplete1');

    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.wid = wid;
    this.hig = hig;

    this.vel = 100;
    this.arcRate = 0;

    this.rad1 = 100 * scaleFactor;
    this.rad2 = rad;

    this.isArcAnimation = false;

    this.duration1 = i * .05;
    var col = 255 - parseInt(255 / 100 * i);
    this.col = 'rgb(' + col + ', ' + col + ', ' + col + ')';
};

Rect.prototype = {
    duration1      : 1,
    isArcAnimation : null,

    draw : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.col;
        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        if(this.isArcAnimation){

            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, this.rad2, this.theta1, this.theta2 );
            this.ctx.fill();
            this.ctx.closePath();


            this.ctx.beginPath();
            this.ctx.fillStyle = '#333';
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, this.rad1, 0, 2 * Math.PI );
            this.ctx.fill();
            this.ctx.closePath();




        }else{
            this.ctx.fillRect( this.rad1 , -this.hig, this.wid, this.hig);
        }



        this.ctx.restore();
    },

    startArcAnimation : function(){
        this.isArcAnimation = true;
        this.arcRate = 0;
        TweenLite.to(this, this.duration1, { arcRate : 1, onUpdate: this.tweenOnUpdate1, onComplete: this.tweenOnComplete1 });
    },

    tweenOnUpdate1 : function(){
        this.theta1 = this.arcRate * Math.PI * -1 + 2 * Math.PI;
        this.theta2 = this.arcRate * this.arcRate * this.arcRate * Math.PI * -1 + 2 * Math.PI;

    },

    tweenOnComplete1 : function(){

    }
};


var width, height, previousTime;
var side1, side2;
var side1Wid, side1Hig;
var rect;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);
var arcs = [];

width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

side1 = 100;
side2 = 180;

//side1Wid = 100;
side1Wid = 200;

side1Hig = 50;


var duration1 = .8;
var duration2 = .6;

canvas.width  = width;
canvas.height = height;


init();
loop();

function init(){
    var rad = Math.min(width/2, height/2);
    for(var i = 0;i < 100; i++){
        rect = new Rect(ctx, width/2, height, side1Wid, side1Hig, rad/100* (1 + i), i);
        rect.startArcAnimation();
        arcs.push(rect);
    }


    setInterval(function(){
        for(var i = 0; i < arcs.length; i++){
            arcs[i].startArcAnimation();
        }
    }, 100 *.05 * 1000);
}

function loop(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    for(var i = 0;i < arcs.length; i++){
        arcs[i].draw();
    }

    requestAnimationFrame(loop);
}