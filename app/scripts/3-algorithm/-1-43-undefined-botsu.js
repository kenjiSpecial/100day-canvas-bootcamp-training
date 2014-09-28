// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
VectorManipulator = {
    sub : function(main, other){
        var x = main.x - other.x;
        var y = main.y - other.y;
        var vec = new Vector(x, y);

        return vec;
    }
};
var Vector = function(x, y){
    this.x = x || 0;
    this.y = y || 0;
};


Vector.prototype = {
    sub : function(vec){
        this.x = this.x - vec.x;
        this.y = this.y - vec.y;
    },

    add : function(vec){
        this.x = this.x + vec.x;
        this.y = this.y + vec.y;
    },

    mag : function(){
        var magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        return magnitude;
    },

    getAngle : function(){
        var theta = Math.atan2(this.y, this.x);
        return theta;
    }

};

var friction = 1;

// ----------------
var Circle = function(x, y, rad){
    this.rad = rad;
    this.velocity = new Vector();
    this.position = new Vector(x, y);
};

Circle.prototype = {
    g        : 1,
    m        : 1,
    rad      : null,
    velocity : null,
    position : null,

    setVelocity : function(x, y){
        this.velocity.x = x;
        this.velocity.y = y;
    },

    setMass : function(val){
        this.m = val;
    },

    update : function(){
        this.velocity.y += this.g;

        this.position.add(this.velocity);
        this.updateForBoarder();

    },

    updateForBoarder : function(){
        var dis;
        var masatsu = .8;
        if(this.position.x -this.rad < 0){
            dis = -1 * (this.position.x - this.rad);
            this.position.x += dis;
            this.velocity.x *= -masatsu;
        }

        if(this.position.x + this.rad > width){
            dis = this.position.x + this.rad - width;
            this.position.x -= dis;
            this.velocity.x *= -masatsu;
        }

        if(this.position.y - this.rad < 1/3 * height){
            dis = -1 * (this.position.y - this.rad);
            this.position.y += dis;
            this.velocity.y *= -masatsu;
        }

        if(this.position.y + this.rad > height){
            dis = this.position.y + this.rad - height;
            this.position.y -= dis;
            this.velocity.y *= -masatsu;
        }
    },

    checkCollision : function(circle){
        var bVector = VectorManipulator.sub( circle.position, this.position);
        var dis = bVector.mag();
        //console.log(circle.rad);
        if(dis < this.rad + circle.rad){
            var theta = bVector.getAngle();
            var sine = Math.sin(theta);
            var cosine = Math.cos(theta);

            var tempVec0 = new Vector();
            var tempVec1 = new Vector();

            tempVec1.x = cosine * bVector.x + sine * bVector.y;
            tempVec1.y = cosine * bVector.y - sine * bVector.x;

            var vTempVec0 = new Vector();
            var vTempVec1 = new Vector();

            vTempVec0.x  = cosine * this.velocity.x + sine * this.velocity.y;
            vTempVec0.y  = cosine * this.velocity.y - sine * this.velocity.x;
            vTempVec1.x  = cosine * circle.velocity.x + sine * circle.velocity.y;
            vTempVec1.y  = cosine * circle.velocity.y - sine * circle.velocity.x;

            var vFinal0 = new Vector();
            var vFinal1 = new Vector();

            //vFinal0.x = ((this.m - circle.m) * vTempVec0.x + 2 * circle.m * vTempVec1.x) / (this.m + circle.m);
            vFinal0.x = ((this.m - friction * circle.m) * vTempVec0.x + (1 + friction) * circle.m * vTempVec1.x) / (this.m + circle.m);
            vFinal0.y = vTempVec1.y;

            // final rotated velocity for b[0]
            vFinal1.x = ((circle.m - friction * this.m) * vTempVec1.x + (friction + 1) * this.m * vTempVec0.x) / (this.m + circle.m);
            vTempVec1.y = vTempVec1.y;

           tempVec0.x += vFinal0.x;
           tempVec1.x += vFinal1.x;

            var bFinal0 = new Vector();
            var bFinal1 = new Vector();

            bFinal0.x = cosine * tempVec0.x - sine * tempVec0.y;
            bFinal0.y = cosine * tempVec0.y + sine * tempVec0.x;
            bFinal1.x = cosine * tempVec1.x - sine * tempVec1.y;
            bFinal1.y = cosine * tempVec1.y + sine * tempVec1.x;

            circle.position.x = this.position.x + bFinal1.x;
            circle.position.y = this.position.y + bFinal1.y;

            this.position.add(bFinal0);

            this.velocity.x = cosine * vFinal0.x - sine * vFinal0.y;
            this.velocity.y = cosine * vFinal0.y + sine * vFinal0.x;


            circle.velocity.x = cosine * vFinal1.x - sine * vFinal1.y;
            circle.velocity.y = cosine * vFinal1.y + sine * vFinal1.x;

        }
    },

    draw : function(){
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.arc(this.position.x, this.position.y, this.rad, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
    }
};

//================
var circleArr = [];
var circleNum = 10;

init();
loop();

function init(){

    for(var i = 0; i < circleNum; i++){
        var xPos = (.1 + .8 * Math.random()) * width;
        var yPos =  (1/3 + 2/3 * (Math.random() * .8 +.1))*height;
        var rad = parseInt(10 + 25 * Math.random());
        var circle = new Circle(xPos, yPos, rad);
        circle.m = rad;

        circleArr.push(circle);
    }


    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;
    ctx.fillStyle = "#fff";
    ctx.fillRect( 0, 0, width, height/3);

    ctx.fillStyle = '#333';
    ctx.fillRect( 0, height/3, width, height * 2 / 3);

    circleArr.forEach((function(element, index){
        element.update();
        for(var i = 0; i < circleArr.length; i++){
            element.checkCollision(circleArr[i]);
        }
    }));


    circleArr.forEach((function(element, index){
        element.draw();
    }));

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
