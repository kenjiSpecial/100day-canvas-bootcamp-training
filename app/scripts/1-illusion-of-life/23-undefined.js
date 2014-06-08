// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

var Shape = function( ctx, x, y){
    this.ctx = ctx;

    this.x = x;
    this.y = y;

    this.circlrRawArr = [];

    var minRad = 30;
    var maxRad = Math.min(width, height) / 2 * .9;

    for(var i = 0; i < this.circlrRawNum; i++){
        var theta = 2 * Math.PI * i / this.circlrRawNum;
        var circleRaw = new CircleRaw( ctx, minRad, maxRad, theta);
        this.circlrRawArr.push(circleRaw);
    }
};

Shape.prototype = {
    circlrRawArr : null,
    circlrRawNum : 60,
    update : function(){
       this.ctx.save();
       this.ctx.translate(this.x, this.y);
       
       for(var i = 0; i < this.circlrRawNum; i++){
           var circleRaw = this.circlrRawArr[i];
           circleRaw.update();
       }

       this.ctx.restore();
    }
};

var CircleRaw = function( ctx, minRad, maxRad, theta){
    var difRad;
    this.ctx = ctx;

    this.rad = {min : minRad, max: maxRad};
    difRad = (maxRad - minRad); 
    this.theta = theta;

    this.circleArr = [];
    
    for(var i = 0; i < this.rawNum; i++){
        var rate = i / this.rawNum;
        var curRad = difRad * rate + minRad; 

        var circle = new Circle( this.ctx, this.theta, curRad, maxRad);
        this.circleArr.push(circle);
    }

    this.count = theta;
}

CircleRaw.prototype = {
    rate   : 0,
    rawNum : 20,
    count  : 0,
    update : function(){ 
       this.count += 0.04; 

        for( var i = 0; i < this.rawNum; i++){
            var circle = this.circleArr[i];
            circle.update(this.count);
        }
    }
}

var Circle = function( ctx, theta,  minRad, maxRad ){
    this.ctx = ctx;
    
    this.theta = theta;
    this.curRad = minRad;
    this.minRad = minRad;
    this.maxRad = maxRad;
    this.difRad = (this.maxRad - this.minRad);
};

Circle.prototype = {
    col : '#fff',
    rad : 2,

    update : function(count){
        var rate = ( 1 + Math.sin(count))/2 * .8;
        // var otherRate  = (1 + Math.cos(count * 2))/2;
        // var otherRate2 = (1 + Math.sin(count * 4))/2;

        var rad  = this.difRad  * rate + this.minRad;
        
        
        var xPos = rad * Math.cos(this.theta);
        var yPos = rad * Math.sin(this.theta);

        var col = parseInt(100 + 155 * rate);

        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgb( ' + col + ', ' + col + ', ' + col + ')';
        this.ctx.arc( xPos, yPos, this.rad, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
    }
};

// ================
var shape;

init();
loop();

function init(){
    shape = new Shape( ctx, width/2, height/2);

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
