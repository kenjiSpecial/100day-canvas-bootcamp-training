function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var width, height, previousTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);

width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

canvas.width  = width;
canvas.height = height;

init();

loop();

function init(){
    previousTime = +new Date;
    console.log(previousTime);
}


function loop(){


    requestAnimationFrame(loop);
}


var Rect = function(x, y, wid, hig){

};

Rect.prototype = {
    update : function(dt){

    }
};

