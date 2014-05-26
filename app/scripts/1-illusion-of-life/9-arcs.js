function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var Rect = function( i, ctx, x, y, prevWid, wid, hig ){
    _.bindAll(this, 'tweenOnUpdate1', 'tweenOnUpdate2', 'tweenOnComplete1');

    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.wid = (wid-prevWid);
    this.hig = hig;

    this.vel = 100;
    this.arcRate = 0;

    this.oriRad1 = this.rad1 = prevWid + 10*scaleFactor;
    this.oriRad2 = this.rad2 = this.rad1 + this.wid;


    this.theta3 = Math.atan2( this.hig, this.rad2);
    this.theta4 = Math.atan2( this.hig, this.rad1);
    //console.log(this.theta4)

    this.animTheta0 = 0;
    this.animTheta1 = 0;
    this.animTheta3 = 0;
    this.animTheta4 = 0;

    this.theta00 = 0;
    this.theta11 = 0;

    this.oriRad3 = this.rad3 = 1/Math.cos(this.theta3) * (this.rad2);
    this.oriRad4 = this.rad4 = 1/Math.cos(this.theta4) * (this.rad1);



    this.isReverse = false;
    this.isArcAnimation = false;

    this.id = i;
    //var col = parseInt(255 * i / (number - 1));
    var col = 255;
    this.col = 'rgb(' + col + ', ' + col + ', ' + col + ')';
    this.delay =  .3 * (number - i) / (number - 1);
};

var co = Math.cos;
var si = Math.sin;

Rect.prototype = {
    duration1 :.5,
    duration2 : .4,
    isArcAnimation : null,

    draw : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.col;
        this.ctx.save();

        this.ctx.translate(this.x, this.y);

            this.ctx.moveTo(this.rad1 * co( this.theta00 + this.animTheta0 ), -this.rad1 * si( this.theta00 + this.animTheta0) );
            this.ctx.lineTo(this.rad2 * co( this.theta11 + this.animTheta1 ), -this.rad2 * si( this.theta11 + this.animTheta1) );
            this.ctx.lineTo(this.rad3 * co( this.theta3  + this.animTheta3 + this.theta11), -this.rad3 * si(this.theta3 + this.animTheta3 + this.theta11) );
            this.ctx.lineTo(this.rad4 * co( this.theta4  + this.animTheta4 + this.theta00), -this.rad4 * si(this.theta4 + this.animTheta4 + this.theta00) );


            this.ctx.fill();


        this.ctx.restore();
    },

    startArcAnimation : function(){
        var self = this;
        setTimeout(function(){
            self.isArcAnimation = true;
            self.arcRate1 = 0;
            self.arcRate2 = 0;

            self.originaLRate1 = 0;
            self.originaLRate2 = 0;

            TweenLite.to(self, self.duration1 +.03 * self.id, { arcRate1 : self.arcRate1 +1, onUpdate: self.tweenOnUpdate1, ease: Power3.easeOut});
            TweenLite.to(self, self.duration2 +.03 * self.id, { arcRate2 : self.arcRate1 +1, onUpdate: self.tweenOnUpdate2, onComplete: self.tweenOnComplete1});
        }, 300);

    },

    tweenOnUpdate1 : function(){
        //this.theta1 = this.arcRate1 * (Math.PI - this.theta11) * -1 + 2 * Math.PI - this.theta;

        this.animTheta3 =  this.arcRate1 *Math.PI ;
        this.animTheta4 =  this.arcRate1 *Math.PI ;

        //this.rad4 = this.oriRad4 * (1-this.arcRate1 + this.originaLRate1) + this.oriRad1 * (this.arcRate1 -  this.originaLRate1);
        //this.rad3 = this.oriRad3 * (1-this.arcRate1 + this.originaLRate1) + this.oriRad2 * (this.arcRate1 -  this.originaLRate1)
    },

    tweenOnUpdate2 : function(){
        //this.theta2 = this.arcRate2 * (Math.PI - this.theta) * -1 + 2 * Math.PI ;
        this.animTheta0 =  this.arcRate2 *Math.PI ;
        this.animTheta1 =  this.arcRate2 *Math.PI ;

        //this.rad1 = this.oriRad1 * (1-this.arcRate2 + this.originaLRate2) + this.oriRad4 * (this.arcRate2 - this.originaLRate2);
        //this.rad2 = this.oriRad2 * (1-this.arcRate2 + this.originaLRate2) + this.oriRad3 * (this.arcRate2 - this.originaLRate2);
    },

    tweenOnComplete1 : function(){
        this.originaLRate1 = this.arcRate1;
        this.originaLRate2 = this.arcRate2;

        TweenLite.to(this, this.duration1 +.03 * this.id, { arcRate1 : this.arcRate1 + 1, onUpdate: this.tweenOnUpdate1, ease: Power3.easeOut, delay: this.delay});
        TweenLite.to(this, this.duration2 +.03 * this.id, { arcRate2 : this.arcRate2 + 1, onUpdate: this.tweenOnUpdate2, onComplete: this.tweenOnComplete1, delay: this.delay});
    },

    test : function(){

    }
};


var width, height, previousTime;
var side1, side2;
var side1Wid, side1Hig;
var rect;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);
var arcs = [];

width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

side1 = 100;
side2 = 180;

//side1Wid = 100;
var number = 30;
var sideHig = 10 * scaleFactor;


var duration1 = .8;
var duration2 = .6;

canvas.width  = width;
canvas.height = height;


init();
loop();

function init(){
    var prevRad = 10*scaleFactor;
    for(var i = 0; i < number; i++){
        var rad = (i + 1)  / number * (width/3 - 10 * scaleFactor) + 10 * scaleFactor;
        rect = new Rect(i, ctx, width/2, height/2, prevRad, rad, sideHig);
        rect.startArcAnimation();
        arcs.push(rect);
        prevRad = rad;
    }


}

function loop(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    for(var i = number; i > 0; i--){
        arcs[i-1].draw()
    }

    requestAnimationFrame(loop);
}