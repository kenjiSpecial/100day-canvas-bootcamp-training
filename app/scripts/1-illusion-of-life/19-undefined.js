// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var Point = function(x, y){
    this.x = x;
    this.y = y;
}

var Circle = function(ctx, x, y, rad, val){
    this.ctx = ctx;

    this.rad = rad;
     this.pt = new Point(x, y);

    this.isFill = val;
};

Circle.prototype = {
    col : 'rgba(0, 0, 0, 0)',
    update : function(){
        this.ctx.beginPath();

        this.ctx.arc(this.pt.x, this.pt.y, this.rad, 0, 2 * Math.PI, false);

        if(this.isFill){
            this.ctx.fillStyle = this.col;
            this.ctx.fill();
        }else{
            this.ctx.strokeStyle = this.col;
            this.ctx.stroke();
        }

        this.ctx.closePath();
    }
};

var SmallCircle = function(i, ctx, bigRad, theta, rad ){
    this.type    = i % 2;
    this.bigRad  = bigRad;
    this.theta   = theta;

    this.count = 0;

    if(i % 2 == 0) {
        this.vel = this.originalVel = 0.01;
        this.fure = 0.02;
        this.countVel = 0.02;
        this.col = 'rgba(0, 0, 0, 0)';
    }else{
        this.vel = this.originalVel =  0.02;
        this.fure = 0.01;
        this.countVel = 0.01;
        this.col = 'rgba(0, 0, 0, 0)';
    }

    var x = this.bigRad * Math.cos(this.theta);
    var y = this.bigRad * Math.sin(this.theta);


    Circle.call(this, ctx, x, y, rad, true);
};

SmallCircle.prototype = Object.create(Circle.prototype);

SmallCircle.prototype = {
    velocityTheta : 0,
    update : function(){
        this.count++;

        this.vel = this.originalVel +  this.fure * Math.cos(this.count * this.countVel);
        this.theta += this.vel;

        this.pt.x = this.bigRad * Math.cos(this.theta);
        this.pt.y = this.bigRad * Math.sin(this.theta);

        Circle.prototype.update.call(this);
    }
};

var AnimationCircle = function(smallCircle, curRad){
    this.parentCircle = smallCircle;

    this.minRad = -200;
    this.maxRad = 200;

    this.curRad = curRad;
    var x = this.curRad * Math.cos(this.parentCircle);
    var y = this.curRad * Math.sin(this.parentCircle);

    this.type = this.parentCircle.type;

    if(this.type % 2 == 0) this.col = '#999';
    else                   this.col = '#fff';

    this.vel = .5;

    Circle.call(this, smallCircle.ctx, x, y, smallCircle.rad/3, true);
};

AnimationCircle.prototype = Object.create(Circle.prototype);

AnimationCircle.prototype = {
    update : function(){
        this.curRad -= this.vel;

        if(this.curRad < this.minRad){
            //this.curRad = this.curRad + (this.minRad -this.curRad);
            this.vel = -.5
        }

        if(this.curRad > this.maxRad){
            //this.curRad = this.curRad - (this.maxRad -this.curRad);
            this.vel = .5;
        }

        this.pt.x = this.curRad * Math.cos(this.parentCircle.theta);
        this.pt.y = this.curRad * Math.sin(this.parentCircle.theta);

        Circle.prototype.update.call(this);
    }
};


var MainCircle = function(ctx, x, y){
    this.ctx = ctx;
    this.point = new Point(x, y);

    this.bigCircle = new Circle(ctx, 0, 0, this.rad, false);

    this.circleArr = [];
    this.animCircleArr = [];
    for(var i = 0; i < this.circleNum; i++){
        var theta = i / this.circleNum  * Math.PI * 2;

        var circle = new SmallCircle( i, ctx, this.rad, theta, this.smallRad);
        this.circleArr.push(circle);

        for(var j = 0; j < 11; j++){

            var animCircle = new AnimationCircle(circle, -j * 40 + 200);
            this.animCircleArr.push(animCircle);
        }
    }
};

MainCircle.prototype = {
    rad : 200,
    smallRad : 8,
    circleArr : null,
    circleNum : 24,
    count : 0,

    update : function(){
        this.count = this.count + 0.01;

        this.val = Math.sin(this.count) * .5 + Math.sin(this.count/2) * .3 + 1;

        this.ctx.save();
        this.ctx.translate(this.point.x, this.point.y);
        this.ctx.scale(this.val, this.val)

        this.bigCircle.update();

        for(var i = 0; i < this.circleArr.length; i++){
            this.circleArr[i].update();
        }

        for(i = 0; i < this.animCircleArr.length; i++){
            this.animCircleArr[i].update();
        }

        this.ctx.restore();
    }
};



// ================
var mainCircle;

init();
loop();

function init(){
    mainCircle = new MainCircle(ctx, width/2, height/2);
    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    mainCircle.update();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
