// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var sCol = .8, bCol = .8;
var colorPaletteArr = [];
var isColorSelected;
var balls = [];

var NUM_BALLS = 130,
    DAMPING = 0.3,
    GRAVITY = 1,
    MOUSE_SIZE = 50,
    SPEED = 1;
var TWO_PI = Math.PI * 2;
var count = 0;

var colorCircle;
var rainbowBall;
var isSelectedColor = true;
var wall;

width = window.innerWidth;
height = window.innerHeight;

canvas.width = width;
canvas.height = height;


// ================
var Wall = function (left, right, top, bot) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bot = bot;
};

var Ball = function (x, y, radius, col, wall, isRainbow) {

    this.x = x;
    this.y = y;

    this.px = x;
    this.py = y;

    this.fx = 0;
    this.fy = 0;

    this.col = col;

    this.radius = radius;
    this.isRainbow = isRainbow;
};

Ball.prototype.setCanvas = function (_canvas) {
    this.canvas = _canvas;
    this.isRainbow = true;
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

Ball.prototype.draw = function (ctx) {

    if (this.isRainbow) {

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.canvas, -this.radius, -this.radius);
        ctx.restore();

    } else {
        ctx.beginPath();
        ctx.fillStyle = this.col;
        ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
        ctx.fill();
    }

};


var resolve_collisions = function (ip) {

    var i = balls.length;

    while (i--) {

        var ball_1 = balls[i];


        var n = balls.length;

        while (n--) {

            if (n == i) continue;

            var ball_2 = balls[n];

            var diff_x = ball_1.x - ball_2.x;
            var diff_y = ball_1.y - ball_2.y;

            var length = diff_x * diff_x + diff_y * diff_y;
            var dist = Math.sqrt(length);
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

                    var pr1 = DAMPING * (diff_x * vel_x1 + diff_y * vel_y1) / length,
                        pr2 = DAMPING * (diff_x * vel_x2 + diff_y * vel_y2) / length;

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
};

var check_walls = function (wall) {

    var i = balls.length;

    while (i--) {

        var ball = balls[i];

        if (ball.x < wall.left + ball.radius) {

            var vel_x = ball.px - ball.x;
            ball.x = wall.left + ball.radius;
            ball.px = ball.x - vel_x * DAMPING;

        } else if (ball.x + ball.radius > wall.right) {

            var vel_x = ball.px - ball.x;
            ball.x = wall.right - ball.radius;
            ball.px = ball.x - vel_x * DAMPING;
        }

        if (ball.y + ball.radius > wall.bot) {

            var vel_y = ball.py - ball.y;
            ball.y = wall.bot - ball.radius;
            ball.py = ball.y - vel_y * DAMPING;
        }
    }
};

// ================


function addBall() {

    isColorSelected = false;

    var xPos = width / 2;
    var yPos = height / 2;
    var rad = 105;
    var col = "#ffffff";
    rainbowBall = new Ball(xPos, yPos, rad, col, wall);
    rainbowBall.setCanvas(colorCircle.rainbowCircle.canvas);
    //balls.push(ball);


    for (var xx = 0; xx < 3; xx++) {
        var xPos = colorCircle.smallCircles[xx].x + width / 2;
        var yPos = colorCircle.smallCircles[xx].y + height / 2;
        var ball = new Ball(xPos, yPos, colorCircle.smallCircles[xx].rad, colorCircle.smallCircles[xx].col, wall);
        balls.push(ball);
    }


    addOnlyBall();

}

function addOnlyBall() {

    for (var num = 0; num < 20; num++) {
        var xPos = width * (.1 + .8 * Math.random());
        var yPos = -height * (.1 + .8 * Math.random());
        var rad = 20 + 30 * Math.random();
        var randomNum = Math.random() * 3 | 0;
        var colorStr = colorPaletteArr[randomNum];
        balls.push(new Ball(xPos, yPos, rad, colorStr, wall));
    }

}

// ================
var SmallCircle = function () {
    this.velTheta = .04;
    this.theta = 0;

    this.outsideRad = 100;
    this.isAnimation = true;
    this.rad = 10;
};

SmallCircle.prototype = {
    update: function () {
        if (this.isAnimation) this.theta += this.velTheta;
        if (this.theta < 0) this.theta += Math.PI * 2;

        this.x = this.outsideRad * Math.cos(this.theta);
        this.y = this.outsideRad * Math.sin(this.theta);

        var val = this.theta / (2 * Math.PI);
        var color = HSVtoRGB(val, sCol, bCol);
        this.col = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";

        ctx.save();
        ctx.fillStyle = this.col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    },

    stop: function () {
        this.isAnimation = false;
    }
};

var RainbowCircle = function () {
    this.rad = 100;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 210;
    this.canvas.height = 210;

    this.ctx = this.canvas.getContext('2d');

    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    var xPos, yPos, nextXPos, yPos;
    for (var ii = 0; ii < 360; ii = ii + 3) {

        var rate = ii / 360;
        colorRGB = HSVtoRGB(rate, sCol, bCol);

        colorString = "rgb(" + colorRGB.r + ", " + colorRGB.g + ", " + colorRGB.b + ")";


        xPos = this.rad * Math.cos(ii / 180 * Math.PI);
        yPos = this.rad * Math.sin(ii / 180 * Math.PI);

        nextXPos = this.rad * Math.cos((ii + 3) / 180 * Math.PI);
        nextYPos = this.rad * Math.sin((ii + 3) / 180 * Math.PI);


        this.ctx.strokeStyle = colorString;
        this.ctx.beginPath();
        this.ctx.moveTo(xPos, yPos);
        this.ctx.lineTo(nextXPos, nextYPos);
        this.ctx.stroke();
    }

    this.ctx.restore();
};

var ColorCircle = function (x, y) {
    this.x = x;
    this.y = y;


    this.rad = 100;

    this.smallCircles = [];
    var smallCircle = new SmallCircle();
    this.smallCircles.push(smallCircle);

    this.rainbowCircle = new RainbowCircle();
};

ColorCircle.prototype = {
    isCircle: true,

    update: function () {
        var colorRGB, xPos, yPos, nextXPos, nextYPos;
        var colorString;

        ctx.lineWidth = 2;

        ctx.save();
        ctx.translate(this.x, this.y);


        //console.log(this.rainbowCircle.canvas);
        ctx.drawImage(this.rainbowCircle.canvas, -this.rainbowCircle.canvas.width / 2, -this.rainbowCircle.canvas.height / 2);


        ctx.save();
        for (ii = 0; ii < this.smallCircles.length; ii++) {
            this.smallCircles[ii].update()
        }
        ctx.restore();

        ctx.restore();
    },

    addCircle: function () {
        if (isSelectedColor) {
            if (this.smallCircles.length < 2) {
                this.smallCircles[this.smallCircles.length - 1].stop();
                colorPaletteArr.push(this.smallCircles[this.smallCircles.length - 1].col);

                var smallCircle = new SmallCircle();
                smallCircle.theta = this.smallCircles[this.smallCircles.length - 1].theta;
                this.smallCircles.push(smallCircle);

                var smallCircle = new SmallCircle();
                smallCircle.theta = this.smallCircles[this.smallCircles.length - 1].theta;
                smallCircle.velTheta = -0.04;
                this.smallCircles.push(smallCircle);

            } else if (this.smallCircles.length == 3) {
                this.smallCircles[this.smallCircles.length - 2].stop();
                this.smallCircles[this.smallCircles.length - 1].stop();

                colorPaletteArr.push(this.smallCircles[this.smallCircles.length - 2].col);
                colorPaletteArr.push(this.smallCircles[this.smallCircles.length - 1].col);

                addBall();

                isSelectedColor = false;
            }
        } else {
            addOnlyBall();
        }
    }
};


// ================


init();
loop();

function init() {
    colorCircle = new ColorCircle(width / 2, height / 2);


    prevTime = +new Date;

    isColorSelected = true;

    wall = new Wall(0, width, -height, height);
}

function loop() {
    var curTime = +new Date;
    var duration = (curTime - prevTime) / 1000;
    prevTime = curTime;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (isColorSelected) colorCircle.update();
    else                loopBall();

    ctx.save();
    var alpha = Math.random() * .1 + .3;
    ctx.fillStyle = "rgba(255, 255, 255, "+ alpha +")";
    ctx.font="22px 'HelveticaNeue-Light','Helvetica Neue Light','Helvetica Neue',sans-serif";
    ctx.fillText("CLICK!", width/2 - 35, height/2 +10);
    ctx.restore();

    requestAnimationFrame(loop);
}

function loopBall() {


    var iter = 3;

    var delta = SPEED / iter;

    while (iter--) {

        var i = balls.length;

        while (i--) {

            balls[i].apply_force(delta);
            balls[i].verlet();
        }

        rainbowBall.apply_force(delta);
        rainbowBall.verlet();


        resolve_collisions();
        check_walls(wall);

        var i = balls.length;
        while (i--) balls[i].verlet();

        resolve_collisions(1);
        check_walls(wall);

    }

    for (var i = 0; i < balls.length; i++) {
        balls[i].draw(ctx);
    }

    rainbowBall.draw(ctx);


}

document.addEventListener("click", function (ev) {
    //alert("click");
    colorCircle.addCircle();
});


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
