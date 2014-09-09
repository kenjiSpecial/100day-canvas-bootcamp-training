// --------------------------

var width, height, prevTime, rad;
var sound220, sound440, sound880;
var isBlack = true;
var soundLoopCount  = 0;
var soundCount      = 0;
var soundLoopDuration = 600;
var tweenAnimationDuration = .4;
var isSoundPlay = true;
var SOUND_MAX_COUNT = 3;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

rad = Math.min(width *.4, height *.4);

document.getElementById("button").addEventListener("click", function(){ isSoundPlay = !isSoundPlay; });
// ================
var Line = function(i){
    this.id = i;
    this.type = i % 4;
    this.x = this.prevX = width / 2;
    this.y = this.prevY = height / 2;
};

Line.prototype = {
    curState : 0,

    isBlack : false,
    isAcl   : false,

    kasoku  : 0,
    opacity : .8,

    init : function(){
        this.inits[this.curState].call(this);
    },

    inits : [
        function(){
            this.x = this.prevX = width/2;
            this.y = this.prevY = height/2;
        },

        function(){
            if(this.type == 0){
                this.x = this.prevX = width * Math.random();
                this.y = this.prevY = height + 20 * Math.random();
            }

            if(this.type == 1){
                this.x = this.prevX = width * Math.random();
                this.y = this.prevY = 0 - 20 * Math.random();
            }

            if(this.type == 2){
                this.x = this.prevX = -20 * Math.random();
                this.y = this.prevY = height * Math.random();
            }

            if(this.type == 3){
                this.x = this.prevX = width + 20 * Math.random();
                this.y = this.prevY = height * Math.random();
            }


        },

        function(){
            this.y = height * Math.random();
            this.velY = 1.5 - 3 * Math.random();
        }
    ],

    update : function(){
        this.updates[this.curState].call(this);
    },

    updates : [
        function(){
            this.prevX = this.x;///
            this.prevY = this.y;

            this.x += Math.random() * 20 - 10 + this.kasoku1;
            this.y += Math.random() * 20 - 10 + this.kasoku2;
            this.kasoku1 *= .8;
            this.kasoku2 *= .8;


            //ctx.strokeStyle = "rgba(255, 255, 255, " + this.opacity * (Math.random()) + ")";
            ctx.strokeStyle = "#fff";
            ctx.beginPath();
            ctx.moveTo(this.prevX, this.prevY);
            ctx.lineTo(this.x, this.y);
            ctx.closePath();

            ctx.stroke();
        },

        function(){
            this.prevX = this.x;
            this.prevY = this.y;

            if(this.type == 0){
                this.x += Math.random() * 20 - 10 + this.kasoku1;
                this.y -= 5 + 5 * Math.random();
                this.kasoku1 *= .8;
            }

            if(this.type == 1){
                this.x += Math.random() * 20 - 10 + this.kasoku1;
                this.y += 5 + 5  * Math.random();
                this.kasoku1 *= .8;
            }

            if(this.type == 2){
                this.x += 5 + 5 * Math.random();
                this.y += Math.random() * 20 - 10 + this.kasoku1;
                this.kasoku1 *= .8;
            }

            if(this.type == 3){
                this.x -= 5 + 5 * Math.random();
                this.y += Math.random() * 20 - 10 + this.kasoku1;
                this.kasoku1 *= .8;
            }


            //ctx.strokeStyle = "rgba(255, 255, 255, " + this.opacity * (Math.random()) + ")";
            ctx.strokeStyle = "#fff";
            ctx.beginPath();
            ctx.moveTo(this.prevX, this.prevY);
            ctx.lineTo(this.x, this.y);
            ctx.closePath();

            ctx.stroke();
        },

        function(){
            if(this.id % 12 == 0){

                this.prevX = this.x;
                this.prevY = this.y;

                this.y -=  this.velY + this.kasoku1;
                this.kasoku1 *= .8;



                ctx.fillStyle = "rgba(255, 255, 255, .1)";
                ctx.beginPath();
                ctx.moveTo(0, this.prevY);
                ctx.lineTo(width, this.prevY);
                ctx.lineTo(width, this.y);
                ctx.lineTo(0, this.y);
                ctx.lineTo(0, this.prevY);
                ctx.closePath();


                ctx.fill();

            }

        }
    ],

    acl : function(){
        this.kasoku1 = -50 + 100 * Math.random();
        this.kasoku2 = -50 + 100 * Math.random();
        this.isAcl = true;
    },

    changeState : function(){
        this.curState = (this.curState + 1) % SOUND_MAX_COUNT;

        this.init();
        this.acl();
    }

};

var App = function(){
    this.lines = [];

    for(var i = 0; i < 300; i++){
        var line = new Line(i);
        this.lines.push(line);
    }
};

App.prototype = {
    MAX_STAGE: 3,
    isBlack       : true,
    isChangeColor : false,
    rad           : 0,

    update : function(){

        ctx.fillStyle = "rgba(0, 0, 0, .1)";
        ctx.fillRect(0, 0, width, height);

        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].update();
        }

    },

    start : function(){
        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].acl();
        }
    },

    changeState : function(){
        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].changeState();
        }
    }
};

// ================

//init();
//loop();

var app = new App()


ctx.fillStyle = '#00';
ctx.fillRect(0, 0, width, height);


sound220 = new Howl({
    urls: ['https://dl.dropboxusercontent.com/u/7630890/sounds/sound220.mp3', 'https://dl.dropboxusercontent.com/u/7630890/sounds/sound220.ogg', 'https://dl.dropboxusercontent.com/u/7630890/sounds/sound220.wav'],
    volume : 1,
    onload : function(){
        soundCount++;

        if(soundCount === SOUND_MAX_COUNT) init();
    }
});


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


function init(){

    soundLoop();
    loop();
}

function loop(){

    app.update();

    requestAnimationFrame(loop);
}

function soundLoop(){

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
        app.start();
        if(isSoundPlay) sound440.play();


        setTimeout(soundLoop, soundLoopDuration);
    }


}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;