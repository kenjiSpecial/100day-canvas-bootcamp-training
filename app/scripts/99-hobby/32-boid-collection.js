// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

var side = 200
var leftX = width/2 - side/2;
var rightX = width/2 + side/2;
var topY = height/2 - side/2;
var bottomY = height/2 + side/2;

// ================
var Boid = function(ctx){
    this.ctx = ctx;

    this.x   = width/2 + side * (Math.random() - .5);
    this.y   = height/2 + side * (Math.random() -.5);

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

// ================
var boidCollection = [];
var boids      = [];
boids[0] = [];
boids[1] = [];
boids[2] = [];
boids[3] = [];


var Vars = [];
var NUM_BOIDS = 240;
var BOID_SIDE;
var MAX_SPEED;

init();
loop();

function init(){
    for(var i = 0; i < 4; i++){
        Vars.push({
            BOID_SIDE : 2 + 4 * Math.random(),
            MAX_SPEED : 3  + 3 * Math.random(),
            rule1     : 10 + 140 * Math.random(),
            rule3     : 6 + Math.random() * 20
        });
    }

    for(var i = 0; i < NUM_BOIDS; i++){
        var random = Math.random();
        var boid = new Boid(ctx);

        if(random < 1/4)       {
            boid.col = '#e74c3c';
            boids[0].push(boid);
        }
        else if(random < 1/2){
            boid.col = '#f1c40f';
            boids[1].push(boid);
        }  else if(random < 3 /4){
            boid.col = '#3498db';
            boids[2].push(boid);
        }
        else                   {
            boid.col = '#1abc9c';
            boids[3].push(boid);
        }

        boidCollection.push(boid);
    }



    prevTime = +new Date;

    setTimeout(shuffle, 1000 * 4);
}

function shuffle(){
    //var collectionNum = parseInt(Math.random * 4);

    boids[0] = [];
    boids[1] = [];
    boids[2] = [];
    boids[3] = [];



    for(var i = 0; i < 4; i++){
        Vars[i] = {
            BOID_SIDE : 2 + 4 * Math.random(),
            MAX_SPEED : 3  + 3 * Math.random(),
            rule1     : 10 + 140 * Math.random(),
            rule3     : 6 + Math.random() * 20
        };
    }



    for(var i = 0; i < NUM_BOIDS; i++){
        var random = Math.random();
        var boid = boidCollection[i];

        if(random < 1/4)       {
            boid.col = '#e74c3c';
            boids[0].push(boid);
        }
        else if(random < 1/2){
            boid.col = '#f1c40f';
            boids[1].push(boid);
        }  else if(random < 3 /4){
            boid.col = '#3498db';
            boids[2].push(boid);
        }
        else                   {
            boid.col = '#1abc9c';
            boids[3].push(boid);
        }
    }

    console.log(boidCollection);

    setTimeout(shuffle, 1000 * 4);
}




function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;


    side = 300 + 100 * Math.cos(curTime/2000);
    leftX = width/2 - side/2;
    rightX = width/2 + side/2;
    topY = height/2 - side/2;
    bottomY = height/2 + side/2;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.fillRect( leftX, topY, side, side);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leftX, topY);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.closePath();


    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(leftX, bottomY);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.closePath();


    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(rightX, topY);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.closePath();


    ctx.beginPath();
    ctx.moveTo(width, height);
    ctx.lineTo(rightX, bottomY);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    ctx.closePath();

    for(var i = 0; i < boids.length; i++){
        MAX_SPEED = Vars[i].MAX_SPEED;

        for(var j = 0; j < boids[i].length; j++){
            var b = boids[i][j];
            b.rad = (side / 400 * .8 + .2) * 3;



            rule1(i, j);
            rule2(i, j);
            rule3(i, j);

            /**
            if(b.x < 0) b.x += width;
            if(b.x > width) b.x -= width;

            if(b.y < 0) b.y += height;
            if(b.y > height) b.y -= height;*/


            var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
            if(speed >= MAX_SPEED) {
                var r = MAX_SPEED / speed;
                b.vx *= r;
                b.vy *= r;
            }

            if(b.x < leftX && b.vx < 0 || b.x > rightX  && b.vx > 0) b.vx *= -.9
            if(b.y < topY && b.vy < 0 || b.y > bottomY && b.vy > 0) b.vy *= -.9;

            b.x += b.vx;
            b.y += b.vy;

            b.draw();




        }

    }



    requestAnimationFrame(loop);
}

function rule1(index1, index2){
    var c = {x: 0, y: 0};
    var vel = Vars[index1].rule1;

    var _boids = boids[index1];
    for(var i = 0; i < _boids.length; i++){

        if(i != index2){
            c.x += _boids[i].x;
            c.y += _boids[i].y;
        }
    }

    c.x = c.x / (_boids.length-1);
    c.y = c.y / (_boids.length-1);

    _boids[index2].vx += (c.x - _boids[index2].x)/vel;
    _boids[index2].vy += (c.y - _boids[index2].y)/vel;
}

function rule2(index1, index2){
    var _boids = boids[index1];
    BOID_SIDE = Vars[index1].BOID_SIDE;

    for( var i = 0; i < _boids.length; i++){
        var d = getDistance(_boids[i], _boids[index2]);

        if(d < BOID_SIDE){
            _boids[index2].vx -= _boids[i].x - _boids[index2].x;
            _boids[index2].vy -= _boids[i].y - _boids[index2].y;
        }
    }
}

function rule3(index1, index2){
    var pv = {x: 0, y: 0};
    var _boids = boids[index1];
    var vel = Vars[index1].rule3;

    for(var i = 0; i < _boids.length; i++){
        if(i != index2){
            pv.x += _boids[i].vx;
            pv.y += _boids[i].vy;
        }
    }

    pv.x /= (_boids.length - 1);
    pv.y /= (_boids.length - 1);

    _boids[index2].vx += (pv.x - _boids[index2].vx) / vel;
    _boids[index2].vy += (pv.y - _boids[index2].vy) / vel;
}

function getDistance(p1, p2){
    var dx = p1.x - p2.x;
    var dy = p1.y -p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
