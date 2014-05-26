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
var side1, side2;
var rect, rect1, rect2;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var scaleFactor = backingScale(ctx);

var Form = function( ctx, x, y, rad ){
    _.bindAll(this, 'onUpdateTween', 'onCompleteTween');

    this.ctx = ctx;
    this.x   = x;
    this.y   = y;
    this.rad = rad;

    this.triangle();
    this.rect();
    this.circle();



    this.formType = {
        'triangle'  : this.trianglePts,
        'rectangle' : this.rectanglePts,
        'circle'    : this.circlePts
    };

    this.curType = 'circle';

    for(var i = 0; i < this.ptNumber; i++){
        this.pts[i] = {x: this.x, y: this.y}
    }
};


Form.prototype = {
    color : '#fff',
    ptNumber : 120,
    pts : [],

    oldPts : [],

    trianglePts  : [],
    rectanglePts : [],
    circlePts    : [],

    rate : 0,

    transform : function(toType){
        this.rate = 0;
        this.toType   = toType;

        TweenLite.to(this,.6, { rate: 1, ease: Power2.easeInOut, onComplete: this.onCompleteTween, onUpdate: this.onUpdateTween });
    },

    onUpdateTween : function(){

        for(var i = 0;i < this.ptNumber; i++){
            this.pts[i].x = ( 1- this.rate) * this.formType[this.curType][i].x + this.rate * this.formType[this.toType][i].x;
            this.pts[i].y = ( 1- this.rate) * this.formType[this.curType][i].y + this.rate * this.formType[this.toType][i].y;
        }
    },

    onCompleteTween : function(){
        for(var i = 0;i < this.ptNumber; i++){
            this.pts[i].x = this.formType[this.toType][i].x;
            this.pts[i].y = this.formType[this.toType][i].y;
        }

        this.curType = this.toType;
    },

    triangle : function(){
        var x, y, rate, pt;

        var pt0 = { x : this.rad * Math.cos(30 / 180 * Math.PI), y : this.rad * Math.sin(30 / 180 * Math.PI)};
        var pt1 = { x : this.rad * Math.cos(150 / 180 * Math.PI), y : this.rad * Math.sin(150 / 180 * Math.PI)};
        var pt2 = { x : this.rad * Math.cos(270 / 180 * Math.PI), y : this.rad * Math.sin(270/ 180 * Math.PI)};

        for(var i = 0; i < this.ptNumber; i++){

            if(i < this.ptNumber / 6){
                rate = .5 + i / (this.ptNumber / 6) * .5;
                x = pt0.x * (1 - rate) + pt1.x * rate;
                y = pt0.y * (1 - rate) + pt1.y * rate;
            }else if(i >= this.ptNumber /6 && i < this.ptNumber / 2){
                rate = (i - this.ptNumber/6) / (this.ptNumber / 3);
                x = pt1.x * (1 - rate) + pt2.x * rate;
                y = pt1.y * (1 - rate) + pt2.y * rate;
            }else if(i >= this.ptNumber /2 && i < this.ptNumber * 5 /6){
                rate = (i - this.ptNumber/2) / (this.ptNumber / 3);
                x = pt2.x * (1 - rate) + pt0.x * rate;
                y = pt2.y * (1 - rate) + pt0.y * rate;
            }else{
                rate = (i - this.ptNumber * 5/6) / (this.ptNumber / 3);
                x = pt0.x * (1 - rate) + pt1.x * rate;
                y = pt0.y * (1 - rate) + pt1.y * rate;
            }


            pt = {x : x + this.x, y: y + this.y};
            this.trianglePts.push(pt);
        }

    },

    rect : function(){
        var theta, pt;

        var side = this.rad * Math.cos(45 / 180 * Math.PI);

        for(var i = 0; i < this.ptNumber; i++){
            if(i < this.ptNumber / 8){
                pt = {x : side , y : side * i / (this.ptNumber / 8) };
            }else if(i >= this.ptNumber/8 && i < this.ptNumber * 3 / 8){
                pt = {x : side - side * (i - this.ptNumber / 8) / (this.ptNumber / 8), y : side };
            }else if( i >= this.ptNumber * 3 / 8 && i < this.ptNumber * 5 / 8) {
                pt = {x : -side , y : side - side * (i - 3 * this.ptNumber / 8) / (this.ptNumber / 8) };
            }else if( i >= this.ptNumber * 5 / 8 && i < this.ptNumber * 7 / 8) {
                pt = {x :-side + side * (i - 5 * this.ptNumber / 8) / (this.ptNumber / 8), y: -side};
            }else{
                pt = {x : side, y : -side + side * (i - 7 * this.ptNumber / 8) / (this.ptNumber / 8)};
            }

            pt.x += this.x;
            pt.y += this.y;

            this.rectanglePts.push(pt);
        }

    },


    circle : function(){
        var theta, pt;

        this.nextPts = [];

        for(var i = 0; i < this.ptNumber; i++){
            theta = i / this.ptNumber * 2 * Math.PI;
            pt = {x : this.rad * Math.cos(theta) + this.x, y : this.rad * Math.sin(theta) + this.y};
            this.circlePts[i] = pt;
        }
    },

    draw : function(){

        this.ctx.fillStyle = this.color;

        this.ctx.beginPath();

        this.ctx.moveTo(this.pts[0].x, this.pts[0].y);

        for(var i =  1; i < this.pts.length; i++){
            this.ctx.lineTo(this.pts[i].x, this.pts[i].y);
        }

        this.ctx.fill();
        this.ctx.closePath();

    },

};

var Panel = function(ctx, y){
    this.ctx = ctx;
    this.y   = y;
    this.height  = 30 * scaleFactor;

    this.pts = [];
    window.pts = this.pts;
}

Panel.prototype = {
    count : 0,

    draw : function(form){
        // calculate the rate
        var newPtArr = [];
        this.count++;
        if(this.count % 15 == 0){
            for(var i = 0; i < form.pts.length; i++){
                var pt = form.pts[i];

                var xRate = ( pt.x - (form.x - form.rad) ) / (form.rad * 2);
                var yRate = ( pt.y - (form.y - form.rad) ) / (form.rad * 2);

                var posX = window.innerWidth * scaleFactor + xRate*this.height ;
                var posY = yRate * this.height + this.y;

                var newPt = {x : posX, y: posY};

                newPtArr.push(newPt);
            }

            this.pts.push(newPtArr);
        }


        for(var i = 0; i < this.pts.length; i++){
            var ptArr = this.pts[i];
            for(var j = 0; j < ptArr.length; j++){
                //var pt = ptArr[j];
                ptArr[j].x -= 1;
            }
        }

        this.ctx.strokeStyle = 'rgba(255, 255, 255, .6)';
        this.ctx.beginPath();


        for(var i = 0; i < this.pts.length; i++){
            var ptArr = this.pts[i];

            this.ctx.moveTo( ptArr[0].x, ptArr[0].y);
            for(var j = 1; j < ptArr.length; j++){
                this.ctx.lineTo(ptArr[j].x, ptArr[j].y);
            }
        }

        this.ctx.stroke();
        this.ctx.closePath();

    }
};


// ---------------


width  = window.innerWidth * scaleFactor;
height = window.innerHeight * scaleFactor;

side1 = 100;
side2 = 180;

var duration1 = .8;
var duration2 = .6;

var types = ['triangle','rectangle', 'circle'];

canvas.width  = width;
canvas.height = height;

var form;
var panel;

init();

loop();


function init(){
    var rad = Math.min( width/3, height/3);
    form = new Form(ctx, width / 2, height / 2, rad );
    panel = new Panel(ctx, height / 2 + rad + 30 * scaleFactor);

    var nextType = form.curType;
    while(nextType == form.curType){
        nextType = types[parseInt(types.length * Math.random())];
    }

    form.transform(nextType);

    setInterval(function(){
        var nextType = form.curType;
        while(nextType == form.curType){
            nextType = types[parseInt(types.length * Math.random())];
        }

        form.transform(nextType);
    }, 800);
}



function loop(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    form.draw();
    panel.draw(form);

    requestAnimationFrame(loop);
}
