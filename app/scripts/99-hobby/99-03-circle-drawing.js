/**
 * Created by kenji-special on 10/27/14.
 */
// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var extraMarker = {
    yPos : -1/2*window.innerHeight
};

var animationCircle = {
    start : - Math.PI ,
    end   : - Math.PI
};

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;


// ================

var Flag = function(number, theta, rad){
    this.setup(number, theta, rad);
};

Flag.prototype = {
    isDraw     : false,

    strokeCol  : '#a1a1a1',
    fillCol    : '#999',

    length     : 50,
    flagHeight : 25,

    setup : function(number, theta, rad){

        this.number = number;

        this.curTheta = -theta - Math.PI/2;

        var xPos = rad * Math.cos(this.curTheta);
        var yPos = rad * Math.sin(this.curTheta);

        this.startXPos = this.endXPos = this.flagXPos = xPos;
        this.startYPos = this.endYPos = this.flagYPos = yPos;

        this.targetXPos = (rad + this.length) * Math.cos(this.curTheta);
        this.targetYPos = (rad + this.length) * Math.sin(this.curTheta);

        this.targetX1Pos = (rad + this.flagHeight) * Math.cos(this.curTheta);
        this.targetY1Pos = (rad + this.flagHeight) * Math.sin(this.curTheta);

        // ---------------------------------------------

        this.target1XPos = (rad - 5)  * Math.cos(this.curTheta);
        this.target1YPos = (rad - 5)  * Math.sin(this.curTheta);

        this.flag1XPos = 40 * Math.cos(this.curTheta + Math.PI/2);
        this.flag1YPos = 40 * Math.sin(this.curTheta + Math.PI/2);



        this.flagsPos76

    },

    startAnimation : function(){
        this.isDraw = true;

        TweenLite.to( this, .3, {endXPos: this.targetXPos, endYPos: this.targetYPos, flagXPos: this.targetX1Pos, flagYPos: this.targetY1Pos, ease : 'Power2.easeOut' });
    },

    update : function(ctx){
        if(!this.isDraw) return;

        ctx.strokeStyle = this.strokeCol;
        ctx.beginPath();
        ctx.moveTo(this.startXPos, this.startYPos);
        ctx.lineTo(this.endXPos, this.endYPos);
        ctx.stroke();


        ctx.beginPath();

        ctx.fillStyle = this.fillCol;
        ctx.beginPath();
        ctx.moveTo(this.endXPos, this.endYPos);
        ctx.lineTo(this.endXPos + this.flag1XPos, this.endYPos + this.flag1YPos);
        ctx.lineTo(this.flagXPos + this.flag1XPos, this.flagYPos + this.flag1YPos);
        ctx.lineTo( this.flagXPos,  this.flagYPos);
        ctx.lineTo(this.endXPos, this.endYPos);
        ctx.closePath();

        ctx.fill();

        ctx.save();
        ctx.font="18px Open Sans";
        ctx.fillStyle = "#fff";
        ctx.textAlign="center";
        ctx.textBaseline = 'middle';
        ctx.translate( (this.endXPos + this.flagXPos + this.flag1XPos)/2, (this.endYPos + this.flagYPos + this.flag1YPos)/2);
        ctx.rotate(this.curTheta + Math.PI/2);
        ctx.fillText(this.number, 0, 0);
        ctx.restore();

        /*
        ctx.beginPath();
        ctx.moveTo(this.startXPos, this.startXPos);
        ctx.lineTo(this.endXPos, this.endXPos);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.startYPos, this.startYPos);
        ctx.lineTo(this.endYPos, this.endYPos);
        ctx.stroke();*/
    }
};

var sampleWorksNumber = 55;

var side = 20;
var outlineRad = 200;
var inlineRad = 190;
var flags = [];

// ================

init();
loop();


function init(){
    TweenLite.to( extraMarker, 1, { yPos : 0, ease : 'Bounce.easeOut', delay: 1});
    TweenLite.to( animationCircle, 1, { start : 0, end : 2 * Math.PI, ease : 'Power2.easeOut', delay: 1});//, onComplete: circleAnimationDone });

    for(var i = 0;i < sampleWorksNumber; i+= 10){
        var theta = Math.PI * i / sampleWorksNumber * 2;
        var flag = new Flag(i,theta, outlineRad );

        flags.push(flag);
    }

    prevTime = +new Date;

    _.delay(circleAnimationDone, 1500);
}

function circleAnimationDone(){

    for(var i = 0; i < flags.length; i++){
        flags[i].startAnimation();
    }

}

function loop(){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.save();
    ctx.translate(window.innerWidth/2, window.innerHeight/2);

    var theta = 0 - Math.PI/2;

    var theta1 = theta - Math.PI/6;
    var theta2 = theta + Math.PI/6;

    var pt1X = Math.cos(theta) * outlineRad;
    var pt1Y = Math.sin(theta) * outlineRad;

    var dx1 = side * Math.cos(theta1);
    var dy1 = side * Math.sin(theta1);

    var dx2 = side * Math.cos(theta2);
    var dy2 = side * Math.sin(theta2);




    ctx.beginPath();
    ctx.strokeStyle = '#cccccc';
    ctx.arc(0, 0, outlineRad, animationCircle.start, animationCircle.end);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = '#cccccc';
    ctx.arc(0, 0, inlineRad, animationCircle.start, animationCircle.end);
    ctx.fill();
    ctx.closePath();


    // drawing the flag

    for(var i = 0; i < flags.length; i++){
        flags[i].update(ctx);
    }

    ctx.save();
    ctx.translate(0, extraMarker.yPos);

    ctx.beginPath();

    ctx.moveTo(pt1X, pt1Y);
    ctx.lineTo(pt1X + dx1, pt1Y + dy1);
    ctx.lineTo(pt1X + dx2, pt1Y + dy2);
    ctx.lineTo(pt1X, pt1Y);
    ctx.closePath();
    ctx.fillStyle = '#3d9ae8';
    ctx.fill();

    ctx.restore();

    ctx.restore();


    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
