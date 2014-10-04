// --------------------------

var width, height, prevTime;
var halfWidth;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width     = window.innerWidth;
height    = window.innerHeight;
halfWidth = width/2;

canvas.width  = width;
canvas.height = height;

var MAX_THETA;

var colorArr = ['#16a085', '#27ae60', '#2980b9', '#f39c12', '#c0392b', '#2ecc71', '#d35400', '#8e44ad']

// ================
var Floor = function(id, col, y, height){
    _.bindAll(this, 'onRotate2', 'onRotate3', 'onMove', 'onInit', 'init');

    this.id  = id;
    this.col = col;
    this.y = y;
    this.MAX_THETA = Math.atan2(height / 3, width / 2);
    MAX_THETA = this.MAX_THETA;
    this.theta = 0;

    this.init();
};

Floor.prototype = {
    count : 7,
    init   : function(){

        this.rotate();
    },

    rotate : function(){
        TweenLite.to(this, .5, {theta : this.MAX_THETA, delay: 1, ease: "Power2.easeOut", onComplete: this.onRotate2})
    },

    onRotate2 : function(){
        TweenLite.to(this, .5, {theta : -this.MAX_THETA, delay: 1, ease: "Power2.easeOut", onComplete: this.onRotate3})
    },

    onRotate3 : function(){
        TweenLite.to(this, .5, {theta : 0, delay:1, ease: "Power2.easeOut", onComplete: this.onMove})
    },

    onMove : function(){
        var yPos = this.y - floorHeight;
        TweenLite.to(this, .5, { y : yPos, delay:.5, ease: "Power2.easeOut", onComplete: this.onInit})
    },

    onInit : function(){
        if(this.id == this.count) this.y += 8 * floorHeight;

        this.count = (this.count - 1) ;
        if(this.count < 0) this.count += 8;
            setTimeout(this.init, 500);
    },

    update : function(){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.col;
        ctx.moveTo(0, this.y2 + this.y - floorHeight);
        ctx.lineTo(width, this.y1 + this.y - floorHeight);
        ctx.lineTo(width, this.y1 + this.y);
        ctx.lineTo(0, this.y2 + this.y);
        ctx.lineTo(0, this.y1 + this.y - floorHeight);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

    }

};

Object.defineProperty(Floor.prototype, 'theta', {
    get : function(){
        return this._theta;
    },

    set : function(value){
        this._theta = value;

        this.y1 =  halfWidth * Math.tan(this.theta);
        this.y2 = -halfWidth * Math.tan(this.theta);

    }
});

// ----------------

var Circle = function(id, x, y){
    _.bindAll(this, "onUp", "onMove1", "onUp1", "onMove2", "onMove3", "onInit");

    this.id = id;
    this.x = x;
    this.y = 0;
    this.r = 15;
    this.centerY = y - this.r;
    this.col = colorArr[this.id];
    this.init();
};

Circle.prototype = {
    count : 0,
    _xx : 0,

    init : function(){

        this.theta = MAX_THETA;
        TweenLite.to(this,.5, {xx : halfWidth - this.r, delay: 1.3, ease: "Bounce.easeOut", onComplete: this.onUp});
    },

    onUp : function(){
        TweenLite.to(this,.5, {theta : -MAX_THETA, delay: .7, ease: "Power2.easeOut", onComplete: this.onMove1});
    },

    onMove1 : function(){
        TweenLite.to(this,.5, {xx : this.r - halfWidth, ease: "Bounce.easeOut", onComplete: this.onUp1});
    },

    onUp1 : function(){
        TweenLite.to(this,.5, {theta : 0,  delay: .5, ease: "Power2.easeOut", onComplete: this.onMove2});
    },

    onMove2 : function() {
        TweenLite.to(this, .5, {xx: 0,  ease: "Power2.easeOut", onComplete: this.onMove3});
    },

    onMove3 : function(){
        var nextY = this.centerY + floorHeight;
        TweenLite.to(this,1, {centerY : nextY, ease: "Bounce.easeOut", onComplete: this.onInit});
    },

    onInit : function(){
        if(this.id == this.count) this.centerY -= 8 * floorHeight;

        this.count = (this.count + 1) % 8 ;
        this.init()
    },

    update : function(){
        ctx.beginPath();
        ctx.fillStyle = this.col;
        ctx.arc(this.x, this.y + this.centerY, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
};

Object.defineProperty(Circle.prototype, 'xx', {
    get : function(){
        return this._xx;
    },
    set : function(value){
        this.x = width/2 + value;
        this.y = value * Math.tan(this.theta);

        this._xx = value;
    }
});


Object.defineProperty(Circle.prototype, 'theta', {
    get : function(){
        return this._theta;
    },
    set : function(value){
        this.y = (this.x - width/2) * Math.tan(value);

        this._theta = value;
    }
});


// ================

var floorHeight;
var floorNumber = 8;
var floorArr = [];
var circleArr = [];

init();
loop();

function init(){
    floorHeight = height / 4;

    var col, yPos;
    for(var i = 0;i  < floorNumber; i++) {
        if (i % 2 == 0) col = "#ecf0f1";
        else           col = "#34495e";

        yPos = floorHeight * (5.5 - i);

        var floor = new Floor(i, col, yPos, floorHeight);
        floorArr.push(floor);

        var circle = new Circle(i, width/2, yPos);
        circleArr.push(circle)
    }

}

function loop(){
    ctx.clearRect(0, 0, width, height)

    // updating and drawing the floor.
    floorArr.forEach(function(element){element.update();});
    circleArr.forEach(function(element){element.update();});

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
