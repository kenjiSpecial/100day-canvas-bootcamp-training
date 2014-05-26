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
var side1Wid, side1Hig;
var rect;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);

width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

side1 = 100;
side2 = 180;

var sideHig = 10 * scaleFactor;

var duration1 = .8;
var duration2 = .6;

canvas.width  = width;
canvas.height = height;

var Rect = function(ctx){
    this.ctx = ctx;
    this.col = '#fff';

    this.width = this.baseWidth = 15 * scaleFactor;
    this.penWidth = 14.5 * scaleFactor;
    this.height = 100 * scaleFactor;

    this.pt1 = {x : width / 2, y: height};
    this.pt2 = {x : width / 2, y: height - this.height};

    this.anchorPt = {x : width /2, y: (this.pt1.y + this.pt2.y) / 2};

    this.anchorTheta1 = 0;
    this.anchorTheta2 = 0;
};

Rect.prototype = {
    div : -2,
    val : 0,

    update : function(){
        this.anchorTheta1 += 0.1;
        if(this.pt2.y <= 0){ this.div = 2;
        }
        if(this.pt2.y >= height - 100*scaleFactor){ this.div = -2;
        }

        this.pt2.y += this.div;
        this.width = this.baseWidth + this.penWidth * Math.sin(this.anchorTheta1);
        this.val -= this.div / 2;

        this.pt2.x      = width / 2 - 30 * scaleFactor * Math.cos(this.anchorTheta1);
        this.anchorPt.x = width / 2 + (50 + this.val) * scaleFactor * Math.cos(this.anchorTheta1);
        this.anchorPt.y = (this.pt1.y + this.pt2.y) / 2;
    },

    draw : function(){
        this.ctx.fillStyle = this.col;
        this.ctx.beginPath();
        this.ctx.moveTo(this.pt1.x - this.width / 2, this.pt1.y);
        this.ctx.quadraticCurveTo(this.anchorPt.x - this.width / 2, this.anchorPt.y, this.pt2.x - this.width / 2, this.pt2.y);
        this.ctx.lineTo(this.pt2.x + this.width / 2, this.pt2.y);
        this.ctx.quadraticCurveTo(this.anchorPt.x + this.width / 2, this.anchorPt.y, this.pt1.x + this.width / 2, this.pt1.y);
        this.ctx.fill();
        this.ctx.closePath();

    },

    debugDraw : function(){
        this.ctx.strokeStyle = this.col;

        this.ctx.beginPath();
        this.ctx.moveTo(this.pt1.x, this.pt1.y);
        this.ctx.quadraticCurveTo(this.anchorPt.x, this.anchorPt.y, this.pt2.x, this.pt2.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
};

var rect;

init();
loop();

function init(){
    rect = new Rect(ctx);
}

function loop(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    rect.update();
    rect.draw();

    requestAnimationFrame(loop);
}