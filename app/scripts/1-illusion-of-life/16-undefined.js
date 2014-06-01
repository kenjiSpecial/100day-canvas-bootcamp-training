// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

var apple = [
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 5  , 4, 3, 2 ,1],
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 4  , 3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 4, 2  , 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 3, 1],
    [5, 5, 5, 5, 5,  5, 5, 4, 2, 1],

    [5, 5, 5, 5, 5,  5, 5, 3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 3, 2, 1],

    // ============= ===================

    [5, 5, 5, 5, 5,  5, 5, 3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 4, 3, 2,   1],
    [5, 5, 5, 5, 5,  5, 5, 5, 4, 3,   2, 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 4, 3,   2, 1],

    [5, 5, 5, 5, 5,  5, 5, 5, 4, 4,   2, 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 4,   3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 4,   3, 2, 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 5,   4, 3, 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 5,   4, 3, 2, 1],

    // ============= ===================

    [5, 4, 3, 3, 3,  3, 3, 4, 5, 5,   4, 3, 2, 1],
    [4, 3, 2, 2, 2,  2, 2, 3, 4, 5,   4, 3, 2, 1],
    [2, 1, 0, 0, 0,  1, 2, 3, 4, 5,   4, 3, 2, 1],
    [0, 0, 0, 0, 0,  1, 2, 3, 4, 5,   4, 3, 2, 1],
    [0, 0, 0, 0, 0,  1, 3, 4, 4, 5,   4, 2, 1],

    [0, 0, 0, 0, 0,  2, 3, 4, 5, 4,   3, 1],
    [0, 0, 0, 0, 0,  2, 3, 4, 5, 4,   3, 1],
    [0, 0, 0, 0, 1,  2, 4, 5, 5, 4,   3, 1],
    [0, 0, 0, 1, 3,  4, 5, 5, 4, 3,   1],
    [0, 0, 1, 3, 4,  5, 5, 5, 4, 3,   1],

    // ============= ===================

    [0, 1, 3, 4, 5,  5, 5, 5, 4, 3,   1],
    [1, 3, 4, 5, 5,  5, 5, 4, 3, 1],
    [2, 4, 5, 5, 5,  5, 5, 4, 3, 1],
    [4, 5, 5, 5, 5,  5, 5, 4, 3, 1],
    [5, 5, 5, 5, 5,  5, 5, 4, 3, 1],

    [5, 5, 5, 5, 5,  5, 5, 4, 3, 1],
    [5, 5, 5, 5, 5,  5, 5, 4, 3, 1],
    [5, 5, 5, 5, 5,  5, 5, 4, 3, 1],
    [5, 5, 5, 5, 5,  5, 5, 5, 4, 3,  1],
    [5, 5, 5, 5, 5,  5, 5, 5, 4, 4,  2],

    // =========== ===============

    [5, 5, 5, 5, 5,  5, 5, 5, 4, 4,  2],
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 4,  2],
    [5, 5, 5, 5, 5,  5, 5, 5, 5, 4,  3, 1],


];
var rectWidth = 860;
var rectHeight = 476;


var Apple = function(ctx, x, y){
    _.bindAll(this, 'updateTile');

    //this.bgRect = new BgRect(ctx, x, y);
    this.ctx = ctx;
    this.tiles  = new Tiles(ctx);

    //setTimeout(this.showBg, 300);
    setTimeout(this.updateTile, 1000);
};

Apple.prototype = {
    updateTile : function(){
        this.tiles.changeSize();
    },

    update : function(){
        this.tiles.update();

        this.ctx.fillStyle = '#fff';
        this.ctx.font = "24px sans-serif";
        this.ctx.fillText('Is it in June 2nd?', width/2 - 90, height/2  + 200)
    }

};

var Tiles = function(ctx){
       this.tileArr = [];
       var margin = 2;


       for(var i = 0; i < 43; i++){
           this.tileArr[i] = [];
           var visualArr = apple[i];
           for(var j = 0; j < 24; j++){
               var number = visualArr[j] ? visualArr[j] : 0;
               var tile = new Tile(ctx, i * 20 + 10 - rectWidth/2, j * 20 + 10 - rectHeight/2, number, i, j);
               this.tileArr[i].push(tile);

           }
       }
};


Tiles.prototype = {
    changeSize : function(){
        for(var i in this.tileArr){
            var tileArr = this.tileArr[i];
            for(var j in tileArr){
                tileArr[j].changeSize();
            }
        }
    },
    update : function(){
        for(var i in this.tileArr){
            var tileArr = this.tileArr[i];
            for(var j in tileArr){
                tileArr[j].update();
            }
        }
    }
};

var Tile = function(ctx, x, y, number, i, j){
    _.bindAll(this, 'onCompleteAnimation', 'changeSize');

    this.xId = i;
    this.yId = j;

    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.number = number;

    this.firstWidth = this.side = 21;
    this.secondWidth = 16;

    this.grd = this.ctx.createLinearGradient( -rectWidth/2-this.x, 0, rectWidth, 0);


    this.grd.addColorStop(0, 'rgba(181, 240, 83, 1)');
    this.grd.addColorStop(0.15, 'rgba(0, 215, 171, 1)');
    this.grd.addColorStop(0.3, 'rgba(151, 69, 219, 1)');
    this.grd.addColorStop(0.40, 'rgba(254, 91, 81, 1)');
    this.grd.addColorStop(0.5, 'rgba(255, 216, 59, 1)');
};

Tile.prototype = {
    animationDuration :.3,
    anchor : 0,
    update : function(){

        this.ctx.save();
        this.ctx.translate(this.x + width/2, this.y + height/2);
        this.ctx.fillStyle = this.grd;

        this.ctx.beginPath();
        this.ctx.moveTo(-this.side/2 + this.anchor, -this.side/2);
        this.ctx.lineTo(this.side/2 - this.anchor, -this.side/2);
        this.ctx.quadraticCurveTo(this.side/2, -this.side/2, this.side/2, this.anchor - this.side/2);
        this.ctx.lineTo(this.side/2, this.side/2- this.anchor);
        this.ctx.quadraticCurveTo(this.side/2, this.side/2, this.side/2 - this.anchor, this.side/2);
        this.ctx.lineTo(- this.side/2 + this.anchor, this.side/2);
        this.ctx.quadraticCurveTo(-this.side/2, this.side/2, -this.side/2, this.side/2 - this.anchor);
        this.ctx.lineTo(-this.side/2, -this.side/2 + this.anchor);
        this.ctx.quadraticCurveTo(-this.side/2, -this.side/2, -this.side/2 + this.anchor, -this.side/2);

        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

    },

    delay : 0,

    changeSize : function(){
        TweenLite.to(this, this.animationDuration, {side : 16, anchor: 4, onComplete: this.onCompleteAnimation, delay: this.delay});
    },

    restart : function(){
        if(this.number > 0){
            TweenLite.to(this, this.animationDuration, {side : 0, anchor: 0 });
        }

        this.delay  = 1;
        TweenLite.to(this, this.animationDuration, {side : 21, delay: 2, onComplete: this.changeSize });
    },

    onCompleteAnimation : function(){
        var self = this;
        setTimeout(function(){
            self.restart();
        },3000);

        var sid, anch;
        switch (this.number){
            case 0:
                sid = 0; anch = 0;
                break;
            case 1:
                sid = 2, anch = .5;
                break;
            case 2:
                sid = 4, anch = 1;
                break;
            case 3:
                sid = 8, anch = 2;
                break;
            case 4:
                sid = 12, anch = 3;
                break;
            case 5:
                return;
                break;
        }

        TweenLite.to(this, this.animationDuration * 3, {side : sid, anchor: anch, delay:.5 });


    }
};

// ================
var apple;

init();
loop();

function init(){
    apple = new Apple(ctx, width/2, height/2);
    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    apple.update(duration);


    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;