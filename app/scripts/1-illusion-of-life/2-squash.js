function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var Rect = function( ctx, x, y, wid, hig ){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.wid = wid;
    this.hig = hig;

    this.vel = 100;
};

Rect.prototype = {
    draw : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fff';
        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.fillRect(- this.wid / 2, -this.hig, this.wid, this.hig);
        this.ctx.closePath();

        this.ctx.restore();
    }
};

// ---------------


var width, height, previousTime;
var side1, side2;
var rect, rect1, rect2;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);

width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

side1 = 100;
side2 = 180;

var duration1 = .8;
var duration2 = .6;

canvas.width  = width;
canvas.height = height;


init();


function init(){
    previousTime = +new Date;

    rect1 = new Rect( ctx, width/2 - 200, height, side1, 50);
    rect = new Rect( ctx, width/2, 0, side1, 200);
    rect2 = new Rect( ctx, width/2 + 200, height, side1, 50);

    TweenLite.to(rect, duration1, { y : height, onComplete: onTween1Complete, onUpdate: onTween1Update });
    TweenLite.to(rect, duration2, { wid: side2, hig: 50, delay: .2});

    TweenLite.to(rect1, duration1, { y : 200});
    TweenLite.to(rect1, duration2, { wid: side1, hig:200});

    TweenLite.to(rect2, duration1, { y : 200 });
    TweenLite.to(rect2, duration2, { wid: side1, hig: 200});
}

function onTween1Update(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    rect.draw();
    rect1.draw();
    rect2.draw();
}

function onTween1Complete(){
    TweenLite.to(rect, duration1, { y : 200, onComplete: onTween2Complete, onUpdate: onTween1Update, delay:.2});
    TweenLite.to(rect, duration2, { wid: side1, hig: 200, delay: .2});

    TweenLite.to(rect1, duration1, { y : height, delay:.2});
    TweenLite.to(rect1, duration2, { wid: side2, hig:50, delay:.4});

    TweenLite.to(rect2, duration1, { y : height, delay:.2 });
    TweenLite.to(rect2, duration2, { wid: side2, hig: 50, delay:.4});
}

function onTween2Complete(){
    TweenLite.to(rect, duration1, { y : height, onComplete: onTween1Complete, onUpdate: onTween1Update, delay:.2 });
    TweenLite.to(rect, duration2, { wid: side2, hig: 50, delay:.4});

    TweenLite.to(rect1, duration1, { y : 200, delay:.2});
    TweenLite.to(rect1, duration2, { wid: side1, hig:200, delay:.2});

    TweenLite.to(rect2, duration1, { y : 200, delay:.2 });
    TweenLite.to(rect2, duration2, { wid: side1, hig: 200, delay:.2});
}


