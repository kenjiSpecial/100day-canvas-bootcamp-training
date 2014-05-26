
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;



// --------------------------
var Pt = function(theta){
    this.rad   = side;
    this.theta = theta;
};

Pt.prototype = {
    setTheta : function(val){
        this.futureTheta = val;
        TweenLite.to(this,.5, { theta : val, ease: Power3.easeInOut});
    }
}


Object.defineProperty(Pt.prototype, 'theta', {
    get : function(){
        return this._theta;
    },

    set : function(val){
        this._theta = val;
        this.x = this.rad * Math.cos(this._theta);
        this.y = this.rad * Math.sin(this._theta);
    }
});




var Shape = function(ctx, x, y){
    _.bindAll(this, 'add');

    this.x = x;
    this.y = y;
    this.ctx = ctx;

    this.col = '#fff';

    this.triArr = [];

    this.shapeType = {
        3 : [[0, 1, 2]],
        4 : [[0, 1, 2], [3, 1, 2]]
    };

    for(var i = 0; i < this.triNum; i++){
        var pt = new Pt( i / this.triNum * 2 * Math.PI );
        this.triArr.push(pt);
    }

    setInterval(this.add, 600);
};


Shape.prototype = {
    triNum : 2,
    inc : 1,
    theta : 0,
    add : function(){
        // clone pt
        if(this.triArr.length > 12) this.inc = -1;
        if(this.triArr.length < 3)  this.inc = 1;


        if(this.inc == 1){
            var clonedPt = new Pt(this.triArr[this.triArr.length - 1].theta);
            this.triArr.push(clonedPt);

            for(var i in this.triArr){
                this.triArr[i].setTheta(2 * Math.PI * i / this.triArr.length);
            }
        }else{
            for(var i in this.triArr){
                this.triArr[i].setTheta(2 * Math.PI * i / (this.triArr.length -1));
            }
            var self = this;
            setTimeout(function(){
                self.triArr.shift();
            }, 400 );
        }

        var val = this.theta + 1/3 * Math.PI;
        TweenLite.to(this,.3, { theta : val});


    },

    update : function(){
        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.theta);

        this.ctx.strokeStyle = this.col;


        for(var i in this.triArr){
            var pt1 = this.triArr[i]
            for(var j = i; j < this.triArr.length; j++){
                var pt2 = this.triArr[j];

                this.ctx.beginPath();
                this.ctx.moveTo(pt1.x, pt1.y);
                this.ctx.lineTo(pt2.x, pt2.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }




        this.ctx.restore();

    }
};


// --------------------------


var width, height, previousTime;
var side1, side2;
var shape;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var side;

width = window.innerWidth;
height = window.innerHeight;

side = Math.min(width, height) * .45;

canvas.width  = width;
canvas.height = height;


init();
loop();

function init(){
    shape = new Shape(ctx, width/2, height/2);
}

function loop(){
    //ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    shape.update();

    requestAnimationFrame(loop);
}