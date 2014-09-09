// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var Point = function(theta){
    this.theta = theta | 0;
};

Point.prototype = {
    rad : 10,
    _theta : null,
};


Object.defineProperty(Point.prototype, 'theta', {
    get : function(){
        return this._theta;
    },

    set : function(val){
        this._theta = val;
        this.x = this.rad * Math.cos(this._theta);
        this.y = this.rad * Math.sin(this._theta);
    }
});

var Line = function(ctx, x, y){
    this.ctx = ctx;
    this.x = x;
    this.y = y;

    this.theta = 0;

    this.startPt = new Point(this.theta);
    this.endPt   = new Point((this.theta + Math.PI));
};

Line.prototype = {
    strokeCol : '#fff',

    update : function(){
        this.ctx.save();

        this.ctx.translate(this.x, this.y);

        this.ctx.beginPath();
        this.ctx.fillStyle = this.strokeCol;

        this.ctx.moveTo(this.startPt.x, this.startPt.y);
        this.ctx.lineTo(this.endPt.x,   this.endPt.y);
        this.ctx.stroke();

        this.ctx.closePath();

        this.ctx.restore();
    }
};

var LineCollection = function(ctx){
    this.ctx = ctx;

    this.widNum = parseInt(width / (Point.rad * 2)) + 1;
    this.higNum = parseInt(height / (Point.rad * 2)) + 1;

    this.lineArr = [];

    for(var i = 0; i < this.widNum; i++){
        var lineArr = [];
        var x = Point.rad * ( 1 +  2 * i);
        for(var j = 0;j < this.higNum; j++){
            var y = Point.rad * (1 + 2 * j);
            var line = new Line(this.ctx, x, y);

            lineArr.push(line);
        }
        this.lineArr.push(lineArr);
    }
};

LineCollection.prototype = {
    lineArr: null,
    widNum : null,
    higNum : null,
}


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