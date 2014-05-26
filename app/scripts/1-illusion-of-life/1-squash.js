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
    this.x = x - wid/2;
    this.y = y;
    this.wid = wid;
    this.hig = hig;

    this.vel = 100;
};

Rect.prototype = {
    update : function(dt){
        this.y += this.vel * dt;
    },

    draw : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.x, this.y, this.wid, this.hig);
        this.ctx.closePath();
    }
};

// ---------------

var Rect1 = function(ctx, x, y, wid, hig){
    Rect.call(this, ctx, x, y, wid, hig);

    this.vel = 20;
    this.acl = 100;
};

Rect1.prototype = Object.create(Rect.prototype);

Rect1.prototype = {
    update : function(dt){
        this.vel += this.acl * dt;

        Rect.prototype.update.call(this, dt);
    },

    draw : function(){
        Rect.prototype.draw.call(this);
    }
};

// ---------------

var Rect2 = function(ctx, x, y, wid, hig){
    Rect.call(this, ctx, x, y, wid, hig);
};

Rect2.prototype = Object.create(Rect.prototype);




var width, height, previousTime;
var rect, rect1;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);

width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

canvas.width  = width;
canvas.height = height;

init();

loop();

function init(){
    previousTime = +new Date;

    rect = new Rect( ctx, width/2 - 200, 0, 100, 100);
    rect1 = new Rect1( ctx, width/2 - 50, 0, 100, 100);
}


function loop(){
    var curTime = +new Date;
    var dt = (curTime - previousTime) / 1000;

    this.ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    rect.update(dt);
    rect.draw();

    rect1.update(dt);
    rect1.draw();

    previousTime = curTime;
    requestAnimationFrame(loop);
}


