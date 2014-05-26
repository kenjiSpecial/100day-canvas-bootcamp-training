function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// --------------------------

var Rect = function(ctx, x, y, i){

    this.color = '#fff';
    this.ctx = ctx;

    this.side = 200;

    this.x   = this.originX = x - this.side/2;
    this.y   = this.originY = y - this.side/2;
    if(i % 2 == 0) this.rad = 170;
    else           this.rad = 90;


};

Rect.prototype = {
    sec : 0,
    rad : 100 + 200 * Math.random(),

    update : function(){
        this.sec += .1;
        this.x = this.originX + this.rad * Math.cos(this.sec);
        if(this.x > width) this.x = -this.side;

        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(this.x, this.y, this.side, this.side);
    }
};

var Point = function(x1, y1, x2, y2){
    this.status = 'triangle';

    this.point = {
        'circle'   : {x : x1, y: y1},
        'triangle' : {x : x2, y: y2}
    };
};

Point.prototype = {
    get : function(){
        return this.point[this.status]
    }
};

var Shape = function(ctx, x, y, rad){
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.rad = rad;

    this.pointArr = [];

    this.num = 120;
    var triangle = this.num / 3;
    var circlePtArr = [
            {x : this.rad * Math.cos(0), y: this.rad * Math.sin(0) },
            {x : this.rad * Math.cos(2/3*Math.PI), y: this.rad * Math.sin(2/3*Math.PI) },
            {x : this.rad * Math.cos(4/3*Math.PI), y: this.rad * Math.sin(4/3*Math.PI) }
    ];

    for(var i = 0; i < this.num; i++){
        // circle
        var ptX = this.rad * Math.cos(i / this.num * Math.PI * 2);
        var ptY = this.rad * Math.sin(i / this.num * Math.PI * 2);

        // triangle
        var triangleNum1 = parseInt(i / triangle);
        var triangleNum2 = (triangleNum1 + 1) % 3;
        var circleI = i % triangle;

        var ptTriX = circlePtArr[triangleNum1].x * (1 - circleI / triangle) + circlePtArr[triangleNum2].x * (0 + circleI / triangle);
        var ptTriY = circlePtArr[triangleNum1].y * (1 - circleI / triangle) + circlePtArr[triangleNum2].y * (0 + circleI / triangle);


        var pt  = new Point(ptX, ptY, ptTriX, ptTriY);
        this.pointArr[i] = pt;
    }

};

Shape.prototype = {
    vel:8,

    update : function(rectArr){
        this.x += this.vel;
        if(this.x > width + 100) this.x = - 100;

        // update
        // this.x - this.rad -- this.x + this.rad
        for(var i = 0; i < this.num; i++){
            this.pointArr[i].status = 'circle';
        }


        for(var j = 0; j < rectArr.length; j++){
            var rect = rectArr[j];

            for(var i = 0; i < this.num; i++){
                var ptX = this.pointArr[i]['point']['circle'].x + this.x;
                if(ptX > (rect.x) && ptX < (rect.x + rect.side) )                   this.pointArr[i].status = 'triangle';
                //else                                                                this.pointArr[i].status = 'circle';
            }
        }



        // draw
        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.translate(this.x, this.y);

        this.ctx.moveTo(this.pointArr[0].get().x, this.pointArr[0].get().y);

        for(var i = 1; i < this.num; i++){
            this.ctx.lineTo(this.pointArr[i].get().x, this.pointArr[i].get().y);
        }

        this.ctx.lineTo(this.pointArr[0].get().x, this.pointArr[0].get().y);

        this.ctx.fillStyle = '#fff';
        this.ctx.stroke();

        this.ctx.closePath();

        this.ctx.restore();

    }
};



// --------------------------


var width, height, previousTime;
var side1, side2;
var side1Wid, side1Hig;
var rect, rectArr = [];
var shape, shapeArr = [];
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);

width  = window.innerWidth;
height = window.innerHeight;

side1 = 100;
side2 = 180;

var sideHig = 10 * scaleFactor;

var duration1 = .8;
var duration2 = .6;

canvas.width  = width;
canvas.height = height;


init();
loop();

function init(){


    for(var i = 0; i < 3; i++){
        rect = new Rect(ctx, width/2 + 300 * i - 300, height/2, i);
        rectArr.push(rect);
    }

    for(var i = 0;i < 8; i++){
        shape = new Shape(ctx, width/2, height/2, 8 + 12 * i);
        shapeArr.push(shape);
    }

}

function loop(){
    //ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    for(var i in rectArr){
        rect = rectArr[i];
        rect.update();
    }

    //console.log('shape update');
    for(var i in shapeArr){
        shape = shapeArr[i];
        shape.update(rectArr);
    }

    //console.log('shape update');

    requestAnimationFrame(loop);
}