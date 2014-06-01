


// --------------------------
var Pt = function(x, y){
    this.x = x;
    this.y = y;
};

var Line = function(ctx, pt1, pt2, pt3, pt4, i){
    _.bindAll(this, 'changeAnimation1', 'changeAnimation1Complete', 'changeAnimation2', 'changeAnimation2Complete');

    this.curPt1 = new Pt(pt1.x, pt1.y);
    this.curPt2 = new Pt(pt2.x, pt2.y);

    this.col = 'rgba(255, 255, 255, .3)';
    this.ctx = ctx;

    this.pt1 = pt1;
    this.pt2 = pt2;

    this.pt3 = pt3;
    this.pt4 = pt4;

    //this.duration = i/ 20 * .3 + .2;
    this.duration = .5;
    this.wait     = (.8 - this.duration) * 1000;

    setTimeout(this.changeAnimation1, 500);
};

Line.prototype = {
    changeAnimation1 : function(){
        TweenLite.to(this.curPt1, this.duration, { x : (this.pt3.x ), onComplete : this.changeAnimation1Complete, ease: Power3.easeInOut});
        TweenLite.to(this.curPt2, this.duration, { y : (this.pt4.y ), ease: Power3.easeInOut});
    },

    changeAnimation1Complete : function(){
        setTimeout(this.changeAnimation2, this.wait);
    },

    changeAnimation2 : function(){
        TweenLite.to(this.curPt1, this.duration, { x : (this.pt1.x ), onComplete : this.changeAnimation2Complete, ease: Power3.easeInOut});
        TweenLite.to(this.curPt2, this.duration, { y : (this.pt2.y ), ease: Power3.easeInOut});
    },

    changeAnimation2Complete : function(){
        setTimeout(this.changeAnimation1, this.wait);
    },

    update : function(){
        this.ctx.strokeStyle = this.col;

        this.ctx.beginPath();
        this.ctx.moveTo(this.curPt1.x, this.curPt1.y);
        this.ctx.lineTo(this.curPt2.x, this.curPt2.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
};

var side = 100;

var RightRect = function(ctx, x, y){
    var ptX, ptY, pt1, pt2, pt3, pt4 ,line, i;

    this.ctx = ctx;
    this.x   = x;
    this.y   = y;

    this.lineArr = [];

    for(var j = 0; i < 4; i++){

    }

    // ---------

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( 0, -side);
        pt2  = new Pt( side, -side);
        pt3  = new Pt( ptX, -side);
        pt4  = new Pt( 0, ptY -side);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( side, -side);
        pt2  = new Pt( side, side-side);
        pt3  = new Pt( ptX, -side);
        pt4  = new Pt( 0, ptY-side);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }

    // ---------

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( 0, side);
        pt2  = new Pt( side, side);
        pt3  = new Pt( ptX, side);
        pt4  = new Pt( 0, -ptY + side);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( side, side);
        pt2  = new Pt( side, 0);
        pt3  = new Pt( side - ptX, side);
        pt4  = new Pt( side, ptY);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }

    // ---------

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side * -1;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( 0, -side);
        pt2  = new Pt( -side, -side);
        pt3  = new Pt( ptX, -side);
        pt4  = new Pt( 0, ptY -side);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side * -1;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( -side, -side);
        pt2  = new Pt( -side, side-side);
        pt3  = new Pt( ptX, -side);
        pt4  = new Pt( 0, ptY-side);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }

    // ----------

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side * -1;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( 0, side);
        pt2  = new Pt( -side, side);
        pt3  = new Pt( ptX, side);
        pt4  = new Pt( 0, -ptY + side);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }

    for(var i = 0; i < this.num; i++){
        ptX  = (i) / (this.num-1) * side;
        ptY  = (i) / (this.num-1) * side;
        pt1  = new Pt( -side, side);
        pt2  = new Pt( -side, 0);
        pt3  = new Pt( ptX - side, side);
        pt4  = new Pt( 0, ptY);
        line = new Line(this.ctx, pt1, pt2, pt3, pt4, i);

        this.lineArr.push(line);
    }


};

RightRect.prototype = {
    num    : 20,
    update : function(){
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        for(var i = 0; i < this.lineArr.length; i++){
            var line = this.lineArr[i];
            line.update();
        }

        this.ctx.restore();
    }
};



// --------------------------


var width, height, previousTime;
var side1, side2;
var rightRect;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;


canvas.width  = width;
canvas.height = height;


init();
loop();

function init(){
    rightRect = new RightRect( ctx, width/2, height/2 );
}

function loop(){
    //ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    rightRect.update();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;