// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var Boid = function(ctx, x, y){
    this.ctx = ctx;

    this.x   = x;
    this.y   = y;

    this.vx  = 0;
    this.vy  = 0;

};

Boid.prototype = {
    rad : 2,
    col : '#fff',

    update : function(){

    },

    draw : function(){
        this.ctx.save();

        this.ctx.translate(this.x, this.y);
        this.ctx.scale(0.05, 0.05);
        this.ctx.drawImage(image, -imageWid/2, -imageHig/2);

        this.ctx.restore();
    }

};

// ================

//init();
//loop();
var boids = [];
var BOID_SIDE = 30;
var MAX_DIS = 20;
var MAX_SPEED = 12;
var NUM_BOIDS;
var NUM_BOIDS_EXC;

var imageWid, imageHig;
var image = new Image();
image.src = 'http://www.clipartbest.com/cliparts/dMT/LMo/dMTLMo6ia.png';
image.onload = onLoad;
var text = "";
var textCount = 0;
var FULL_TEXT = "MOVE MOUSE";
var mouse;
var isMouseStatic = false;

function onLoad(){
    imageWid = image.width;
    imageHig = image.height;


    init();
    loop();

}

function init(){
    prevTime = +new Date;

    showText();
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;


    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    fillText();


    if(boids.length > 0){
        var isMouseActive = true;
        for(var i = 0; i < boids.length; i++){
            if(!isMouseStatic){
                var b = boids[i];
                rule1(i);
                rule2(i);
                rule3(i);

                var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
                if(speed >= MAX_SPEED) {
                    var r = MAX_SPEED / speed;
                    b.vx *= r;
                    b.vy *= r;
                }

                boids[i].x += boids[i].vx;
                boids[i].y += boids[i].vy;

                if(b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
                    boids[i].isOut = true;
                }
                else                                                  {
                    boids[i].isOut = false;
                }
            }

            boids[i].draw();
        }

        for(var i = 0; i < boids.length; i++){
            if(!boids[i].isOut) isMouseActive = false;
        }


        if(isMouseActive && !isMouseStatic){

            isMouseStatic = true;
            boids = [];
            showText();
        }

    }






    requestAnimationFrame(loop);
}

function showText(){
    isMouseStatic = true;
    textCount = 0;
    //var boid = new Boid(ctx, 80, 90);
    //boids.push(boid);



    loopText();
}

function removeText(){
    textCount--;
    text = FULL_TEXT.substring(0, textCount);

    if(textCount >= 0)
        setTimeout(removeText, 16);

}

var mouseCount = 0;
var prevMouse = {x: null, y: null};

function loopText(){

    textCount++;
    if(textCount == 1){
        var boid = new Boid(ctx, 82, 90);
        boids.push(boid);
    }else{

        text = FULL_TEXT.substring(0, textCount-1);
    }


    if(textCount <= FULL_TEXT.length)
        setTimeout(loopText, 16);
    else{
        ctx.font="30px Arial";
        var textWidth = ctx.measureText(FULL_TEXT).width;
        var boid = new Boid(ctx, textWidth + 120, 90);
        boids.push(boid);


        mouseCount = 0;

        document.addEventListener('mousemove', onMouseMove);
        //setTimeout(onIntervalMousePosition, 100);
    }

}

function fillText(){
    ctx.font =  "30px Arial";
    ctx.fillStyle = '#333';
    ctx.fillText(text, 100, 100);
}

function onMouseMove(event){

    mouse = {x: event.pageX, y: event.pageY};

    var boid;
    if(mouse.x == prevMouse.x && mouse.y == prevMouse.y)
        return

    boid = new Boid(ctx, mouse.x, mouse.y);

    prevMouse = {x: mouse.x, y: mouse.y};

    boids.push(boid);




    mouseCount++;
    if(mouseCount > 50){
        NUM_BOIDS = boids.length;
        NUM_BOIDS_EXC = NUM_BOIDS - 1;
        isMouseStatic = false;
        removeText();
        document.removeEventListener('mousemove', onMouseMove);
    }else{


    }

    mouseCount++;


}

function rule1(index){
    var c = {x: 0, y: 0};

    for(var i = 0; i < boids.length; i++){

        if(i != index){
            c.x += boids[i].x;
            c.y += boids[i].y;
        }
    }

    c.x = c.x / NUM_BOIDS_EXC;
    c.y = c.y / NUM_BOIDS_EXC;

    boids[index].vx += (c.x - boids[index].x)/100;
    boids[index].vy += (c.y - boids[index].y)/100;
}

function rule2(index){
    for( var i = 0; i < boids.length; i++){
        var d = getDistance(boids[i], boids[index]);
        if(d < BOID_SIDE){
            boids[index].vx -= boids[i].x - boids[index].x;
            boids[index].vy -= boids[i].y - boids[index].y;
        }
    }
}

function rule3(index){
    var pv = {x: 0, y: 0};
    for(var i = 0; i < boids.length; i++){
        if(i != index){
            pv.x += boids[i].vx;
            pv.y += boids[i].vy;
        }
    }

    pv.x /= NUM_BOIDS_EXC;
    pv.y /= NUM_BOIDS_EXC;

    boids[index].vx += (pv.x - boids[index].vx) / 8;
    boids[index].vy += (pv.y - boids[index].vy) / 8;
}

function getDistance(p1, p2){
    var dx = p1.x - p2.x;
    var dy = p1.y -p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame