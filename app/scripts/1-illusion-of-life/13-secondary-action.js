
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;



// --------------------------
var Pt = function(rad, theta){

    this.rad   = rad;
    this.theta = theta;
};

Pt.prototype = {
    setTheta : function(val){
        this.futureTheta = val;
        TweenLite.to(this,.5, { theta : val, ease: Elastic.easeInOut});
    },
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




var Rect = function(ctx, x, y){
    _.bindAll(this, 'rotationComplete');

    this.x = this.originX = x;
    this.y = y;
    //console.log(this.x, this.y);
    this.transX = 0;
    this.side = 60;
    this.halfSide = this.side / 2 * -1;
    this.ctx = ctx;

    this.col = '#fff';

    this.rotate = 0;
    this.thetaArr = [0, Math.PI, Math.PI * 5 / 4, Math.PI * 3 / 2];
    this.ptArr =[
        new Pt(0, 0),
        new Pt(this.side, Math.PI),
        new Pt(this.side * Math.sqrt(2), Math.PI * (5/4)),
        new Pt(this.side, Math.PI * (3/2)),
    ];

    this.rotation();
};

Rect.prototype = {
    rotation : function(){
        this.rotate =  Math.PI/2;
        for(var i = 0; i < this.ptArr.length; i++){
            var pt = this.ptArr[i];
            var theta = this.thetaArr[i];
            TweenLite.to(pt, 1, { theta : (theta + this.rotate)});
        }

        TweenLite.to(this, 1, { x : (this.originX - 60), onComplete : this.rotationComplete});
    },

    rotationComplete : function(){
        this.ptArr =[
            new Pt(0, 0),
            new Pt(this.side, Math.PI),
            new Pt(this.side * Math.sqrt(2), Math.PI * (5/4)),
            new Pt(this.side, Math.PI * (3/2)),
        ];

        this.x = this.originX;
        this.rotation();
    },

    update : function(){
        this.ctx.save();
        this.ctx.translate(this.x + this.side /2, this.y + this.side /2);

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.col;

        this.ctx.moveTo(this.ptArr[0].x, this.ptArr[0].y);

        for(var i = 0; i < this.ptArr.length; i++ ){
            var number = (i + 1) % this.ptArr.length;
            this.ctx.lineTo(this.ptArr[number].x, this.ptArr[number].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.restore();
    }
};

var RectTop1 = function(ctx, x, y, rect){
    _.bindAll(this, 'rotationComplete');

    this.x = this.originX = x;
    this.y = y;

    this.side = 60;
    this.baseRect = rect;
    this.ctx = ctx;

    this.col = '#fff';

    this.rotate = 0;
    this.thetaArr = [0, Math.PI * 3 / 2, Math.PI * 7 / 4, Math.PI * 2];
    this.ptArr =[
        new Pt(0, 0),
        new Pt(this.side, Math.PI* (3/2)),
        new Pt(this.side * Math.sqrt(2), Math.PI * (7/4)),
        new Pt(this.side, Math.PI * 2),
    ];

    this.rotation();
};

RectTop1.prototype = {
    rotation : function(){
        this.rotate =  -Math.PI/2;
        for(var i = 0; i < this.ptArr.length; i++){
            var pt = this.ptArr[i];
            var theta = this.thetaArr[i];
            TweenLite.to(pt, 1, { theta : (theta + this.rotate)});
        }

        TweenLite.to(this, 1, { x : (this.originX ), onComplete : this.rotationComplete});
    },
    rotationComplete : function(){
        this.ptArr =[
            new Pt(0, 0),
            new Pt(this.side, Math.PI* (3/2)),
            new Pt(this.side * Math.sqrt(2), Math.PI * (7/4)),
            new Pt(this.side, Math.PI * 2),
        ];

        this.x = this.originX;
        this.rotation();
    },
    update : function(){
        this.ctx.save();
        //this.ctx.translate(this.x + this.baseRect.ptArr[2].x - this.side/2, this.y + this.baseRect.ptArr[2].y + this.side/2);
        this.x = this.baseRect.x + this.baseRect.ptArr[2].x + this.side / 2;
        this.y = this.baseRect.y + this.baseRect.ptArr[2].y + this.side/2;
        this.ctx.translate( this.x, this.y);

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.col;

        this.ctx.moveTo(this.ptArr[0].x, this.ptArr[0].y);

        for(var i = 0; i < this.ptArr.length; i++ ){
            var number = (i + 1) % this.ptArr.length;
            this.ctx.lineTo(this.ptArr[number].x, this.ptArr[number].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.restore();
    }
};

var RectTop2 = function(ctx, x, y, rect){
    _.bindAll(this, 'rotationComplete');

    this.x = this.originX = x;
    this.y = y;

    this.side = 60;
    this.baseRect = rect;
    this.ctx = ctx;

    this.col = '#fff';

    this.rotate = 0;
    this.thetaArr = [0, Math.PI, Math.PI * 5 / 4, Math.PI * 3 / 2];
    this.ptArr =[
        new Pt(0, 0),
        new Pt(this.side, Math.PI),
        new Pt(this.side * Math.sqrt(2), Math.PI * (5/4)),
        new Pt(this.side, Math.PI * (3/2)),
    ];

    this.rotation();
};

RectTop2.prototype = {
    rotation : function(){
        this.rotate =  Math.PI/2;
        for(var i = 0; i < this.ptArr.length; i++){
            var pt = this.ptArr[i];
            var theta = this.thetaArr[i];
            TweenLite.to(pt, 1, { theta : (theta + this.rotate)});
        }

        TweenLite.to(this, 1, { x : (this.originX ), onComplete : this.rotationComplete});
    },
    rotationComplete : function(){
        this.ptArr =[
            new Pt(0, 0),
            new Pt(this.side, Math.PI),
            new Pt(this.side * Math.sqrt(2), Math.PI * (5/4)),
            new Pt(this.side, Math.PI * (3/2)),
        ];

        this.x = this.originX;
        this.rotation();
    },
    update : function(){
        this.ctx.save();
        this.x = this.baseRect.x + this.baseRect.ptArr[2].x;
        this.y = this.baseRect.y + this.baseRect.ptArr[2].y;
        this.ctx.translate( this.x, this.y );

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.col;

        this.ctx.moveTo(this.ptArr[0].x, this.ptArr[0].y);

        for(var i = 0; i < this.ptArr.length; i++ ){
            var number = (i + 1) % this.ptArr.length;
            this.ctx.lineTo(this.ptArr[number].x, this.ptArr[number].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.restore();
    }
};





var Road = function(ctx, x, y){
    var line;
    var lineWidth = 20;
    var lineWidthMargin = 10;

    this.ctx = ctx;

    this.width = window.innerWidth;

    this.x = x;
    this.y = y;

    this.lineArr = [];

    this.mask = {x: - this.num /2 * (lineWidth + lineWidthMargin), width: this.num * (lineWidth + lineWidthMargin)}

    for(var i = 0; i <= this.num; i++){
        line = new Line(this.ctx, (lineWidth + lineWidthMargin) * (i - this.num/2), 0, lineWidth, {minX: this.mask.x, maxX: this.mask.x + this.mask.width})
        this.lineArr.push(line);
    }
};

Road.prototype = {
    num : 20,
    lineArr : null,
    update : function(){
        this.ctx.save();

        this.ctx.translate(this.x, this.y);

        for(var i = 0; i < this.lineArr.length; i++){
            this.lineArr[i].update();
        }

        var grd = this.ctx.createLinearGradient(this.mask.x * 2, 0, this.mask.width, 0);


        grd.addColorStop(0.25, 'rgba(51, 51, 51, 1)');
        grd.addColorStop(0.3, 'rgba(51, 51, 51, 0)');
        grd.addColorStop(0.5, 'rgba(51, 51, 51, 0)');
        grd.addColorStop(0.7, 'rgba(51, 51, 51, 0)');
        grd.addColorStop(0.75, 'rgba(51, 51, 51, 1)');

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(-this.x, -15, this.width, 30);

        this.ctx.restore();
    }
};

var Line = function(ctx, x, y, width, range){
    this.x = x;
    this.range = range;

    this.ctx = ctx;
    this.col = '#fff';
    this.width = width;
    this.prevTime = + new Date;
};

Line.prototype = {
    update : function(){

        this.x -= 1;
        if(this.x < this.range.minX) this.x = this.range.maxX;

        this.ctx.strokeStyle = this.col;
        this.ctx.beginPath();

        this.ctx.moveTo(this.x - this.width / 2, 0);
        this.ctx.lineTo(this.x + this.width / 2, 0);
        this.ctx.stroke();

        this.ctx.closePath();

    }
};




// --------------------------

var width, height, previousTime;
var side1, side2;
var rect, rectTop1, rectTop2, side, road;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');


width = window.innerWidth;
height = window.innerHeight;

side = Math.min(width, height) / 8;


canvas.width  = width;
canvas.height = height;


init();
loop();

function init(){
    rect = new Rect(ctx, width / 2, height *.9);
    rectTop1 = new RectTop1(ctx, width/2, height*.9, rect);
    rectTop2 = new RectTop2(ctx, width/2, height*.9, rectTop1);

    road = new Road(ctx, width/2, height *.9 + 30 + 2);
}

function loop(){
    //ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    rect.update();
    rectTop1.update();
    rectTop2.update();
    road.update();

    requestAnimationFrame(loop);
}
