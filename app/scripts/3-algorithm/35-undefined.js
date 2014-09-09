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
var Line = function(){
};

Line.prototype = {
    _theta1 : 0,
    _theta2 : 0,

    isBlack : false,
    opacity : Math.random() *.8,

    init1  : function(){
        this.y1 = .2 * height;
        this.y2 = .8 * height;

        this.x1 = Math.random() * width;
        this.x2 = Math.random() * width;

    },
    update : function(){
        if(this.isBlack) ctx.strokeStyle = "rgba(0, 0, 0, " + this.opacity * (Math.random()) + ")";
        else             ctx.strokeStyle = "rgba(255, 255, 255, " + this.opacity * (Math.random()) + ")";
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.closePath();

        ctx.stroke();
    },

    zero : function(){
        var opacity = Math.random() *.8;
        TweenLite.to(this, tweenAnimationDuration/2, {x1: width/2, x2: width/2, y1: height/2, y2: height/2, opacity: opacity, ease: "Power1.easeOut"});
        //TweenLite.to(this, tweenAnimationDuration/2, {x1: width * Math.random(), x2: width * Math.random(), y1: height * Math.random(), y2: height * Math.random(), ease: "Power1.easeOut"});
    },

    changeState0 : function(){
        var opacity = Math.random() *.8;
        var x1 = (.8 * Math.random() +.1) * width;
        var x2 = (.8 * Math.random() +.1)* width;
        var y1 = .2 * height;
        var y2 = .8 * height;

        TweenLite.to(this, tweenAnimationDuration, {x1: x1, x2: x2, y1: y1, y2: y2, opacity: opacity, ease: "Power1.easeOut"});
    },

    changeState1 : function(){
        var opacity = Math.random() *.8;

        var x1 = .2 * width;
        var x2 = .8 * width;
        var y1 = (.8 * Math.random() +.1) * height;
        var y2 = (.8 * Math.random() +.1)* height;

        TweenLite.to(this, tweenAnimationDuration, {x1: x1, x2: x2, y1: y1, y2: y2,opacity: opacity, ease: "Power1.easeOut"});
    },

    changeState2  : function(){
        var opacity = Math.random() *.8;

        var theta1 = 2 * Math.PI * Math.random();
        var theta2 = 2 * Math.PI * Math.random();

        this._theta1 = theta1;
        this._theta2 = theta2;

        var x1 = width / 2 + rad * Math.cos(theta1);
        var y1 = height /2 + rad * Math.sin(theta1);
        var x2 = width / 2 + rad * Math.cos(theta2);
        var y2 = height/2  + rad * Math.sin(theta2);

        TweenLite.to(this, tweenAnimationDuration, {x1: x1, x2: x2, y1: y1, y2: y2, opacity: opacity, ease: "Power1.easeOut"});
    },

    move0 : function(){
        var opacity = Math.random() *.8;
        TweenLite.to(this, tweenAnimationDuration, {x1: (Math.random() * .8 +.1) * width, x2: (Math.random() *.8 +.1) * width, opacity: opacity, ease: "Power1.easeOut"});
    },

    move1 : function(){
        var opacity = Math.random() *.8;
        TweenLite.to(this, tweenAnimationDuration, {y1: (Math.random() * .8 +.1) * height, y2: (Math.random() * .8 +.1) * height, opacity: opacity, ease: "Power1.easeOut"});
    },

    move2 : function(){
        var opacity = Math.random() *.8;
        var theta1 = 2 * Math.PI * Math.random();
        var theta2 = 2 * Math.PI * Math.random();

        TweenLite.to(this, tweenAnimationDuration, { theta1: theta1, theta2: theta2, opacity: opacity, ease: "Power1.easeOut"});
    },

    changeColor : function(){
        this.isBlack = !this.isBlack;
    }

};

Object.defineProperty(Line.prototype, 'theta1', {
    get : function(){
        return this._theta1;
    },

    set : function(val){
        this._theta1 = val;

        this.x1 = width / 2 + rad * Math.cos(val);
        this.y1 = height / 2 + rad * Math.sin(val);
    }
});

Object.defineProperty(Line.prototype, 'theta2', {
    get : function(){
        return this._theta2;
    },

    set : function(val){
        this._theta2 = val;

        this.x2 = width / 2 + rad * Math.cos(val);
        this.y2 = height / 2 + rad * Math.sin(val);
    }
});
var App = function(){
    this.lines = [];
    this.currentState = 0;

    for(var i = 0; i < 200; i ++){
        var line = new Line();
        line.init1();

        this.lines.push(line);
    }

}

App.prototype = {
    MAX_STAGE: 3,
    isBlack       : true,
    isChangeColor : false,
    rad           : 0,

    update : function(){
        if(this.isChangeColor){
            if(this.isBlack) ctx.fillStyle = "#000";
            else             ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(width/2, height/2, this.rad, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }

        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].update();
        }

    },

    changeState : function(){
        this.currentState = (this.currentState + 1) % this.MAX_STAGE;

        this.changeStates[this.currentState].call(this);
    },

    changeStates : [
        function(){
            for(var i = 0; i < this.lines.length; i++){
                this.lines[i].changeState0();
            }
        },
        function(){
            for(var i = 0; i < this.lines.length; i++){
                this.lines[i].changeState1();
            }
        },
        function(){
            for(var i = 0; i < this.lines.length; i++){
                this.lines[i].changeState2();
            }
        },
    ],

    changeColor : function(){
        this.isChangeColor = true;
        this.isBlack       = !this.isBlack;

        this.rad = 0;

        var rad = Math.sqrt(width/2 * width/2 + height/2 * height/2);
        TweenLite.to(this, tweenAnimationDuration, { rad: rad, ease: "Power1.easeOut"});

        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].changeColor();
        }
    },

    zero : function(){
        for(var i = 0; i < this.lines.length; i++){
            this.lines[i].zero();
        }
    },

    soundPlay : function(){
        this.soundPlays[this.currentState].call(this);
    },

    soundPlays : [

        function(){
            for(var i = 0; i < this.lines.length; i++){
                this.lines[i].move0();
            }
        },
        function(){
            for(var i = 0; i < this.lines.length; i++){
                this.lines[i].move1();
            }
        },
        function(){
            for(var i = 0; i < this.lines.length; i++){
                this.lines[i].move2();
            }
        }

    ]
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

    prevTime = +new Date;
    soundLoop();
    loop();
}

function loop(){

    if(isBlack) ctx.fillStyle = 'rgb(0, 0, 0)';
    else        ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, width, height);


    app.update();

    requestAnimationFrame(loop);
}

function soundLoop(){

    soundLoopCount++;

    if(soundLoopCount % 12 == 0)   {
        if(isSoundPlay)sound880.play();
        app.zero();

        setTimeout(function(){
            if(isSoundPlay)sound880.play();

            app.changeColor();
            app.changeState();

//            setTimeout(soundLoop, soundLoopDuration);
        }, soundLoopDuration/2);

        setTimeout(function(){
            isBlack = !isBlack;
        }, soundLoopDuration);


        setTimeout(soundLoop, soundLoopDuration);
    }else if(soundLoopCount % 4 == 0){
        if(isSoundPlay) sound880.play();
        app.changeState();

        setTimeout(soundLoop, soundLoopDuration);
    }else{
        if(isSoundPlay) sound440.play();
        app.soundPlay();

        setTimeout(soundLoop, soundLoopDuration);
    }


}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;