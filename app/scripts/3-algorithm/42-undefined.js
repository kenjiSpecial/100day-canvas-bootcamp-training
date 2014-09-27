// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var app;

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var Shape1 = function(){
    _.bindAll(this, "tweenOnComplete1", "tweenOnComplete2");
    this.x = -this.sideRad;
    this.y = height/2 - this.sideRad;

    TweenLite.to(this, 1, { x : width/2, onComplete : this.tweenOnComplete1, ease:"Power2.easeOut", delay:.2 });
};

Shape1.prototype = {
    type : "circle1",
    sideRad : 50,
    rect    : 100,

    update : function(){
        switch (this.type){
            case "circle1":
                this.circle1Update();
                break;
            case "circle2":
                this.circle2Update();
                break;
        }
    },

    circle1Update : function(){
        if(this.x > width/2 - this.sideRad * 2){
            var side = this.x - (width/2 - this.sideRad * 2);
            if(side > 0){
                side = this.sideRad - side;
            }else{
                side *= -1;
            }
            var rectHeight = Math.sqrt(this.sideRad * this.sideRad - side * side);
            var theta = Math.atan2( rectHeight, side);

            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.moveTo(this.x + this.sideRad * Math.cos( - theta), this.y + this.sideRad * Math.sin( - theta));
            ctx.arc(this.x, this.y, this.sideRad, -theta, theta, false);
            ctx.lineTo(this.x + this.sideRad * Math.cos(theta), this.y + this.sideRad * Math.sin( theta));
            ctx.closePath();
            ctx.fill();
            ctx.restore();

        }else{
            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
   },

    circle2Update : function(){

        if(this.y <  window.innerHeight/2 + this.sideRad){


            var startY = window.innerHeight/2 - this.sideRad * 2;
            var height = (this.y - this.sideRad) - startY;
            //console.log(height)

            ctx.save();
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.fillRect(width/2 - this.sideRad - 1, startY, this.rect + 2, height);
            ctx.closePath();
        }else{

            var startY = window.innerHeight/2 - this.sideRad * 2;
            ctx.save();
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.fillRect(width/2 - this.sideRad - 1, startY, this.rect + 2, this.sideRad * 2);
            ctx.closePath();
        }
        //console.log(this.y);

        ctx.save();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    tweenOnComplete1 : function(){
        this.type = "circle2";
        TweenLite.to(this, 1, { y : height + this.sideRad, ease:"Power2.easeIn",onComplete : this.tweenOnComplete2 });
    },
    tweenOnComplete2 : function(){
        this.type = "circle1";
        this.x = -this.sideRad;
        this.y = height/2 - this.sideRad;

        TweenLite.to(this, 1, { x : width/2, onComplete : this.tweenOnComplete1, ease:"Power2.easeOut", delay:.5 });
    }
};

// ---------------

var Shape = function(){
    _.bindAll(this, 'tweenOnComplete1');
    this.x = width/2;
    this.y = height + this.sideRad;

    TweenLite.to(this, 1, { y : height/2 - this.sideRad ,  onComplete : this.tweenOnComplete1 , ease:"Power2.easeOut"});
};

Shape.prototype = {
    type   : "rect",
    sideRect : 100,
    sideRad  : 50,

    update : function(){


        switch (this.type){
            case "circle":
                this.drawCircle();
                break;
            case "rect":
                this.drawRect();
                break;
        }
    },

    drawRect : function(){


        if(this.y < height / 2 + this.sideRad){

            var rectHeight = height/2 + this.sideRad - this.y;
            var rectWidth, theta;
            var circleHeight, circleWidth;


            ctx.save();
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.fillRect(this.x - this.sideRad, this.y - this.sideRad, this.sideRect, rectHeight);
            ctx.restore();

        }else{
            ctx.save();
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }


    },

    drawCircle : function(){

    },
    tweenOnComplete1 : function(){
        var self = this;
        setTimeout(function(){
            self.y = height + self.sideRad;
            TweenLite.to(self, 1, { y : height/2 - self.sideRad ,  onComplete : self.tweenOnComplete1 , ease:"Power2.easeOut", delay:.5});
        }, 1000);
    },

};

var Floor = function(){
    this.y = height/2;
    this.height = height/2;
};

Floor.prototype = {
    update : function(){
        ctx.fillStyle = "#fff";

        ctx.save();
        ctx.fillRect(0, this.y, width, this.height);
        ctx.restore();
    }
};

// ----------------

var App = function(){
    this.Floor = new Floor();
    this.shape = new Shape();
    this.shape1 = new Shape1();
};

App.prototype = {
    update : function(){
        this.Floor.update();
        this.shape.update();
        this.shape1.update();
    }
};


// ================

init();
loop();

function init(){
    app = new App();

    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    app.update();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;