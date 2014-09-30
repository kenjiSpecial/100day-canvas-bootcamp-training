// --------------------------
var TWO_PI = Math.PI * 2;
var NUM_BALLS = 130,
    DAMPING = 0.8,
    GRAVITY = 1.5,
    MOUSE_SIZE = 50,
    SPEED = .5;

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width = width;
canvas.height = height;

// ================

var Ball = function (x, y, radius, wall) {

    this.x = x || 0;
    this.y = y || 0;

    this.px = x;
    this.py = y;

    this.fx = 0;
    this.fy = 0;


    this.radius = radius || 10;

    //TweenLite.to(this, 1, {radius: radius});

};

Ball.prototype.init = function () {
    this.px = this.x;
    this.py = this.y;

    this.fx = 0;
    this.fy = 0;
}

Ball.prototype.apply_force = function (delta) {

    delta *= delta;

    this.fy += GRAVITY;

    this.x += this.fx * delta;
    this.y += this.fy * delta;

    this.fx = this.fy = 0;
};

Ball.prototype.verlet = function () {

    var nx = (this.x * 2) - this.px;
    var ny = (this.y * 2) - this.py;

    this.px = this.x;
    this.py = this.y;

    this.x = nx;
    this.y = ny;
};

Ball.prototype.draw = function () {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
    ctx.fill();
};


var OutsideCircle = function () {
    this.rad = rad;
};

OutsideCircle.prototype = {
    update: function () {

    },

    draw: function () {
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.arc(0, 0, this.rad, 0, TWO_PI);
        ctx.stroke();
        ctx.closePath();
    },

    checkCollision : function(cricles){
        var self = this;
        cricles.forEach(function(element){
            var dis1 = Math.sqrt(element.x * element.x + element.y * element.y);
            if(dis1 + element.radius > self.rad){
                var theta = Math.atan2(element.y, element.x);

                var vel_x = element.px - element.x;
                var vel_y = element.py - element.y;

                var vel_xx = Math.cos(Math.PI / 2 - theta) * vel_x - vel_y * Math.cos(Math.PI / 2 - theta);
                var vel_yy = Math.sin(Math.PI / 2 - theta) * vel_x + vel_y * Math.sin(Math.PI / 2 - theta);

                vel_yy*= -DAMPING;

                vel_x = Math.cos(theta - Math.PI/2) * vel_xx - Math.cos(theta - Math.PI/2) * vel_yy;
                vel_y = Math.sin(theta - Math.PI/2) * vel_xx + Math.sin(theta - Math.PI/2) * vel_yy;


                element.x = (self.rad - element.radius -.5) * Math.cos(theta);
                element.y = (self.rad - element.radius -.5) * Math.sin(theta);

                element.px = element.x - DAMPING * vel_x;
                element.py = element.y - DAMPING * vel_y;

            }
        });
    }
};

//---------------------------------------

var resolve_collisions = function(ip, balls) {

    var i = balls.length;

    while (i--) {

        var ball_1 = balls[i];


        var n = balls.length;

        while (n--) {

            if (n == i) continue;

            var ball_2 = balls[n];

            var diff_x = ball_1.x - ball_2.x;
            var diff_y = ball_1.y - ball_2.y;

            var length    = diff_x * diff_x + diff_y * diff_y;
            var dist      = Math.sqrt(length);
            var real_dist = dist - (ball_1.radius + ball_2.radius);

            if (real_dist < 0) {

                var vel_x1 = ball_1.x - ball_1.px;
                var vel_y1 = ball_1.y - ball_1.py;
                var vel_x2 = ball_2.x - ball_2.px;
                var vel_y2 = ball_2.y - ball_2.py;

                var depth_x = diff_x * (real_dist / dist);
                var depth_y = diff_y * (real_dist / dist);

                ball_1.x -= depth_x * 0.5;
                ball_1.y -= depth_y * 0.5;

                ball_2.x += depth_x * 0.5;
                ball_2.y += depth_y * 0.5;

                if (ip) {

                    var pr1 = DAMPING * (diff_x*vel_x1+diff_y*vel_y1) / length,
                        pr2 = DAMPING * (diff_x*vel_x2+diff_y*vel_y2) / length;

                    vel_x1 += pr2 * diff_x - pr1 * diff_x;
                    vel_x2 += pr1 * diff_x - pr2 * diff_x;

                    vel_y1 += pr2 * diff_y - pr1 * diff_y;
                    vel_y2 += pr1 * diff_y - pr2 * diff_y;

                    ball_1.px = ball_1.x - vel_x1;
                    ball_1.py = ball_1.y - vel_y1;

                    ball_2.px = ball_2.x - vel_x2;
                    ball_2.py = ball_2.y - vel_y2;
                }
            }
        }
    }
}
// ---------------------------------

var Balls = function () {
    this.balls = [];

    for (var i = 0; i < this.ballNum; i++) {
        var ball = new Ball();
        this.balls.push(ball);
    }

    this.outSide = new OutsideCircle();
    this.init();
};

Balls.prototype = {
    ballNum: 30,
    init: function () {
        this.balls[0].x = 0;
        this.balls[0].y = 0;

        for (var i = 1; i < this.ballNum; i++) {
            var theta = TWO_PI * Math.random();

            var rr = 5 + 55 * Math.random();
            var randomRad = (rad - maxRad - rr * 2) * Math.random();
            var xx = Math.cos(theta) * (maxRad + rr + randomRad);
            var yy = Math.sin(theta) * (maxRad + rr + randomRad);

            if(rr > rad /5) rr = 1 + Math.random() * rad/5;

            this.balls[i].x = xx;
            this.balls[i].y = yy;
            this.balls[i].radius = rr;

        }

        this.balls.forEach(function (element) {
            element.init();
        });


    },
    update: function () {

        var iter = 6;

        var delta = SPEED / iter;

        while (iter--) {

            var i = this.balls.length;

            while (i--) {

                this.balls[i].apply_force(delta);
                this.balls[i].verlet();
            }

            resolve_collisions(false, this.balls);
            this.outSide.checkCollision(this.balls);

            var i = this.balls.length;
            while (i--) this.balls[i].verlet();

            resolve_collisions(true, this.balls);
            this.outSide.checkCollision(this.balls);
        }

    },

    draw: function () {
        this.balls.forEach(function (element) {
            element.draw();
        });

        this.outSide.draw();


    }
};

var Cross = function(){
    _.bindAll(this, "secondRotation");
};

Cross.prototype = {
    theta : 0,
    isRotationDraw : false,
    reset : function(){
        this.isRotationDraw = false;
        this.theta = 0;
    },

    rotation : function(){
        TweenLite.to(this, 1.5, {theta: Math.PI * 2, onComplete: this.secondRotation});

    },

    secondRotation : function(){
        this.isRotationDraw = true;
        this.theta = 0;

        TweenLite.to(this, 1, {theta: Math.PI /2,ease: "Power2.easeOut" });
    },
    update : function(){

    },
    draw : function(){
        if(this.isRotationDraw){
            for(var i = 0; i < 4; i++){
                var baseTheta = i * Math.PI/2;
                ctx.beginPath();
                ctx.moveTo(0, 0)
                ctx.lineTo(rad * Math.cos(baseTheta), rad * Math.sin(baseTheta));
                ctx.arc( 0, 0, rad, baseTheta, baseTheta + this.theta );
                ctx.lineTo(rad * Math.cos(baseTheta + this.theta), rad * Math.sin(baseTheta + this.theta));
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }



    }
};

// ---------------------------------
var App = function () {
    _.bindAll(this, "step1", "reset", "start");
    this.centerX = width / 2;
    this.centerY = height / 2;

    //this.ball = new Ball();
    this.balls = new Balls();
    this.scale = INIT_SCALE;
    this.cross = new Cross();

    setTimeout(this.start, 500);
    //this.start();
};

App.prototype = {
    col: "#fff",
    isStop : true,
    reset : function(){
        this.scale = INIT_SCALE;
        this.balls.init();
        this.cross.reset();
        this.start();
    },

    start: function () {
        this.isStop = true;
        TweenLite.to(this, 1, {scale: 1, ease: "Power2.easeOut", onComplete: this.step1});
    },

    step1: function () {
        this.isStop = false;
        this.cross.rotation();

        setTimeout(this.reset, 3000);
    },

    update: function () {
        if (!this.isStop) {
            this.balls.update();
        }

    },
    draw: function () {
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.translate(this.centerX, this.centerY);
        ctx.scale(this.scale, this.scale);
        this.balls.draw();
        this.cross.draw();
        ctx.restore();
    }
};

// =================================
var rad = Math.min(width, height) / 2;
var INIT_SCALE = rad / 10;
var maxRad = Math.sqrt(width * width + height * height) / 2 / rad * 10;

var app;

init();
loop();

function init() {
    app = new App();
}

function loop() {

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    app.update();
    app.draw();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;