// --------------------------

var width, height, prevTime;
var pattern;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;



// ================

var RectCollection = function(ctx){
    _.bindAll(this, 'onRotation');
    this.ctx = ctx;
    var rectSide = Math.min(width, height);

    this.x = -width/2;
    this.y = -height/2;
    
    this.rectArr = [];
    for(var i = 0; i < this.rectNumber; i ++){
       var curSide = (.1 + .8 * (this.rectNumber - i) / this.rectNumber) * rectSide;
       var curRect = new Rect(ctx, curSide);

       this.rectArr.push(curRect);
    }

    _.delay(this.onRotation, 800);
}

RectCollection.prototype = {
    rectNumber : 5,
    rectArr    : null,

    update : function(dt){
        this.ctx.save();
        this.ctx.fillStyle = pattern;
        this.ctx.translate(-this.x, -this.y);
        this.ctx.fillRect(this.x, this.y, width, height);

        for(var i = 0; i < this.rectNumber; i++){
            this.rectArr[i].update(dt);
        }

        this.ctx.restore();
    },

    onRotation : function(){
        for(var i = 0; i < this.rectNumber; i++){
            this.rectArr[i].onRotation(i /5);
        }
    }
}

var Rect = function(ctx, side){
    _.bindAll(this, 'onComplete');
    this.ctx = ctx;
    this.halfSide = side/2;
    this.pos = - this.halfSide;
    this.side = side;
    this.kakusei = this.side;
};

Rect.prototype = {
    theta : 0,
    sum   : 0,
    kakusei : 0,
    transx  : 0,
    update : function(dt){
        if(this.isTranslate){
            this.sum += dt;
            this.transX = Math.sin(this.sum) *this.side 
        }

        // ======
        //  draw
        this.draw();
    },

    draw : function(){
        this.ctx.save();

        this.ctx.fillStyle = pattern;
        
        this.ctx.translate(this.transX, 0);
        this.ctx.rotate(this.theta);
        this.ctx.fillRect( this.pos, this.pos, this.side, this.side);
        this.ctx.restore();

    },

    onRotation : function(delay){
        var theta = delay  + Math.PI/6;
        var duration = .4 + delay; 
        TweenLite.to(this, duration, {theta: theta,  ease: Power2.easeInOut, onComplete: this.onComplete});
    },

    onComplete : function(){
        this.isTranslate = true;
    }
}

var Stripe = function(){

}


// ================
var rectCollection;
var tempUpdate, tempCanvas, tempCtx, tempSide, tempHalfSide;
var sum = 0;

init();
loop();

function init(){
    // create pattern
    createPattern();

    rectCollection = new RectCollection(ctx);

    prevTime = +new Date;
}

function createPattern(){
    
    tempSide = 40;
    tempHalfSide = tempSide / 2;
    tempUpdate = 0;

    tempCanvas = document.createElement('canvas');
    tempCanvas.width = tempSide;
    tempCanvas.height = tempSide;

    tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = '#fff';
    tempCtx.fillRect(0, 0, tempSide/2, tempSide);

    tempCtx.fillStyle = '#333';
    tempCtx.fillRect( tempSide/2, 0, tempSide/2, tempSide);

    pattern    = tempCtx.createPattern(tempCanvas, 'repeat');
}


function updatePattern(dt){
    sum += dt * 2;
    var speed =  (Math.cos(sum ) + Math.sin(sum) + 2) ;
    tempUpdate += speed;
    tempUpdate = tempUpdate % tempSide;

    var xPos = -1 * tempUpdate;
    for(var i = 0; i < 4; i++){
        var col;
        if(i % 2 == 0) col = "#ffffff";
        else           col = '#333';

        tempCtx.fillStyle = col;
        tempCtx.fillRect(xPos, 0, tempHalfSide, tempSide);
        xPos += tempHalfSide;
    }

    pattern    = tempCtx.createPattern(tempCanvas, 'repeat');
    tempCtx.clearRect(0, 0, tempSide, tempSide);
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;


    updatePattern(duration);
    rectCollection.update(duration);

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
