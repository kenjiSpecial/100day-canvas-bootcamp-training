
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;



// --------------------------
var Boid = function(ctx){
    this.ctx = ctx;

    this.x   = 10 * Math.random() - 5;
    this.y   = 10 * Math.random() - 5;

    this.vx  = 0;
    this.vy  = 0;
};

Boid.prototype = {
    rad : 2,
    col : '#fff',

    update : function(){
        
    },

    draw : function(){
        this.ctx.fillStyle = this.col; 
        this.ctx.beginPath();
        this.ctx.arc( this.x, this.y, this.rad, 0, 2 * Math.PI, false );
        this.ctx.fill();
        this.ctx.closePath();
    }
    
};

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

    this.transX = 0;
    this.side = 120;
    this.halfSide = this.side / 2 * -1;
    this.ctx = ctx;

    this.col = '#fff';

    this.NUM_BOIDS = 20;
    this.NUM_BOIDS_EXC = this.NUM_BOIDS - 1;
    this.BOID_SIDE = 4;
    this.MAX_SPEED = 5;
    this.MAX_DIS   = 3;

    this.boids = [];

    this.rotate = 0;
    this.thetaArr = [0, Math.PI, Math.PI * 5 / 4, Math.PI * 3 / 2];
    this.ptArr =[
        new Pt(0, 0),
        new Pt(this.side, Math.PI),
        new Pt(this.side * Math.sqrt(2), Math.PI * (5/4)),
        new Pt(this.side, Math.PI * (3/2)),
    ];

    // initialize the boids
    for(var i = 0; i < this.NUM_BOIDS; i++){
        var boid = new Boid(ctx);
        this.boids.push(boid);
    }

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

        TweenLite.to(this, 1, { x : (this.originX - 120), onComplete : this.rotationComplete});
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
        var center = {
            x : this.x + (this.ptArr[0].x + this.ptArr[1].x + this.ptArr[2].x + this.ptArr[3].x)/4 + this.side/2,
            y : this.y,// - (this.ptArr[0].y + this.ptArr[1].y + this.ptArr[2].y + this.ptArr[3].y)/4
        };

        for(var i = 0; i < this.NUM_BOIDS; i++){
            var b = this.boids[i];
            this.rule1(i);
            this.rule2(i);
            this.rule3(i);

        var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if(speed >= this.MAX_SPEED) {
            var r = this.MAX_SPEED / speed;
            b.vx *= r;
            b.vy *= r;
        }

            if(b.x < -this.side/2 && b.vx < 0 || b.x > this.side/2  && b.vx > 0) b.vx *= -1;
            if(b.y < -this.side/2 && b.vy < 0 || b.y > this.side/2 && b.vy > 0) b.vy *= -1;

            b.x += b.vx;
            b.y += b.vy;


            this.ctx.save();
            this.ctx.translate( center.x, center.y);

            b.draw();

            this.ctx.restore();

        }
        

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
    },

    rule1 : function(index){
        var c = {x : 0, y: 0};

        for(var i = 0; i < this.NUM_BOIDS; i++){
            if(i != index){
                c.x += this.boids[i].x;
                c.y += this.boids[i].y;
            }
        }

        c.x /= this.NUM_BOIDS_EXC;
        c.y /= this.NUM_BOIDS_EXC;

        this.boids[index].vx += (c.x - this.boids[index].x)/100;
        this.boids[index].vy += (c.y - this.boids[index].y)/100;
    },

    rule2 : function(index){
        for(var i = 0; i < this.NUM_BOIDS; i++){
            if(i == index) return;
            var dis = this.getDistance(this.boids[i], this.boids[index]);
            if(dis < this.BOID_SIDE){
                this.boids[index].vx -= this.boids[i].x - this.boids[index].x;
                this.boids[index].vy -= this.boids[i].y - this.boids[index].y;
            }
        }
    },

    rule3 : function(index){
        var pv = {x: 0, y: 0};

        for(var i = 0; i < this.NUM_BOIDS; i++){
            if(i != index){
                pv.x += this.boids[i].vx;
                pv.y += this.boids[i].vy;
            }
        }

        pv.x /= this.NUM_BOIDS_EXC;
        pv.y /= this.NUM_BOIDS_EXC;

        this.boids[index].vx += (pv.x - this.boids[index].vx)/8;
        this.boids[index].vy += (pv.y - this.boids[index].vy)/8;
    },

    getDistance : function(p1, p2){
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;

        return Math.sqrt(dx * dx + dy * dy);
    }
};

var RectTop1 = function(ctx, x, y, rect){
    _.bindAll(this, 'rotationComplete');

    this.x = this.originX = x;
    this.y = y;

    this.side = 120;
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

    this.side = 120;
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
    rect = new Rect(ctx, width / 2, height *.9-60);
    rectTop1 = new RectTop1(ctx, width/2, height*.9-60, rect);
    rectTop2 = new RectTop2(ctx, width/2, height*.9-60, rectTop1);

    road = new Road(ctx, width/2, height *.9 + 2);
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
