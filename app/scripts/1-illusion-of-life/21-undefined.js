window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

// ---------------------

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

    this.isDraw = true;
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

    this.isDraw = true;
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

}

var Particles = function(ctx){
    _.bindAll(this, 'interval');
    this.ctx = ctx;
    this.arr = [];

    for(var i = 0; i < this.num; i++){
        var particle = new Particle(ctx, width * Math.random(), height * Math.random());
        this.arr.push(particle);
    }

    this.interval();
    setInterval(this.interval, 4000);
}

Particles.prototype = {
    num : 1000,
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

    this.isDraw = true;
};

ParticleAnimation.prototype = {
    gridNums : 21,
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

var particles;

init();
loop();

function init(){
    particles = new Particles(ctx);
    particleAnimation = new ParticleAnimation(ctx);
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

    requestAnimationFrame(loop);
}

canvas.addEventListener("mousemove", function (evt) {
    mousePos = {x: evt.clientX, y: evt.clientY};
}, false);


