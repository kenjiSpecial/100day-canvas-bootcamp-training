// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================
var Circle = function(number, x){
    this.number = number;
    this.x = x;
    this.y = 120;
};

Circle.prototype = {
    rad       : 15,
    fillCol   : '#fff',
    fontCol   : '#333',
    fontStyle : "12px Arial",
    draw : function(){
        ctx.fillStyle = this.fillCol;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = this.fontStyle;
        ctx.fillStyle = this.fontCol;
        ctx.fillText(this.number, this.x, this.y);

    }
};

var Circles = function(){
    _.bindAll(this, 'binarySearch', 'shuffleDone');

    this.translate = 0;
    this.number = 101;
    this.kankaku = 50;
    this.circles = [];

    this.translate = width/2;

    for(var i = 0; i < this.number; i++ ){
        var circle = new Circle(i, i * this.kankaku);
        this.circles.push(circle);
    }

};

Circles.prototype = {
    startToSearch : function(){
        this.start = 0;
        this.end   = this.number - 1;    

        this.circles[this.shuffle.number].fillCol = '#e74c3c';

        this.binarySearch();
    },

    binarySearch : function(){
        if(this.start > this.end) return;

        var prev = this.middle;
        if(!prev) prev = 0;
        this.circles[prev].fillCol = '#fff';
        this.middle = parseInt((this.start + this.end)/2);
        if(this.middle != this.shuffle.number) this.circles[this.middle].fillCol = '#3498db';
        
        var xPos = this.middle * -1 * this.kankaku + width/2;
        var second = Math.abs((this.middle - prev) / 20) > .5 ? Math.abs((this.middle - prev)/20) : .5;
        var duration = (second + 1) * 1000; 
        var self= this;

        TweenLite.to(this, second, { translate: xPos});

        if(this.shuffle.number > this.middle){
            this.start = this.middle + 1;
            
            setTimeout(function(){
                self.binarySearch()
            }, duration)
            return;
        }

        if(this.shuffle.number < this.middle){
            this.end = this.middle - 1;
            setTimeout(function(){
                self.binarySearch()
            }, duration)
            return;
        }

        // setDone
        setTimeout(this.shuffleDone, duration);

    },

    shuffleDone : function(){
        this.circles[this.shuffle.number].fillCol = '#fff';

        this.shuffle.shuffleStart();
    },

    draw : function(){
        ctx.save();
        ctx.translate(this.translate, 0);
        this.circles.forEach(function(element){
            element.draw();
        });
        ctx.restore();
    }
};

var Shuffle = function(circles){
    _.bindAll(this, 'shuffle');
    
    this.number = 0;
    this.circles = circles;

    this.shuffleStart();
};

Shuffle.prototype = {
    fontStyle : 'bold 42px Arial',
    fontCol   : '#fff',

    shuffleStart : function(){
        this.shuffleCount = 0;
        this.shuffle();
    },

    shuffle : function(){
        this.number = parseInt(100 * Math.random());

        this.shuffleCount++;
        if(this.shuffleCount < 50) setTimeout(this.shuffle, 20);
        else                       {
               var self = this;
               setTimeout(function(){
                self.circles.startToSearch();
               }, 800) 
        }
    },

    draw : function(){


        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = this.fontStyle;
        ctx.fillStyle = this.fontCol;
        ctx.fillText(this.number, width/2, 20);
    }
};

// ================
var circles, shuffle;

init();
loop();

function init(){
    circles = new Circles();
    shuffle = new Shuffle();

    shuffle.circles = circles;
    circles.shuffle = shuffle;

    prevTime = +new Date;

}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    shuffle.draw();
    circles.draw();



    ctx.strokeStyle = '#fff';

    ctx.beginPath();
    ctx.moveTo(width/2, 85);
    ctx.lineTo(width/2, 95);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(width/2, 145);
    ctx.lineTo(width/2, 155);
    ctx.stroke();
    ctx.closePath();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
