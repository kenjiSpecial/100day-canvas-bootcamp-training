// --------------------------

var app;
var fK;
var width, height, prevTime;
var halfWidth, halfHeight;

var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

halfWidth = width / 2;
halfHeight = height / 2;

canvas.width  = width;
canvas.height = height;

// ================
fK = 0.25;
var widthNum = 31;

var Point = function(){

};

Point.prototype = {
    x : null,
    y : null,
    vel: 0,
    mass : 10,

    setPosY : function(value){
        this.y = this.baseYPos = value;
    }

};



var SmallCircle = function(){

};

SmallCircle.prototype = {

};

var MainShape = function(){
    this.points = [];

    var gapDistance = (width) / (this.pointNumber - 1);
    var xPos;
    var i;

    for(i = 0; i < this.pointNumber; i++){
        xPos = gapDistance * i;
        var myPt = new Point();
        myPt.x = xPos;
        myPt.setPosY(0);
        //myPt.y = 0;
        this.points.push( myPt );i
    }

    this.particleSprings = [];

    for(i = 0; i < this.pointNumber - 1; i++){
        var spring = {iLengthY: this.points[i + 1].y - this.points[i].y };
        this.particleSprings.push( spring );
    }

    //this.points[this.points.length - 1].y = 200;

};


/*
 this.mcParticles[i].fXPos	= this.mcParticles[i]._x;
 this.mcParticles[i].fYAccel	= 0;
 this.mcParticles[i].fYVel	= 0;
 this.mcParticles[i].fYPos	= this.mcParticles[i]._y;
 this.mcParticles[i].fBaseYPos	= this.mcParticles[i]._y;
 this.mcParticles[i].iMass = 10;
 */

MainShape.prototype = {

    pointNumber : widthNum,
    particleSprings : [],

    x : 0,
    y : 0,

    col : "#fff",

    update : function(){
        // calculation
        var i;
        for( i = 0; i < this.points.length; i++){
            var fExtensionY = 0;
            var fForceY     = 0;


            if(i > 0){
                fExtensionY = this.points[i - 1].y - this.points[i].y - this.particleSprings[i-1].iLengthY;
                fForceY += - fK * fExtensionY;
            }



            if( i < this.points.length - 1){
                fExtensionY = this.points[i].y - this.points[i+1].y - this.particleSprings[i].iLengthY;
                fForceY += fK * fExtensionY;
            }

            fExtensionY = this.points[i].y - this.points[i].baseYPos;
            fForceY     += fK/20 * fExtensionY;

            this.points[i].acl = - fForceY;
            this.points[i].vel += this.points[i].acl;
            this.points[i].y   += this.points[i].vel;
            this.points[i].y   += 0.2 * (this.points[i].baseYPos - this.points[i].y);

            this.points[i].vel /= 1.2;
        }

        // ================

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.beginPath();
        ctx.lineWidth = 2;

        /**
        for( i = 0; i < this.pointNumber; i++){
            if(i == 0) ctx.moveTo(this.points[i].x, this.points[i].y);
            else       ctx.lineTo(this.points[i].x, this.points[i].y);
        }**/

        for(i = 0; i < this.pointNumber- 1; i++ ){
            var xPos = (this.points[i].x + this.points[i + 1].x)/2;
            var yPos = (this.points[i].y + this.points[i + 1].y)/2;

            if(i == 0) ctx.moveTo(xPos, yPos);
            else       ctx.quadraticCurveTo( this.points[i].x, this.points[i].y, xPos, yPos);

        }


        //ctx.closePath();
        ctx.strokeStyle = this.col;
        ctx.stroke();

        ctx.restore();
    },

    setCircle : function(xPos, yPos){
        for(var i = 0; i < this.points.length; i++){
            var dx = xPos - this.x - this.points[i].x;
            var dy = yPos - this.y - this.points[i].y;

            var dis = Math.sqrt(dx * dx + dy * dy);

            if(dis < 60){
                this.points[i].y += 40;
            }
        }

    },

    addImpulse : function(){

        //this.points[parseInt(this.points.length/2)].vel = .1;
    }
};

var App = function(){
    var kankakuHeight = 50;
    var kankakuHeightNum = parseInt(height/kankakuHeight) ;

    // createCircle
    // width: widthNum \\ height: kankakuHeightNum


    for(var i = 0; i < kankakuHeightNum; i++){
        var mainShape = new MainShape();
        mainShape.y = kankakuHeight * (i + 1);
        this.mainShapeArr.push(mainShape);

    }



};

App.prototype = {
    mainShapeArr : [],
    bgCol : "#333",
    update : function(){
        ctx.fillStyle = this.bgCol;
        ctx.fillRect(0, 0, width, height);

        this.mainShapeArr.forEach(function(element){
            element.update();
        });
    },

    xPos : 60,
    yPos : 60,
    kigo : +1,

    num : 12,
    rad : 60,

    addImpulse : function(){
        this.yPos += this.kigo * 50; //= (this.yPos + 50) % height;
        if(this.yPos > height - this.rad ) {
            this.yPos = height - this.rad;
            this.kigo  = -1;
        }
        if(this.yPos < this.rad) {
            this.yPos = this.rad;
            this.kigo = 1;
        }

        this.xPos += this.kigo * 50;
        if(this.xPos > width - this.rad ) {
            this.xPos = width - this.rad;
            this.kigo  = -1;
        }
        if(this.xPos < this.rad) {
            this.xPos = this.rad;
            this.kigo = 1;
        }



        for(var i = 0; i < this.num; i++){
            var xPos = this.rad * Math.cos(2 * Math.PI * i / this.num) + width/2;
            var yPos = this.rad * Math.sin(2 * Math.PI * i / this.num) + this.yPos;

            // xPos, yPos
            for(var jj = 0; jj < this.mainShapeArr.length; jj++){
                this.mainShapeArr[jj].setCircle(xPos, yPos);
            }

            //
            var xPos = this.rad * Math.cos(2 * Math.PI * i / this.num) + this.xPos;
            var yPos = this.rad * Math.sin(2 * Math.PI * i / this.num) + height/2;

            // xPos, yPos
            for(var jj = 0; jj < this.mainShapeArr.length; jj++){
                this.mainShapeArr[jj].setCircle(xPos, yPos);
            }
        }
    }
};

// ================

init();
loop();


function init(){
    app = new App();

    timer();
}

function timer(){
    app.addImpulse();
    setTimeout(timer, 100);
}

function loop(){
    app.update();

    requestAnimationFrame(loop);
    //setTimeout(loop, 1000);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;