// --------------------------

var width, height, prevTime;
var side, rad;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

var ptArr    = [];
var ptNumber = 120;

width = window.innerWidth;
height = window.innerHeight;

side = Math.min(width, height) * .9;
rad  = side / 2 * .8;

canvas.width  = width;
canvas.height = height;

var virtualCanvas = document.createElement("canvas");
var virtualLeft, virtualTop;
var maxRad = Math.sqrt(side  * side + side * side) / 2;
var sideNum = 5;

virtualCanvas.width = side;
virtualCanvas.height = side;

virtualLeft = (width - side) / 2;
virtualTop  = (height - side) / 2;

var virtualCtx    = virtualCanvas.getContext("2d");

// ================
var Circles = function(){
    this.circles = [];

    for(var yPos = 0; yPos < sideNum; yPos++){
        this.circles[yPos] = [];

        for(var xPos = 0; xPos < sideNum; xPos++){
            this.circles[yPos][xPos] = new Circle();
        }
    }
};

Circles.prototype = {

    count : 0,
    update : function(){
        this.count += .01;
        var scale = (6 - 4 * Math.cos(this.count))/10;
        virtualCtx.save();
        virtualCtx.translate(side/2, side/2);
        virtualCtx.scale(scale, scale);


        for(var yPos = 0; yPos < sideNum; yPos++) {
            for (var xPos = 0; xPos < sideNum; xPos++) {
                var centerNum = (sideNum - 1)/2;
                var xx = (xPos - centerNum) * side;
                var yy = (yPos - centerNum) * side;

                virtualCtx.save();
                virtualCtx.translate(xx, yy);
                this.circles[yPos][xPos].update();
                virtualCtx.restore();

            }
        }

        virtualCtx.restore();
    }
};




var Circle = function(){

    this.tempCanvas = document.createElement("canvas");

    this.tempCanvas.width  = side;
    this.tempCanvas.height = side;

    this.tempCtx = this.tempCanvas.getContext("2d");

    for(var i = 0; i < ptNumber; i++){
        this.sides[i] = rad * (.8 +.2 * Math.random());
        this.randomSides[i] = rad / 3 * (Math.random() -.5);
    }

};

Circle.prototype = {
    sides  : [],
    randomSides : [],
    count : 0,
    rot : 0,

    update : function(){
        this.count += 0.1;

        var theta;
        this.tempCtx.clearRect(0, 0, side, side);

        for(var i = 0; i < ptNumber; i++){
            var num = i;
            var randomRad = this.randomSides[i] * Math.cos(this.count);
            theta = i / ptNumber * 2 * Math.PI;

            this.tempCtx.beginPath();
            this.tempCtx.strokeStyle = "#ff0000";
            this.tempCtx.moveTo( (this.sides[num] + randomRad) * Math.cos(theta) + side / 2, (this.sides[num] + randomRad) * Math.sin(theta) + side / 2);
            this.tempCtx.lineTo( maxRad * Math.cos(theta) + side / 2, maxRad * Math.sin(theta) + side / 2);
            this.tempCtx.stroke();
            this.tempCtx.closePath();

        }

        virtualCtx.save();

        virtualCtx.drawImage(this.tempCanvas, -side/2, -side/2);

        virtualCtx.restore();



    }

};

// ================
var circle;

init();
loop();

function init(){
    circle = new Circles();

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    prevTime = +new Date;

}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    clear();
    circle.update();

    ctx.drawImage( virtualCanvas, virtualLeft, virtualTop);


    requestAnimationFrame(loop);
}

function clear(){

    virtualCtx.fillStyle = '#fff';
    virtualCtx.fillRect(0, 0, side, side);

}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;