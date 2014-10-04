// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var app;

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ===============
var Circle = function(x, id){
    this.x = x;
    this.y = height/2 + this.sideRad;

    this.id = id;
    TweenLite.to(this, 1, { y : - this.sideRad , delay: id/3 +.3, ease:"Power2.easeIn"});
};

Circle.prototype = {
    type : "rect1",
    sideRad  : 50,

    update : function(){
        switch (this.type){
            case "rect2":
                this.drawRect2();
                break;
            case "rect1":
                this.drawRect1();
                break;
        }
    },

    drawRect1 : function(){
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    },

    drawRect2 : function(){
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    },

    reset : function(){
        if(this.type == "rect1") {
            this.y = height/2 - this.sideRad*3;
            this.type = "rect2";
            TweenLite.to(this, 1, { y :  height + this.sideRad , delay: this.id/3+.5, ease:"Power2.easeOut"});
        }else{
            this.y = height/2 + this.sideRad;
            this.type = "rect1";
            TweenLite.to(this, 1, { y :  - this.sideRad , delay: this.id/3+.5, ease:"Power2.easeOut"});
        }


    }
};

var Shape = function(x, id){
    //_.bindAll(this, 'tweenOnComplete1');
    this.x = x;
    this.y = height + this.sideRad;

    this.id = id;
    TweenLite.to(this, 1, { y : height/2 - this.sideRad , delay: id/3, ease:"Power2.easeOut"});

};

Shape.prototype = {
    type   : "rect1",
    sideRect : 100,
    sideRad  : 50,

    update : function(){


        switch (this.type){
            case "rect2":
                this.drawRect2();
                break;
            case "rect1":
                this.drawRect1();
                break;
        }
    },

    drawRect2 : function() {
        if(this.y > height / 2 - 3 * this.sideRad){

            var rectHeight = this.y - height/2 + this.sideRad * 3 ;

            var rectWidth, theta;
            var circleHeight, circleWidth;


            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.fillStyle = "#000";
            ctx.fillRect(this.x - this.sideRad, this.y + this.sideRad - rectHeight, this.sideRect, rectHeight);
            ctx.restore();

        }else{
            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sideRad, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }

    },
    drawRect1 : function(){


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

    reset : function(){

        if(this.type == "rect1") {
            this.y = -this.sideRad;
            this.type = "rect2";
        }else{
            this.y = height + this.sideRad;
            this.type = "rect1";
        }

        TweenLite.to(this, 1, { y : height/2 - this.sideRad , delay: this.id/3, ease:"Power2.easeOut"});
    }


};

var Floor = function(){
    this.y = height/2;
    this.height = height/2;
};

Floor.prototype = {
    count : 0,
    update : function(){
        ctx.fillStyle = "#fff";

        ctx.save();
        ctx.fillRect(0, this.y, width, this.height);
        ctx.restore();
    },

    reset : function(){
        this.count++;

        if(this.count % 2 == 0) { this.y = height/2; this.height = height/2;}
        else                    { this.y = height/2 - 100; this.height = height/2 + 100;}
    }
};

// ----------------

var App = function(){
    _.bindAll(this, 'interval');
    this.shapeArrs = [];
    this.circleArrs = [];

    this.Floor = new Floor();
    //this.shape1 = new Shape1();

    var shape = new Shape(width/2, 0);
    this.shapeArrs.push(shape);

    var circle = new Circle(width/2, 0);
    this.circleArrs.push(circle);
    for(var i = 0; i < Math.round(width / 2 / 100); i++){
        var shape01 = new Shape(width/2 - 100 * (i + 1), i+1);
        var shape02 = new Shape(width/2 + 100 * (i + 1), i+1);

        this.shapeArrs.push(shape01);
        this.shapeArrs.push(shape02);

        // =================

        var circle01 = new Circle(width/2 - 100 * (i + 1), i+1);
        var circle02 = new Circle(width/2 + 100 * (i + 1), i+1);

        this.circleArrs.push(circle01);
        this.circleArrs.push(circle02);
    }

    this.intervalDuration = (2 +.3 *Math.round(width / 2 / 100))*1000;
    setTimeout(this.interval,  this.intervalDuration);
};

App.prototype = {
    update : function(){
        this.Floor.update();


        this.circleArrs.forEach(function(element){
            element.update();
        });

        this.shapeArrs.forEach(function(element){
            element.update();
        });
    },

    interval : function(){

        this.Floor.reset();

        this.shapeArrs.forEach(function(element){
            element.reset();
        });

        this.circleArrs.forEach(function(element){
            element.reset();
        });

        setTimeout(this.interval,  this.intervalDuration);
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