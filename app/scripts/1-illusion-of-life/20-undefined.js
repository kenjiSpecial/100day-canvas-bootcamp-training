// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

var Point = function( x, y){
    this.x = x;
    this.y = y;
}

var Circle = function( ctx, pt){
    this.ctx = ctx;
    this.pt = pt;
};

Circle.prototype = {
    fillCol   : '#333',
    strokeCol : '#fff',
    rad       : 2,

    update : function(){
        this.ctx.fillStyle = this.fillCol;
        this.ctx.strokeStyle = this.strokeCol;

        this.ctx.beginPath();
        this.ctx.arc(this.pt.x, this.pt.y, this.rad, 0, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }
};

var Shape = function( ctx, x, y){
    this.ctx = ctx;
    this.center = new Point(x, y);

    this.line = new Line(ctx);

    this.circleArr = [];
    this.circleArr.push(new Circle(ctx, this.line.startPt));
    this.circleArr.push(new Circle(ctx, this.line.endPt));

    var self = this;
    setTimeout(function(){
        self.add();
    }, 800);
};

Shape.prototype = {
    circleArr : null,
    count : 0,
    angle : 0,

    add : function(){
        this.line.addPt();
        this.circleArr.push(new Circle(this.ctx, this.line.ptArr[this.line.ptArr.length - 1]));

        var self = this;
        this.count++;
        if(this.count > 8){
            setTimeout(function(){
                self.shrink();
            }, 2000);

        }else{
            setTimeout(function(){
                self.add();
            }, 800);
        }

    },

    init : function(){
        this.count = 0;
        this.line.init();
        this.circleArr = [];
        this.circleArr.push(new Circle(ctx, this.line.startPt));
        this.circleArr.push(new Circle(ctx, this.line.endPt));

        var self = this;
        this.line.animate();
        setTimeout(function(){
            self.add();
        }, 1600);
    },

    shrink : function(){
        this.line.shrink();

        var self = this;
        setTimeout(function(){
            self.init();
        }, 1000);
    },

    update : function(){
        this.angle += 0.01;

        this.ctx.save();

        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.rotate(this.angle);
        this.line.update();

        for(var i in this.circleArr){
            this.circleArr[i].update();
        }

        this.ctx.restore();
    }
};

// ------

var Line = function(ctx){
    this.ctx = ctx;

    this.startPt = new Point( 0, 0);
    this.endPt   = new Point( 0, 0);

    this.ptArr = [];

    var self = this;
    setTimeout(function(){
        self.animate();
    }, 300);
};

Line.prototype = {
    col             : '#fff',
    animateDuration :.5,
    side            : 100,
    ptArr           : null,

    init : function(){
        this.side = 100;
        this.ptArr = [];
    },

    addPt : function(){
        var pt = new Point(this.startPt.x, this.startPt.y);
        this.ptArr.push(pt);

        var sum = this.ptArr.length + 2;
        this.side += 10;

        for(var i = 0; i < sum; i++){
            var theta = i / sum * 2 * Math.PI;
            var x = Math.cos(theta) * this.side;
            var y = Math.sin(theta) * this.side;


            switch (i){
                case 0:
                    TweenLite.to(this.startPt, this.animateDuration, {x : x, y: y});
                    break;
                case 1:
                    TweenLite.to(this.endPt, this.animateDuration, {x : x, y: y});
                    break;
                default :
                    TweenLite.to(this.ptArr[i - 2], this.animateDuration, {x : x, y: y});
            }

        }

    },

    shrink : function(){
        var sum = this.ptArr.length + 2;
        for(var i = 0; i < sum; i++){
            switch (i){
                case 0:
                    TweenLite.to(this.startPt, this.animateDuration, {x : 0, y: 0});
                    break;
                case 1:
                    TweenLite.to(this.endPt, this.animateDuration, {x : 0, y: 0});
                    break;
                default :
                    TweenLite.to(this.ptArr[i - 2], this.animateDuration, {x : 0, y: 0});
            }

        }
    },

    animate : function(){
        TweenLite.to(this.startPt, this.animateDuration, {x : this.side});
        TweenLite.to(this.endPt,   this.animateDuration, {x : -this.side});
    },

    update : function(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.col;
        this.ctx.moveTo(this.endPt.x, this.endPt.y);
        if(this.ptArr.length > 0){
            for(var i = 0; i < this.ptArr.length; i++){
                this.ctx.lineTo(this.ptArr[i].x, this.ptArr[i].y);
            }
        }
        this.ctx.lineTo(this.startPt.x, this.startPt.y);

        this.ctx.lineTo(this.endPt.x, this.endPt.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

// ================
var shape;

init();
loop();

function init(){
    shape = new Shape(ctx, width/2, height/2);

    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    shape.update();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
