// --------------------------

var width, height, prevTime, rad;
var sound220, sound440, sound880;
var isBlack = true;
var soundLoopCount  = 0;
var soundCount      = 0;
var soundLoopDuration = 600;
var tweenAnimationDuration = .4;
var isSoundPlay = true;
var SOUND_MAX_COUNT = 2;
var LOOP_MAX_COUNT  = 3;

var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

rad = Math.min(width *.4, height *.4);

document.getElementById("button").addEventListener("click", function(){ isSoundPlay = !isSoundPlay; });
// ================

var App = function(){
    this.scale = 20;
    this.x = 0;
    this.y = 0;
    this.rad = 10;

};

App.prototype = {

    update : function(){

        ctx.fillStyle = "#fff";
        ctx.save();

        ctx.translate(width/2, height/2);
        ctx.scale(this.scale, this.scale);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 *Math.PI, false);
        ctx.closePath();

        ctx.fill();

        ctx.restore();
    },

    scaleDown : function(){
        TweenLite.to(this, 10, {scale: 1, ease: "Power1.easeOut"});

    }


};

// ================

//init();
//loop();

var app = new App();

ctx.fillStyle = '#00';
ctx.fillRect(0, 0, width, height);

// =============

sound440 = new Howl({
    urls: ['https://dl.dropboxusercontent.com/u/7630890/sounds/sound440.mp3', 'https://dl.dropboxusercontent.com/u/7630890/sounds/sound440.ogg', 'https://dl.dropboxusercontent.com/u/7630890/sounds/sound440.wav'],
    volume : 1,
    onload : function(){
        soundCount++;

        if(soundCount === SOUND_MAX_COUNT) init();
    }
});


sound880 = new Howl({
    urls: ['https://dl.dropboxusercontent.com/u/7630890/sounds/sound880.mp3', 'https://dl.dropboxusercontent.com/u/7630890/sounds/sound880.ogg', 'https://dl.dropboxusercontent.com/u/7630890/sounds/sound880.wav'],
    volume: 1,
    onload : function(){
        soundCount++;

        if(soundCount === SOUND_MAX_COUNT) init();
    }
});

// =============


function init(){

    app.scaleDown();
    soundLoop();
    loop();
}

function loop(){

    app.update();

    requestAnimationFrame(loop);
}

function soundLoop(){

    /**
    soundLoopCount++;

    if(soundLoopCount % 12 == 0)   {
        if(isSoundPlay)sound880.play();

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        app.changeState();


        setTimeout(function(){
            if(isSoundPlay)sound880.play();


        }, soundLoopDuration/2);


        setTimeout(soundLoop, soundLoopDuration);
    }else if(soundLoopCount % 4 == 0){
        if(isSoundPlay) sound880.play();

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        app.changeState();


        setTimeout(soundLoop, soundLoopDuration);
    }else{
        app.impulse();
        if(isSoundPlay) sound440.play();


        setTimeout(soundLoop, soundLoopDuration);
    }
     */


}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;