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

var Forms = function(ctx, x, y){
    _.bindAll(this, 'onUpdateInitTween', 'onCompleteInitTween', 'onUpdateIncrementTween', 'onCompleteIncrementTween', 'increment');

    this.MAX_RAD = Math.min(window.innerWidth / 3, window.innerHeight / 3);
    this.ctx = ctx;
    this.x   = x;
    this.y   = y;

    this.currentNumber =   0;
    this.pointNumber = 288 * 3;
    this.numberArr = [1, 4, 9, 16];

    this.isTransfrom = false;

    this.initialize();

    this.pts = [];

    //types = ['triangle','rectangle', 'circle'];

    this.formType = {
        'triangle'  : this.trianglePts,
        'rectangle' : this.rectanglePts,
        'circle'    : this.circlePts
    };

    this.currentType = ['circle'];

    for(var i = 0; i < this.pointNumber; i++){
        this.pts[i] = {x: this.x, y: this.y}
    };
};

Forms.prototype = {
    color : '#fff',

    trianglePts  : [],
    rectanglePts : [],
    circlePts    : [],

    initialize : function(){
        this.initializeCircle();

        this.initializeAnimation();
    },



    initializeCircle : function(){
        var side, number, pointNumber, rad, centerPoint;
        var points, theta, pt;
        var arr = this.numberArr;

        for(var i = 0; i < arr.length; i++){
            number = this.numberArr[i];
            side = Math.sqrt(arr[i]);
            rad = this.MAX_RAD / side;
            pointNumber = this.pointNumber / side;


            // 1 2 3 4
            points = [];
            console.log(this.x);
            console.log(side);
            for(var x = 0; x < side; x++){
                for(var y = 0; y < side; y++){
                    var center = (side - 1)/ 2;
                    centerPoint = { x : this.x + 2 * rad * (x - center), y : this.y + 2 * rad * (y - center) };

                    for(var j = 0; j < (this.pointNumber / number); j++){
                        theta = j / (this.pointNumber / number) * 2 * Math.PI;
                        pt = {x : rad * Math.cos(theta) + centerPoint.x, y : rad * Math.sin(theta) + centerPoint.y};
                        points.push(pt);
                    }
                }
            }
            this.circlePts.push(points);
        }

    },

    initializeAnimation : function(){
        this.rate = 01
        this.toType   = 'circle';


        TweenLite.to(this,.6, { rate: 0, ease: Power2.easeInOut, onComplete: this.onCompleteInitTween, onUpdate: this.onUpdateInitTween });
    },

    onUpdateInitTween : function(){

        for(var i = 0;i < this.pointNumber; i++){
            this.pts[i].x = (1-this.rate) * this.formType[this.toType][this.currentNumber][i].x + (this.rate) * this.x;
            this.pts[i].y = (1-this.rate) * this.formType[this.toType][this.currentNumber][i].y + (this.rate) * this.y;
        }
    },

    onCompleteInitTween : function(){
        for(var i = 0;i < this.pointNumber; i++){
            this.pts[i].x = this.formType[this.toType][this.currentNumber][i].x;
            this.pts[i].y = this.formType[this.toType][this.currentNumber][i].y;
        }

        this.curType = this.toType;

        var self = this;
        setTimeout(function(){
            self.increment();
        }, 300);
    },


    increment : function(){
        this.currentNumber = (this.currentNumber + 1) % this.numberArr.length ;

        this.isTransfrom = true;

        this.rate = 0;
        TweenLite.to(this, .6, { rate: 1, ease: Power2.easeInOut, onComplete: this.onCompleteIncrementTween, onUpdate: this.onUpdateIncrementTween });
    },

    onUpdateIncrementTween : function(){
        var prevNumber = this.currentNumber - 1;
        if(prevNumber < 0) prevNumber += this.numberArr.length;

        for(var i = 0;i < this.pointNumber; i++){
            this.pts[i].x = this.rate * this.formType[this.toType][this.currentNumber][i].x + (1 - this.rate) * this.formType[this.toType][prevNumber][i].x;
            this.pts[i].y = this.rate * this.formType[this.toType][this.currentNumber][i].y + (1 - this.rate) * this.formType[this.toType][prevNumber][i].y;
        }
    },

    onCompleteIncrementTween : function(){
        this.isTransfrom = false;
        for(var i = 0;i < this.pointNumber; i++){
            this.pts[i].x = this.formType[this.toType][this.currentNumber][i].x;
            this.pts[i].y = this.formType[this.toType][this.currentNumber][i].y;
        }

        TweenLite.to(this, .6, { rate: 0, ease: Power2.easeInOut, onComplete: this.increment});
    },

    draw : function(){



        if(this.isTransfrom){

            var previousNumber = this.currentNumber - 1;
            if(previousNumber < 0) previousNumber += this.numberArr.length;

            currentNumber = this.numberArr[previousNumber];
            inc           = this.pointNumber / currentNumber;

            for(var i = 0; i < this.pointNumber  ; i+= inc){
                this.ctx.fillStyle = 'rgba(255, 255, 255, ' + (1-this.rate) + ")" ;

                this.ctx.beginPath();

                this.ctx.moveTo(this.pts[i].x, this.pts[i].y);

                for(var j = 1; j < inc; j++){
                    this.ctx.lineTo(this.pts[i + j].x, this.pts[i + j].y);
                }

                this.ctx.fill();
                this.ctx.closePath();
            }


        }else{
            var currentNumber = this.numberArr[this.currentNumber];
            var inc           = this.pointNumber / currentNumber;

            for(var i = 0; i < this.pointNumber  ; i+= inc){
                this.ctx.fillStyle = 'rgba(255, 255, 255, ' +  (1-this.rate )+ ")" ;

                this.ctx.beginPath();

                this.ctx.moveTo(this.pts[i].x, this.pts[i].y);

                for(var j = 1; j < inc; j++){
                    this.ctx.lineTo(this.pts[i + j].x, this.pts[i + j].y);
                }

                this.ctx.fill();
                this.ctx.closePath();
            }
        }


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

var forms;

init();

loop();


function init(){
    forms = new Forms(ctx, width / 2, height / 2 );

}



function loop(){
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    forms.draw();

    requestAnimationFrame(loop);
}
