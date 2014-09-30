// --------------------------
var NUM_BALLS = 130,
    DAMPING = 0.3,
    GRAVITY = 1,
    MOUSE_SIZE = 50,
    SPEED = 1;
var TWO_PI = Math.PI * 2;
var count  = 0;
var balls  = [];
var walls = [];
var firstWidth;
var leftWidth;

var reset = {
    y : null
};

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

var isNormal = true;

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var Wall = function(left, right, top, bot){
    this.left  = left;
    this.right = right;
    this.top   = top;
    this.bot   = bot;
};

var Ball = function(x, y, radius, wall) {

    this.x = x;
    this.y = y;

    this.px = x;
    this.py = y;

    this.fx = 0;
    this.fy = 0;

    this.radius = 0;

    TweenLite.to(this, 1, {radius: radius});

};

Ball.prototype.apply_force = function(delta) {

    delta *= delta;

    this.fy += GRAVITY;

    this.x += this.fx * delta;
    this.y += this.fy * delta;

    this.fx = this.fy = 0;
};

Ball.prototype.verlet = function() {

    var nx = (this.x * 2) - this.px;
    var ny = (this.y * 2) - this.py;

    this.px = this.x;
    this.py = this.y;

    this.x = nx;
    this.y = ny;
};

Ball.prototype.draw = function(ctx) {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
    ctx.fill();
};

//---------------------------------------

var resolve_collisions = function(ip) {

    var i = balls[count].length;

    while (i--) {

        var ball_1 = balls[count][i];


        var n = balls[count].length;

        while (n--) {

            if (n == i) continue;

            var ball_2 = balls[count][n];

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
};

var check_walls = function(wall) {

    var i = balls[count].length;

    while (i--) {

        var ball = balls[count][i];

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

var add_ball = function(x, y, r) {


    var x = x || Math.random() * (firstWidth),

        r = r || leftWidth * .4 * (.1 +.8*Math.random()) + 1;
    if(r > 100) r = 90 * Math.random() + 10;
    var    y = y ||  -Math.random() * 100  + 50,
        s = true,
        i = balls[count].length;



    if (s) balls[count].push(new Ball(x, y, r));
};

var totalWidth = 0;

function init(){
    firstWidth = width;
    totalWidth = width /2;
    leftWidth = width - totalWidth;


    var wall = new Wall(0, width, 0, height)
    walls.push(wall);
    balls[count] = [];
    for(var i = 0; i < 20; i++){
        add_ball();
    }




    var dis = leftWidth / 500;
    TweenLite.to(wall, dis, {left: leftWidth, delay: 2, ease:"Power2.easeOut", onComplete: addNew});

}


function addNew(){

    setTimeout(function(){

        count++;

        firstWidth = width - totalWidth;
        var wall = new Wall(0, firstWidth, 0, height)
        walls.push(wall);
        balls[count] = [];

        if(count < 3)
        totalWidth += (width - totalWidth)/2;

        leftWidth = width - totalWidth;

        for(var i = 0; i < 20; i++){
            add_ball();
        }




        if(count < 3) {
            var dis = leftWidth / 500;
            if(dis < .3) dis = .3;

            TweenLite.to(wall, dis, {left: leftWidth, delay: 1, ease:"Power2.easeOut", onComplete: addNew});
        }else{
            setTimeout(function(){
                isNormal = false;
                reset.y = window.innerHeight;

                TweenLite.to(reset, 1, {y: 0, delay:.5, ease:"Power2.easeOut", onUpdate: onUpdateResetHandler, onComplete: onCompleteResetHandler})
                setTimeout(function(){
                    for(var i = 0; i < balls.length; i++){
                        for(var j = 0; j < balls[i].length; j++){
                            balls[i][j].fy = -150 - 150 * Math.random();
                        }
                    }

                }, 500);

            }, 2000)
        }
    }, 1000);

}

function onUpdateResetHandler(){
    walls.forEach(function(element){
        element.bot = reset.y;
    });

};

function onCompleteResetHandler(){
    count = 0;
    walls = [];
    balls = [];

    isNormal = true;

    init();
}

function loop() {
    if(isNormal) normalLoop();
    else         resetLoop();


    requestAnimationFrame(loop);
}

function normalLoop(){
    for(var j = 0; j < balls.length; j++){
        count = j;

        var iter = 6;

        var delta = SPEED / iter;

        while (iter--) {

            var i = balls[count].length;

            while (i--) {

                balls[count][i].apply_force(delta);
                balls[count][i].verlet();
            }

            resolve_collisions();
            check_walls(walls[count]);

            var i = balls[count].length;
            while (i--) balls[count][i].verlet();

            resolve_collisions(1);
            check_walls(walls[count]);
        }
    }

    count = balls.length - 1;

    if(count % 2 == 0)ctx.fillStyle = '#fff';
    else          ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    for(var j = 0; j < count + 1;j++){
        if(j % 2 == 0) ctx.fillStyle = '#333';
        else       ctx.fillStyle = "#fff";
        ctx.fillRect(walls[j].left, 0, walls[j].right - walls[j].left, height);

        var i = balls[j].length;
        if(j % 2 == 0) ctx.fillStyle = '#fff';
        else       ctx.fillStyle = '#333';

        while (i--) balls[j][i].draw(ctx)
    }

}

function resetLoop(){
    normalLoop();

    ctx.fillStyle = "#333";
    ctx.fillRect(0, reset.y, width, height - reset.y);
}


init();
loop();

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;