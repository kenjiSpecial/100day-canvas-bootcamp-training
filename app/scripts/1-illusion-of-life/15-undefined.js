window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var col = '#fff';

var Circle = function( ctx, x, y, rad ){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.rad = rad;
};

Circle.prototype = {
    update : function(){
        this.ctx.fillStyle = col;

        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();

    }
};


var DynamicCircle = function(ctx, x, y, rad, dis){
    this.shuuki = .3;
    this.dis = dis;
    this.vel = dis / this.shuuki;
    this.duration = 0;
    this.shinpuku = rad * 3;
    this.originY  = y;
    Circle.call(this, ctx, x, y, rad/2);
};

DynamicCircle.prototype = Object.create(Circle.prototype);

DynamicCircle.prototype = {
    update : function(dt, shapeArr){

        this.duration += dt;

        var times = parseInt(this.duration / (this.shuuki * 2))

        this.x = this.x + this.vel * dt;

        if(this.x >= maxX){
            var dis = this.x - maxX;
            this.x = minX + dis - this.dis;
        }

        var globalAlpha = 1;

        if(this.x >= (maxX-this.dis) ){
            globalAlpha = (maxX - this.x )/ this.dis
            if(globalAlpha < 0) globalAlpha = 0;
        }



        this.y = -1 * Math.cos(this.duration  / this.shuuki * Math.PI ) * this.shinpuku + this.originY;

        var circleNumber = (times * 2 + 1) % shapeArr.length;
        var shapeRatio = (this.duration - times * this.shuuki * 2) * Math.PI * 2;
        if(shapeRatio > Math.PI) shapeRatio = Math.PI;

        shapeArr[circleNumber].y = this.rad * 4 *Math.sin(shapeRatio);

        this.ctx.save();
        this.ctx.globalAlpha = globalAlpha;

        Circle.prototype.update.call(this);

        this.ctx.restore();
    }
};


var DynamicCircle2= function(ctx, x, y, rad, dis){
    this.shuuki = .3;
    this.dis = dis;
    this.vel = -1 * dis / this.shuuki;
    this.duration = 0;
    this.shinpuku = rad * 3;
    this.originY  = y;
    Circle.call(this, ctx, x, y, rad/2);
};

DynamicCircle2.prototype = Object.create(Circle.prototype);

DynamicCircle2.prototype = {
    update : function(dt, shapeArr){

        this.duration += dt;

        var times = parseInt(this.duration / (this.shuuki * 2))

        this.x = this.x + this.vel * dt;
        this.y = 1 * Math.cos(this.duration  / this.shuuki * Math.PI ) * this.shinpuku + this.originY;

//        if(this.x >= maxX){
//            var dis = this.x - maxX;
//            this.x = minX + dis - this.dis;
//        }

        if(this.x <= minX){
            var dis = minX - this.x;
            this.x = maxX - dis + this.dis;
        }

        var globalAlpha = 1;

        if(this.x <= (minX+this.dis) ){
            globalAlpha = (this.x - minX )/ this.dis;
            if(globalAlpha < 0) globalAlpha = 0;
        }


//

//
        var circleNumber = (times * 2 ) % shapeArr.length;
        circleNumber = shapeArr.length - 2 - circleNumber;

        if(circleNumber < 0) circleNumber =shapeArr.length  + circleNumber;

        var shapeRatio = (this.duration - times * this.shuuki * 2) * Math.PI * 2;
        if(shapeRatio > Math.PI) shapeRatio = Math.PI;

        shapeArr[circleNumber].y = this.rad * 4 *Math.sin(shapeRatio) * -1;
//
        this.ctx.save();
        this.ctx.globalAlpha = globalAlpha;

        Circle.prototype.update.call(this);

        this.ctx.restore();
    }
};



var Rect = function( ctx, x, y, rad ){
    this.ctx = ctx;
    this.x   = x;
    this.y   = y;
    this.rad = rad * 2;
};

Rect.prototype = {
    update : function(){
        this.ctx.fillStyle = col;

        this.ctx.beginPath();
        this.ctx.fillRect(this.x - this.rad/2, this.y - this.rad/2, this.rad, this.rad);
        this.ctx.closePath();
    }
};




// --------------------------


var width, height, previousTime;
var side1, side2;
var colNum = 19;
var shapeArr = [];
var dynamicCircle, dynamicCircle2;
var prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;


canvas.width  = width;
canvas.height = height;

var minX = 1/(colNum + 1) * width - .5*width;
var maxX = colNum/(colNum + 1) * width - .5*width;


init();
loop();

function init(){
    var shape;
    var xPos;
    var yPos = 0;
    var rad = parseInt(width / colNum / 2 * .6);
    var dis = 1/(colNum+1) * width;
    var rectX;



    for(var i = 0; i < colNum; i++){
        xPos = ((i + 1) / (colNum  + 1) -.5) * width;

        if(i % 2 == 0) {
            shape = new Rect(ctx, xPos, yPos, rad );
        }else{
            shape = new Circle(ctx, xPos, yPos, rad );
        }


        shapeArr.push(shape);
    }

    dynamicCircle = new DynamicCircle(ctx, minX, yPos - rad * 3, rad, dis);
    dynamicCircle2= new DynamicCircle2(ctx, maxX, yPos + rad * 3, rad, dis);


    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;
    //ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    ctx.translate(width/2, height/2);

    for(var i in shapeArr){
        var shape = shapeArr[i];
        shape.update();
    }

    dynamicCircle.update(duration, shapeArr);
    dynamicCircle2.update(duration, shapeArr);

    ctx.restore();


    requestAnimationFrame(loop);
}