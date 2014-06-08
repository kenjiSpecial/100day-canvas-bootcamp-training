window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

// ---------------------

/**
 * Created with JetBrains WebStorm.
 * User: kenjisaito
 * Date: 12/14/12
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */

var Circle = function(rad, centerPoint){
    this.rad = rad;
    this.centerPoint = centerPoint;
};

//define the point class

var DelaunayDataSet = function( vertex, context){
    this.vertex = vertex;
    this.context = context;

    this.fillTriangleColor = "rgba(30, 30, 30, .2)";
    this.fillTriangleCheck = false;

    this.strokeTriangleColor = "rgba( 200, 200, 200, .05)";
    this.strokeTriangleCheck = true;
};

DelaunayDataSet.prototype.addPoints = function(ptArr){
    for(var i = 0; i < ptArr.length; i++){
        this.vertex.push(ptArr[i]);
    }
};

DelaunayDataSet.prototype.drawTriangle = function(){

    for (var i = 0; i < this.triangleVertexNumber.length; i += 3) {

        if(this.triangleVertexNumber[i] !== 0 && this.triangleVertexNumber[i] !== 1 && this.triangleVertexNumber[i] !== 2 && this.triangleVertexNumber[i + 1] !== 0 && this.triangleVertexNumber[i + 1] !== 1 && this.triangleVertexNumber[i + 1] !== 2&& this.triangleVertexNumber[i + 2] !==  0&& this.triangleVertexNumber[i + 2] !== 1 && this.triangleVertexNumber[i + 2] !== 2){

            this.context.beginPath();
//        console.log(this.triangleVertexNumber[i]);

            this.context.moveTo(this.vertex[this.triangleVertexNumber[i]].x, this.vertex[this.triangleVertexNumber[i]].y);
//        console.log(this.triangleVertexNumber[i + 1]);
            this.context.lineTo(this.vertex[this.triangleVertexNumber[i + 1]].x, this.vertex[this.triangleVertexNumber[i + 1]].y);
//        console.log(this.triangleVertexNumber[i + 2]);
            this.context.lineTo(this.vertex[this.triangleVertexNumber[i + 2]].x, this.vertex[this.triangleVertexNumber[i + 2]].y);
            this.context.lineTo(this.vertex[this.triangleVertexNumber[i]].x, this.vertex[this.triangleVertexNumber[i]].y);

            if (this.fillTriangleCheck) {
                this.context.fillStyle = this.fillTriangleColor;
                this.context.fill();
            }

            if (this.strokeTriangleCheck) {
                this.context.strokeStyle = this.strokeTriangleColor;
                this.context.stroke();
            }

            this.context.closePath();

        }
    }
};

DelaunayDataSet.prototype.update = function(){

    var vertexNumber = this.vertex.length;
    this.triangleVertexNumber = [ 0, 1, 2];
    this.circumCircles = [];


    var firstCircle = calculationCircle( this.vertex[0], this.vertex[1], this.vertex[2]);
    this.circumCircles.push(firstCircle);

    for(var i = 3; i < vertexNumber; i++){
        calTriangles(this, i);
        if(i > 3){
            removeTriangle(this, i);
        }
    }

};


// define the method which is very useful
function distanceBetweenPoints(pt1, pt2){
    var dx = pt2.x - pt1.x;
    var dy = pt2.y - pt1.y;

    return  Math.sqrt(dx * dx + dy * dy);
}

function distanceBetweenPointAndCircle(pt, circle){
    var dx = pt.x - circle.centerPoint.x;
    var dy = pt.y - circle.centerPoint.y;

    return  Math.sqrt(dx * dx + dy * dy);
}

function judgeBetweenDistance(_pt, _circle) {
    var dis = distanceBetweenPointAndCircle(_pt, _circle);

    var circleJudge = false;
    if (dis < _circle.rad) {
        circleJudge = true;
    }

    return circleJudge;
}

//this is the process of 3 ( separating of the triangles, add the circum circles, and deleting the extra triangle
function calTriangles( _delaunayDataSet, num){
    var newNumber = num;
    var pt = _delaunayDataSet.vertex[newNumber];

    var tempVertexNumber = [];
    var tempCircles = [];
    var tempNumbers =[];

    for(var i = 0; i < _delaunayDataSet.circumCircles.length; i++){
//        console.log("i: " + i);
        if(judgeBetweenDistance(pt, _delaunayDataSet.circumCircles[i])){
            tempNumbers.push(i);

            var selectingNum01 = _delaunayDataSet.triangleVertexNumber[3 * i];
            var selectingNum02 = _delaunayDataSet.triangleVertexNumber[3 * i + 1];
            var selectingNum03 = _delaunayDataSet.triangleVertexNumber[3 * i + 2];

//                push the number to pointNumbers array
            tempVertexNumber.push(selectingNum01);
            tempVertexNumber.push(selectingNum02);
            tempVertexNumber.push(newNumber);

            tempVertexNumber.push(selectingNum02);
            tempVertexNumber.push(selectingNum03);
            tempVertexNumber.push(newNumber);

            tempVertexNumber.push(selectingNum03);
            tempVertexNumber.push(selectingNum01);
            tempVertexNumber.push(newNumber);

            var ct01circle1 = calculationCircle( _delaunayDataSet.vertex[selectingNum01], _delaunayDataSet.vertex[selectingNum02], _delaunayDataSet.vertex[newNumber]);
            var ct01circle2 = calculationCircle( _delaunayDataSet.vertex[selectingNum02], _delaunayDataSet.vertex[selectingNum03], _delaunayDataSet.vertex[newNumber]);
            var ct01circle3 = calculationCircle( _delaunayDataSet.vertex[selectingNum03], _delaunayDataSet.vertex[selectingNum01], _delaunayDataSet.vertex[newNumber]);

            tempCircles.push(ct01circle1);
            tempCircles.push(ct01circle2);
            tempCircles.push(ct01circle3);
        }
    }

    for(i = 0; i < tempVertexNumber.length; i++){
        _delaunayDataSet.triangleVertexNumber.push(tempVertexNumber[i]);
    }

    for(i = 0; i < tempCircles.length; i++){
        _delaunayDataSet.circumCircles.push(tempCircles[i]);
    }

    for (i = 0; i < tempNumbers.length; i++) {
        var num = tempNumbers[i] - i;

        var slicedObjectPtNumbers;
        var slicedCircles;

        if (num == 0) {
            slicedObjectPtNumbers = _delaunayDataSet.triangleVertexNumber.slice(3);
            slicedCircles = _delaunayDataSet.circumCircles.slice(1);
        } else {
            var slicedObjectPtNumberBefore = _delaunayDataSet.triangleVertexNumber.slice(0, 3 * num);
            var slicedObjectPtNumberAfter = _delaunayDataSet.triangleVertexNumber.slice(3 * num + 3);
            slicedObjectPtNumbers = slicedObjectPtNumberBefore.concat(slicedObjectPtNumberAfter);

            var slicedCircleBefore = _delaunayDataSet.circumCircles.slice(0, num);
            var slicedCircleAfter = _delaunayDataSet.circumCircles.slice(1 + num);
            slicedCircles = slicedCircleBefore.concat(slicedCircleAfter);
        }

        _delaunayDataSet.triangleVertexNumber = slicedObjectPtNumbers;
        _delaunayDataSet.circumCircles = slicedCircles;
    }

}

function calculationCircle(pt01, pt02, pt03) {

    var x1 = pt01.x;
    var y1 = pt01.y;

    var x2 = pt02.x;
    var y2 = pt02.y;

    var x3 = pt03.x;
    var y3 = pt03.y;

    var c = 2.0 * ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1));
    var tempX = ((y3 - y1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1) + (y1 - y2) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) / c;
    var tempY = ((x1 - x3) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1) + (x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) / c;
    var tempPt = new Point(tempX, tempY);

    var tempRad = Math.sqrt(Math.pow(tempX - x1, 2) + Math.pow(tempY - y1, 2));

    return new Circle(tempRad, tempPt);
}

function removeTriangle( _delaunayDataSet, tempVertexNum){
    var circumcircleArrays = _delaunayDataSet.circumCircles;
    var ommitCircumCircleNumbers = [];

    for( var i = 0; i < circumcircleArrays.length;i++){
        var vertexNum01 = _delaunayDataSet.triangleVertexNumber[i * 3];
        var vertexNum02 = _delaunayDataSet.triangleVertexNumber[i * 3 + 1];
        var vertexNum03 = _delaunayDataSet.triangleVertexNumber[i * 3 + 2];

        for(var num = 0; num < tempVertexNum; num++){
            if(num != vertexNum01 && num != vertexNum02 && num != vertexNum03){

                if(judgeBetweenDistance(_delaunayDataSet.vertex[num], circumcircleArrays[i])){
                    ommitCircumCircleNumbers.push(i);
                    break;
                }

            }
        }

    }


    //omit
    var tempCircumCircleArray = [];
    var tempTriagneNumberArray = [];

    for( i = 0; i < circumcircleArrays.length; i++){
        for(var j = 0; j < ommitCircumCircleNumbers.length; j++){
            if(ommitCircumCircleNumbers[j] == i){
                break;
            }
        }

        if(j == ommitCircumCircleNumbers.length){

            tempTriagneNumberArray.push( _delaunayDataSet.triangleVertexNumber[3 * i]);
            tempTriagneNumberArray.push( _delaunayDataSet.triangleVertexNumber[3 * i + 1]);
            tempTriagneNumberArray.push( _delaunayDataSet.triangleVertexNumber[3 * i + 2]);

            tempCircumCircleArray.push( _delaunayDataSet.circumCircles[i]);
        }
    }



//    console.log("tempTriagneNumberArray.length: " + tempTriagneNumberArray.length);
    _delaunayDataSet.triangleVertexNumber = [];
    for( i = 0; i < tempTriagneNumberArray.length; i++){
        _delaunayDataSet.triangleVertexNumber[i] = tempTriagneNumberArray[i];
    }

    _delaunayDataSet.circumCircles = [];
    for( i = 0; i < tempCircumCircleArray.length; i++){
        _delaunayDataSet.circumCircles[i] = tempCircumCircleArray[i];
    }
}

function initTriangle(context, recWid, recHig, recTop, recLeft){
    var vertex = [];

    var bigRad = Math.sqrt(Math.pow(recWid, 2) + Math.pow(recHig, 2)) / 2;
    var bigCirclePos = new Point(recWid / 2 + recLeft, recHig / 2 + recTop);

    vertex.push(new Point(bigCirclePos.x - Math.sqrt(3) * bigRad, bigCirclePos.y - bigRad));
    vertex.push(new Point(bigCirclePos.x + Math.sqrt(3) * bigRad, bigCirclePos.y - bigRad));
    vertex.push(new Point(bigCirclePos.x, bigCirclePos.y + bigRad * 2));

    var tempPt;
    tempPt = new Point(0, 0);
    vertex.push(tempPt);

    tempPt = new Point( width, 0);
    vertex.push(tempPt);

    tempPt = new Point(0, height);
    vertex.push(tempPt);

    tempPt = new Point( width, height);
    vertex.push(tempPt);

//    setting DelaunayDataSet with the vertex.
    return new DelaunayDataSet( vertex, context);
}

var width, height, prevTime;
var mousePos;
var particleAnimation;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ---------------------

var Point = function(x, y){
    this.x = this.origX = x;
    this.y = this.origY = y;
};

var AnimationPoint = function(ctx, x, y){
    this.ctx = ctx;
    this.x = this.origX = x;
    this.y = this.origY = y;

    this.isDraw = false;
};

AnimationPoint.prototype = {
    rad1   : height/2 * .9,
    theta1 : 0,

    rad2   : 100,
    theta2 : 0,

    rad : 3,

    update : function(){
        this.theta1 += .04 * Math.random();
        this.theta2 += Math.random() * .02;

        this.x = this.origX + this.rad2 * Math.cos(this.theta2);
        this.y = this.origY + this.rad1 * Math.sin(this.theta1);

        if(this.isDraw) this.draw();
    },

    draw : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = '#000';
        this.ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
    }
};

var AnimationPoint2 = function(ctx, x, y){
    this.ctx = ctx;
    this.x = this.origX = x;
    this.y = this.origY = y;

    this.isDraw = false;
};

AnimationPoint2.prototype = {
    rad1   : width/2 * .9,
    theta1 : 0,

    rad2   : 200,
    theta2 : 0,

    rad : 3,

    update : function(){
        this.theta1 += .04 * Math.random();
        this.theta2 += Math.random() * .02;

        this.x = this.origX + this.rad1 * Math.cos(this.theta1) ;
        this.y = this.origY + this.rad2 * Math.sin(this.theta2);

        if(this.isDraw) this.draw();
    },

    draw : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = '#000';
        this.ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
    }
};



var Particle = function(ctx, x, y){
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    
    this.vel = new Point(0, 0);
}

Particle.prototype = {
    k   : .95,
    col : '#fff',
    update : function( dt, particleAnimation){
        var acl
        if(!this.isRandom) acl = particleAnimation.getPosition(this.x, this.y);
        else               acl = this.random; 
        this.vel.x += acl.x * dt;
        this.vel.y += acl.y * dt;
        
        this.vel.x *= this.k;
        this.vel.y *= this.k;

        this.x += this.vel.x * dt;
        this.y += this.vel.y * dt;
        
        if(this.x < 0)     this.x = width;
        if(this.x > width) this.x = 0;

        if(this.y < 0)     this.y = height;
        if(this.y > height)this.y = 0;

        var col = parseInt(255 * this.x / width);
        
        this.ctx.beginPath();
        this.ctx.fillStyle = 'hsl(' + col + ', 100%, 70%)';
        this.ctx.arc(this.x, this.y, 1, 0, 2*Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
    },

    randomStart : function(){
        this.isRandom = true;
        this.random = {x : 5000 * (Math.random() - .5), y: 5000 * (Math.random() - .5)};
 
        
    },

    randomStop : function(){
        this.isRandom = false;
    }

};

var Particles = function(ctx){
    _.bindAll(this, 'interval');
    this.ctx = ctx;
    this.arr = [];

    for(var i = 0; i < this.num; i++){
        var particle = new Particle(ctx, width/2, height /2);
        this.arr.push(particle);
    }

    this.interval();
    setInterval(this.interval, 4000);
};

Particles.prototype = {
    num : 100,
    update : function(dt, particleAnimation){
        for(var i = 0; i < this.num; i++){
            this.arr[i].update(dt, particleAnimation);
        }
    },

    interval : function(){
        for(var i = 0; i < this.num; i++){
            this.arr[i].randomStart();
        }
        
        var self = this;
        setTimeout(function(){
            self.randomStop();
        }, 500);
    },

    randomStop : function(){
       for(var i = 0; i < this.num; i++){
            this.arr[i].randomStop();
        }
    }
    
    
};

var ParticleAnimation = function(ctx){
    this.ctx = ctx;

    this.gridWid = width / (this.gridNums - 1);
    this.gridHig = height / (this.gridNums - 1);

    this.range = this.gridWid * 3;

    this.points = [];

    for(var _x = 0; _x < this.gridNums; _x++){
        for(var _y = 0; _y < this.gridNums; _y++){
            var posX, posY, particle;
            posX = this.gridWid * _x + this.gridWid/2; posY = this.gridHig * _y + this.gridHig/2;
            particle = new Point(posX, posY)
            this.points.push(particle);
        }
    }

    this.animationPt = new AnimationPoint(this.ctx, width/2, height/2);
    this.animationPt2 = new AnimationPoint2(this.ctx, width/2, height/2);

};

ParticleAnimation.prototype = {
    gridNums : 11,
    points : [],
    isDraw : false,
    speed : 800,

    update : function(){

        this.animationPt.update();
        this.animationPt2.update();

        for(var i = 0; i < this.points.length; i++){
            var dx, dy, distance;
            var pointX1, pointY1, pointX2, pointY2;
            var pointX, pointY;
            var pt = this.points[i];

            dx = this.animationPt.x - pt.x;
            dy = this.animationPt.y - pt.y;

            distance = Math.sqrt(dx * dx + dy * dy);
            pt.x =  (pt.x - (dx / distance) * (this.range / distance) * this.speed) - ((pt.x - pt.origX) / 2);
            pt.y =  (pt.y - (dy / distance) * (this.range / distance) * this.speed) - ((pt.y - pt.origY) / 2);

        }

        for(var i = 0; i < this.points.length; i++){
            var dx, dy, distance;
            var pointX1, pointY1, pointX2, pointY2;
            var pointX, pointY;
            var pt = this.points[i];

            dx = this.animationPt2.x - pt.x;
            dy = this.animationPt2.y - pt.y;

            distance = Math.sqrt(dx * dx + dy * dy);
            pt.x =  (pt.x - (dx / distance) * (this.range / distance) * this.speed) - ((pt.x - pt.origX) / 2);
            pt.y =  (pt.y - (dy / distance) * (this.range / distance) * this.speed) - ((pt.y - pt.origY) / 2);
        }

 
        if(mousePos){
            for(var i = 0; i < this.points.length; i++){
                var dx, dy, distance;
                var pointX1, pointY1, pointX2, pointY2;
                var pointX, pointY;
                var pt = this.points[i];

                dx = mousePos.x - pt.x;
                dy = mousePos.y - pt.y;

                distance = Math.sqrt(dx * dx + dy * dy);
                pt.x =  (pt.x - (dx / distance) * (this.range / distance) * this.speed * 5) - ((pt.x - pt.origX) / 2);
                pt.y =  (pt.y - (dy / distance) * (this.range / distance) * this.speed * 5) - ((pt.y - pt.origY) / 2);

            }
        }
        // --------------

        if(this.isDraw) this.draw();
    },
    
    getPosition : function(x, y){
        var xPos = parseInt(x / this.gridWid);
        var yPos = parseInt(y / this.gridHig);

       var arrayNum = xPos + yPos * this.gridNums;
       var point = this.points[arrayNum];

       var vector = {x : point.x - point.origX, y: point.y - point.origY};

       return vector;
    },

    draw : function(){
        this.ctx.strokeStyle = 'rgba(0, 0, 0, .1)';
        for(var i = 0; i < this.points.length; i++){
            var pt = this.points[i];
            var dx = (pt.x - pt.origX)/20;
            var dy = (pt.y - pt.origY)/20;
            this.ctx.beginPath();
            this.ctx.moveTo(pt.origX + dx, pt.origY + dy);
            this.ctx.lineTo(pt.origX, pt.origY);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
};

// ---------------------

var delaunay;
var particles;

init();
loop();

function init(){
    delaunay = initTriangle(ctx, width, height, 0, 0);
    particles = new Particles(ctx);

    ctx.fillStyle = 'rgba( 60, 60, 60,.5)';
    ctx.fillRect(0, 0, width, height);

    particleAnimation = new ParticleAnimation(ctx);

    delaunay.addPoints(particles.arr);
    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    var alp = .15 + .1 * Math.cos(curTime * .01);

    ctx.fillStyle = 'rgba( 60, 60, 60,' + alp + ')';
    ctx.fillRect(0, 0, width, height);

    particleAnimation.update();
    particles.update(duration, particleAnimation);
    delaunay.update();
    delaunay.drawTriangle();

    requestAnimationFrame(loop);
}

canvas.addEventListener("mousemove", function (evt) {
    mousePos = {x: evt.clientX, y: evt.clientY};
}, false);


