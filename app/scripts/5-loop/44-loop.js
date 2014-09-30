// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var App = function(){
    this.transX = width/2;
    this.transY = height/2;

    //this.shape = new Shape(0, 0);

    this.widthNum  = parseInt(width / 50) + 1;
    this.heightNum = parseInt(height / 50) + 1;

    this.shapes = [];

    for(var yy = 0; yy < this.heightNum; yy++){
        for(var xx = 0; xx < this.widthNum; xx++){
            var xPos = xx* 50 - width/2;
            var yPos = yy * 50 - height/2;

            var duration = Math.abs(xx - this.widthNum/2 + yy - this.heightNum/2);

            var shape = new Shape(xPos, yPos, duration);
            this.shapes.push(shape);
        }
    }
};

App.prototype = {
    update : function(){
        this.shapes.forEach(function(element){
            element.update();
        });

        this.draw();
    },

    draw : function(){

        ctx.save();
        ctx.translate(this.transX, this.transY);
        this.shapes.forEach(function(element){
            element.draw();
        });
        ctx.restore();
    }
};

var Shape = function(x, y, duration){
    _.bindAll(this, "onChangeStateHandler");
    this.count = 0;

    this.x = x;
    this.y = y;
    this.side = 50;

    this.startX = this.x + this.side/2;
    this.startY = this.y - this.side/2;

    this.endX   = this.x + this.side/2;
    this.endY   = this.y + this.side/2;

    var dur = duration * 20 + 300;
    setTimeout(this.onChangeStateHandler, dur);
};

Shape.prototype = {
    update : function(){

    },

    draw : function(){

        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.moveTo( this.startX, this.startY);
        ctx.lineTo( this.endX, this.endY );
        ctx.stroke();
        ctx.closePath();

    },

    onChangeStateHandler : function(){
        switch (this.count){
            case 0:
                TweenLite.to(this,.6, { startX : this.x - this.side/2, ease:"Power2.easeOut"});
                TweenLite.to(this,.6, { endY   : this.y - this.side/2, ease:"Power2.easeOut"});
                break;
            case 1:
                TweenLite.to(this, .6, { startY : this.y + this.side/2, ease: "Power2.easeOut"});
                TweenLite.to(this,.6, { endX : this.x - this.side/2, ease: "Power2.easeOut" });
                break;
            case 2:
                TweenLite.to(this, .6, { startX : this.x + this.side/2, ease: "Power2.easeOut"});
                TweenLite.to(this, .6, { endY : this.y + this.side/2, ease: "Power2.easeOut" });
                break;
            case 3:
                TweenLite.to(this, .6, { startY : this.y - this.side/2, ease: "Power2.easeOut"});
                TweenLite.to(this, .6, { endX : this.x + this.side/2, ease: "Power2.easeOut" });
                break;

        }

        this.count = (this.count + 1) % 4;
        setTimeout(this.onChangeStateHandler, 800);
    }
};

// ================
var app;

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

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    app.update();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;