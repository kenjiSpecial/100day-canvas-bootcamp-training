// --------------------------

var width, height, prevTime;
var virtualWidth, virtualHeight, virtualLeft, virtualRight;
var widthNumber, heightNumber;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// 100pix random
var intervalX = 100;

virtualWidth = parseInt(width / intervalX) * intervalX + intervalX * 4;
virtualLeft = (width - virtualWidth) / 2;
virtualRight = virtualLeft + virtualWidth;

widthNumber = virtualWidth / 100;

heightNumber = parseInt(height / 2 / 100) + 1;


// ================
var obj = {};
obj.rad = 15;
var velY = -200;

var LeftCircle = function( xPos, yPos ){
    this.ctx = ctx;

    this.x = xPos;
    this.y = yPos;

    this.theta = 0;
};

LeftCircle.prototype = {
    col : "#fff",
    update : function(){
        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.theta);

        this.ctx.beginPath();
        this.ctx.moveTo( 0, 0);
        this.ctx.lineTo( obj.rad * Math.cos(Math.PI * 3/2), obj.rad * Math.sin(Math.PI*3/2) );
        this.ctx.arc(0, 0, obj.rad, Math.PI * 3/2, Math.PI *  2, false);
        this.ctx.lineTo( obj.rad * Math.cos( 2 * Math.PI), obj.rad * Math.sin(2 * Math.PI) );
        this.ctx.closePath();

        this.ctx.fillStyle = this.col;
        this.ctx.fill();


        this.ctx.beginPath();
        this.ctx.moveTo( 0, 0);
        this.ctx.lineTo( obj.rad * Math.cos(Math.PI /2), obj.rad * Math.sin(Math.PI/2) );
        this.ctx.arc(0, 0, obj.rad, Math.PI /2, Math.PI, false);
        this.ctx.lineTo( obj.rad * Math.cos(Math.PI), obj.rad * Math.sin(Math.PI) );
        this.ctx.closePath();

        this.ctx.fillStyle = this.col;
        this.ctx.fill();

        this.ctx.restore();

    },

    rotate : function(){
        var theta = this.theta + Math.PI;

        TweenLite.to(this, .6, { theta: theta});
    }
};


var CircleTopLeft = function( xPos, yPos ){
    _.bindAll(this, "rotate", "onCompleteRotation");
    this.ctx = ctx;

    this.x = xPos;
    this.y = yPos;

    this.acl = (velY * -2) / 0.6;

    this.thetaVal = Math.PI * 2 / .6;
    this.velX = 100 / .6;
};



CircleTopLeft.prototype = {
    theta : 0,
    col : "#fff",
    acl : null,

    originX : null,
    originY : null,
    originTheta : null,

    changePos : function(){
    },

    update : function(dt){



        if(this.isRotation){
            this.x -= this.velX * dt;
            if(this.x < this.originX - intervalX) this.x = this.originX - intervalX;

            this.velY += this.acl * dt;
            this.y -= this.velY * dt;
            if(this.y < this.originY) this.y = this.originY;

            this.theta += this.thetaVal * dt;
        }

        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.theta);

        this.ctx.beginPath();
        this.ctx.moveTo( 0, 0);
        this.ctx.lineTo( obj.rad * Math.cos(Math.PI), obj.rad * Math.sin(Math.PI) );
        this.ctx.arc(0, 0, obj.rad, Math.PI, Math.PI * 3 / 2, false);
        this.ctx.lineTo( obj.rad * Math.cos(3 / 2 * Math.PI), obj.rad * Math.sin(3 / 2 * Math.PI) );
        this.ctx.closePath();

        this.ctx.fillStyle = this.col;
        this.ctx.fill();

        this.ctx.restore();
    },

    rotate : function(){
        var duration = 0.6;

        this.velY = velY;
        this.isRotation = true;

        this.originX     = this.x;
        this.originY     = this.y;
        this.originTheta = this.theta;

        setTimeout(this.onCompleteRotation, 600);
    },

    onCompleteRotation : function(){
        this.isRotation = false;

        this.x = this.originX - intervalX;
        this.y = this.originY;
        this.theta = this.originTheta;

        if(this.x <= virtualLeft) this.x += virtualWidth;
    }
};

var CircleBottomRight = function( xPos, yPos ){
    _.bindAll(this, "rotate", "onCompleteRotation");
    this.ctx = ctx;

    this.x = xPos;
    this.y = yPos;

    this.acl = (velY * -2) / 0.6;

    this.thetaVal = Math.PI * 2 / .6;
    this.velX = 100 / .6;

    console.log(this.x);

};

CircleBottomRight.prototype = {
    theta : 0,
    col : "#fff",
    acl : null,

    originX : null,
    originY : null,
    originTheta : null,

    update : function(dt){
        if(this.isRotation){
            this.x += this.velX * dt;
            if(this.x > this.originX + intervalX) this.x = this.originX + intervalX;

            this.velY += this.acl * dt;
            this.y += this.velY * dt;
            if(this.y > this.originY) this.y = this.originY;

            this.theta += this.thetaVal * dt;
        }



        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.theta);


        this.ctx.beginPath();
        this.ctx.moveTo( 0, 0);
        this.ctx.lineTo( obj.rad * Math.cos(0), obj.rad * Math.sin(0) );
        this.ctx.arc(0, 0, obj.rad, 0, Math.PI  / 2, false);
        this.ctx.lineTo( obj.rad * Math.cos(1 / 2 * Math.PI), obj.rad * Math.sin(1 / 2 * Math.PI) );
        this.ctx.closePath();

        this.ctx.fillStyle = this.col;
        this.ctx.fill();

        this.ctx.restore();

    },

    rotate : function(){
        var duration = 0.6;

        this.velY = velY;
        this.isRotation = true;

        this.originX     = this.x;
        this.originY     = this.y;
        this.originTheta = this.theta;

        setTimeout(this.onCompleteRotation, 600);
    },

    onCompleteRotation : function(){
        this.isRotation = false;

        this.x = this.originX + intervalX;
        this.y = this.originY;
        this.theta = this.originTheta;

        if(this.x >= virtualRight) this.x -= virtualWidth;
    }
};

// ================

var circleTopLeft;

//var circleArr = [];
var circleWidthArr = [];
var circleBotArr   = [];
var circleLeftArr  = [];

var count = 0;
var i, j;

circleWidthArr[count] = [];
circleBotArr[count]   = [];
circleLeftArr[count]  = [];

for(i = 0; i < widthNumber; i++){
    xPos  = (i + 1) * intervalX + virtualLeft;
    xPos2 = i * intervalX + virtualLeft;
    yPos = height / 2;

    circleWidthArr[count][i] = new CircleTopLeft( xPos, yPos );
    circleBotArr[count][i]   = new CircleBottomRight( xPos2, yPos )
}

for(var i = 1; i < widthNumber - 1; i++){
    var xPos = i * intervalX + virtualLeft;
    var yPos = height / 2;

    circleLeftArr[count][i - 1] = new LeftCircle(xPos, yPos);
}

if(heightNumber > 0) {
    var yPos1, yPos2;
    var xPos1, xPos2;
    var yPos,  xPos;

    for (j = 1; j < heightNumber; j++) {
        yPos1 = height / 2 - intervalX * j;
        yPos2 = height / 2 + intervalX * j;

        var tempCount = 2 * count + 1;

        for(var k = 0; k < 2; k++) {
            circleWidthArr[tempCount] = [];
            circleBotArr[tempCount]   = [];
            circleLeftArr[tempCount]  = [];

            if(k == 0) yPos = yPos1;
            if(k == 1) yPos = yPos2;

            for (i = 0; i < widthNumber; i++) {
                if (j % 2 == 1) xPos1 = (i + 1) * intervalX + intervalX / 2 + virtualLeft;
                else           xPos1 = (i + 1) * intervalX + virtualLeft;

                if (j % 2 == 1) xPos2 = i * intervalX + virtualLeft - intervalX / 2;
                else           xPos2 = i * intervalX + virtualLeft;

                circleWidthArr[tempCount][i] = new CircleTopLeft(xPos1, yPos);
                circleBotArr[tempCount][i] = new CircleBottomRight(xPos1, yPos);
            }

            for (i = 1; i < widthNumber - 1; i++) {
                if (j % 2 == 1) xPos = i * intervalX + intervalX / 2 + virtualLeft;
                else            xPos = i * intervalX + virtualLeft;

                circleLeftArr[tempCount][i - 1] = new LeftCircle(xPos, yPos);
            }

            tempCount++;
        }

        count++;

    }
}



// ================

init();
loop();

function init(){


    prevTime = +new Date;

    movement();
    setTimeout(timer, 1000);
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    for(var j = 0; j < circleWidthArr.length; j++) {

        for (var i = 0; i < circleWidthArr[j].length; i++) {
            circleWidthArr[j][i].update(duration);
            circleBotArr[j][i].update(duration);
        }

        for (var i = 0; i < circleLeftArr[j].length; i++) {
            circleLeftArr[j][i].update(duration);
        }

    }



    requestAnimationFrame(loop);
}

function timer(){
    var randomRad = 5 + parseInt(Math.random() * 45);
    TweenLite.to( obj, 1, { rad: randomRad });

    setTimeout(timer, 2000);
}

function movement(){
    for(var j = 0; j < circleWidthArr.length; j++) {

        for (var i = 0; i < circleWidthArr[j].length; i++) {
            circleWidthArr[j][i].rotate();
            circleBotArr[j][i].rotate();

        }

        for (var i = 0; i < circleLeftArr[j].length; i++) {
            circleLeftArr[j][i].rotate();
        }
    }

    setTimeout(movement, 2000);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;