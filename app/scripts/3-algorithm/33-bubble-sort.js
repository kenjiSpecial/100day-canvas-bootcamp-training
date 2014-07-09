// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

var randoms;


// ================
var Circle = function(num, x, y){
    this.number = num;
    var colNum = parseInt(this.number);
    this.col = 'rgb(' + colNum + ', ' + colNum + ', ' + 0 + ')';
    this.rad = 10;

    this.x = x;
    this.y = y;
};

Circle.prototype = {
    draw : function(){
        ctx.fillStyle = this.col;
        ctx.strokeStyle = '#fff';

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
    },

    transform : function(xPos){
        TweenLite.to(this,.2, {x: xPos});
    },

    slowTransform : function(xPos){
        TweenLite.to(this, 1.4, {x: xPos});
    }
};

var side = 80;

var Circles = function(){

    this.circleArr = [];
    this.NUM = parseInt(width / side) - 1;

    if(typeof randoms === 'undefined'){
        randoms = [];
        for(var i = 0; i < this.NUM; i++){
            randoms.push(Math.random() * 255);
        }
    }

    for(var i = 0; i < this.NUM; i++){

        var circle = new Circle( randoms[i], side + side * i, this.y);
        this.circleArr.push(circle);
    }

    //this.bubbleSort();
};

Circles.prototype = {
    y : height/2,
    NUM : null,
    k : 0,

    draw : function(){
        this.circleArr.forEach(function(element){
            element.draw();
        });
    }
};

var Circles1 = function(){
    this.y = height/4;
    Circles.call(this);

    _.bindAll(this, 'bubbleSort');
    this.bubbleSort();
};

Circles1.prototype = Object.create(Circles.prototype);

Circles1.prototype.bubbleSort = function(){

    for(var i = 0; i < this.NUM-1-this.k; i++){
        if(this.circleArr[i].number > this.circleArr[i+1].number){
            var temp = this.circleArr[i];
            this.circleArr[i] = this.circleArr[i+1];
            this.circleArr[i+1] = temp;

            this.circleArr[i].transform(this.circleArr[i+1].x);
            this.circleArr[i+1].transform(this.circleArr[i].x);


            setTimeout(this.bubbleSort, 300);

            return;
        }
    }
};

var Circles2 = function(){
    this.y = height * 3/4;
    Circles.call(this);

    _.bindAll(this, 'quickSort');

    this.quickSort(0, this.circleArr.length);
};

Circles2.prototype = Object.create(Circles.prototype);

Circles2.prototype.quickSort = function(start, end){


    if(start >= end) return;


    var left = [], right = [], pivot = this.circleArr[start];


    for(var i = start + 1; i < end; i++){
        this.circleArr[i].number < pivot.number ? left.push(this.circleArr[i]) : right.push(this.circleArr[i]);
    }

    var leftNum = left.length + start;
    var rightNum = leftNum + 1;

    if(start > 0 && end <  this.circleArr.length){
        var temp1 = this.circleArr.slice(0, start);
        var temp2 = this.circleArr.slice(end, this.circleArr.length);

        this.circleArr = temp1.concat(left, pivot, right, temp2);

    }else if(start > 0){
        var temp = this.circleArr.slice(0, start);
        this.circleArr = temp.concat(left, pivot, right);
    }else if(end < this.circleArr.length){
        var temp = this.circleArr.slice(end, this.circleArr.length);
        this.circleArr = left.concat(pivot, right, temp);

    }else{
        this.circleArr = left.concat(pivot, right);
    }

    for(var i = 0; i < this.circleArr.length; i++){
        var xPos = side + side * i;
        if(xPos != this.circleArr[i].x) this.circleArr[i].slowTransform(xPos);
    }


    var self=this;
    setTimeout(function(){
        self.quickSort(start, leftNum);
        self.quickSort(rightNum, end);
    }, 1500);

    /*
    for (var i = 1; i < a.length; i++) {
        a[i] < pivot ? left.push(a[i]) : right.push(a[i]);
    }

    return qsort(left).concat(pivot, qsort(right));*/

}

// ================
var circles1, circles2;
var circles;

init();
loop();

function init(){
    circles = new Circles();

    circles1 = new Circles1();
    circles2 = new Circles2();

    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    circles.draw();
    circles1.draw();
    circles2.draw();

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;