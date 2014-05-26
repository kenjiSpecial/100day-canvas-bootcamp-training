function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var width, height, previousTime;
var side1, side2;
var rect, rect1, rect2;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);

var Rect = function( ctx, i, x ){
    var self = this;

    this.ctx = ctx;
    this.x = x;
    this.y = 0;

    this.i = i;

    this.y2 =  window.innerHeight* scaleFactor - i * this.height3;
    this.height2 =  this.y2 *0.8;

    this.wid = this.width1;
    this.hig = this.height1;

    setTimeout(function(){
        self.verticalAnimation();
    }, 500 * this.i);


};

Rect.prototype = {
    color : '#fff',

    width1 : 50* scaleFactor,
    width2 : 90* scaleFactor,

    height1 : 50* scaleFactor,
    height2 : null,
    height3 : 30* scaleFactor,

    rad1 : 80 * scaleFactor,
    rad2 : 105 * scaleFactor,

    y2: null,

    duration1 : 0.4,
    duration2 : 0.3,
    duration3 : 0.2,

    lineRate1 : 0,
    lineRate2 : 0,

    isStage : false,

    reset : function(){
        if(this.color == '#fff') this.color = '#333';
        else                     this.color = '#fff';

        var self = this;
        this.y = 0;

        this.y2 =  window.innerHeight* scaleFactor - this.i * this.height3;
        this.height2 =  this.y2 *0.8;

        this.wid = this.width1;
        this.hig = this.height1;

        setTimeout(function(){
            self.verticalAnimation();
        }, 400 * this.i);
    },

    verticalAnimation : function(){
        var self = this;

        this.lineRate1 = 0;
        this.lineRate2 = 0;

        TweenLite.to(this, this.duration1, {hig: this.height2, y: this.height2, ease: Power2.easeIn});
        TweenLite.to(this, this.duration2, {y: this.y2, delay: this.duration1 });
        TweenLite.to(this, this.duration2, {wid: this.width2, hig : this.height3, delay: this.duration1 });

        TweenLite.to(this, this.duration3, {lineRate1 : 1, delay: this.duration1 + this.duration2, ease: Power3.easeInOut });
        TweenLite.to(this, this.duration3, {lineRate2 : 1, delay: this.duration1 + this.duration2, ease: Power3.easeOut });

        setTimeout(function(){
            self.isStage = true;
        }, (this.duration1 + this.duration2) * 1000 );
        setTimeout(function(){
            self.isStage = false;
        }, (this.duration1 + this.duration2 + this.duration3) * 1000 );
    },

    draw : function(){
        this.ctx.beginPath();

        this.ctx.fillStyle   = this.color;
        this.ctx.lineWidth   = 3;

        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.fillRect(- this.wid / 2, -this.hig, this.wid, this.hig);
        this.ctx.closePath();


        if(this.isStage){
            for(var ii = 0; ii < 7; ii++){
                var theta = (190 + 25 * ii)/180 * Math.PI;

                var rad1 = (this.rad2 - this.rad1) * this.lineRate1 + this.rad1;
                var rad2 = (this.rad2 - this.rad1) * this.lineRate2 + this.rad1;

                var x1 = Math.cos(theta) * rad1;
                var y1 = Math.sin(theta) * rad1;

                var x2 = Math.cos(theta) * rad2;
                var y2 = Math.sin(theta) * rad2;

                this.ctx.strokeStyle = '#999';
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }

        this.ctx.restore();
    }
};

// ---------------


width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

side1 = 100;
side2 = 180;

var duration1 = .8;
var duration2 = .6;

canvas.width  = width;
canvas.height = height;
var isReset = false;
var resetColor = '#333';
var rectWidth = 90 * scaleFactor;
var rects = [];
var rectNumber = parseInt(window.innerHeight / 30) + 1;

init();

loop();


function init(){

    for(var i = 0; i < rectNumber; i++){
        var rectangle = new Rect( ctx, i, width/2);
        rects.push(rectangle);
    }

    setTimeout(function(){
        reset()
    }, 500 * rectNumber + 500);
}

function reset(){
    isReset = true;

    if(resetColor == '#fff') resetColor = '#333';
    else                     resetColor = '#fff';


    for(var i = 0; i < rectNumber; i++){
        rects[i].reset();
    }

    setTimeout(function(){
        reset()
    }, 500 * rectNumber + 1000);
}

function loop(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    if(isReset){
        ctx.fillStyle = resetColor;
        ctx.fillRect((width - rectWidth)/2, 0, rectWidth, height);
    }

    for(var i = 0; i < rectNumber; i++){
        rects[i].draw();
    }

    requestAnimationFrame(loop);
}