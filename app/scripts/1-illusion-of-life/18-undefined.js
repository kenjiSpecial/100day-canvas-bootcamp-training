
// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

var dtr = function(v) {return v * Math.PI/180;}
var camera = {
    focus : 100,
    self : {
        x : 0,
        y : 0,
        z : 0
    },
    rotate : {
        x : 0,
        y : 0,
        z : 0
    },
    up : {
        x : 0,
        y : 1,
        z : 0
    },
    zoom : 1,
    display : {
        x : width/2,
        y : height/2,
        z : 0
    }
};

var Point = function(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
};



var Shape = function(ctx, z){
    _.bindAll(this, 'updateRotation', 'onTweenComplete');

    this.normalPtArr = this.ptArr = [];
    this.ctx = ctx;

    this.x = 0;
    this.y = 0;
    this.z = z;

    this.theta = Math.PI / 2;


    var side = this.side    = 200;
    this.sideNum = 3;

    //    200              200
    // ----------      ----------
    // \        /     |          |
    //  \      /      |          |
    //   \    /       |          |
    //    \  /        |          |
    //     \/          ----------
    //  triangle


    var angle = function(number){

      return (number - 2) / Math.PI / number / 2
    };


    this.sideList = {
        3 : side / Math.cos(angle(3)),
        4 : side / Math.cos(angle(4)),
        5 : side / Math.cos(angle(5)),
        6 : side / Math.cos(angle(6))
    };

    var gosa=0;
    switch(this.sideNum){
      case 3:
        gosa = -90 / 180 * Math.PI;
        break;
    }

    for(var i = 0; i < this.sideNum; i++){
      var theta = i / this.sideNum * 2 * Math.PI;
      var pt = new Point( this.sideList[this.sideNum] * Math.cos(theta + gosa), this.sideList[this.sideNum] * Math.sin(theta + gosa), 0);
      this.normalPtArr.push(pt);
    }

    this.translateZ = this.originTranslateZ = this.sideList[this.sideNum];
    this.theta = Math.PI/2;

    var self = this;
    this.count = 0;
    this.sideNum = 0;

    setTimeout(function(){
      self.updateRotation(0);
    } , 1000);
};

Shape.prototype = {
    updateRotation : function(){
        this.count++;
        if(this.count % 2 == 0) TweenLite.to(this, .5, {theta: Math.PI/2, translateZ: this.originTranslateZ, onComplete: this.onTweenComplete});
        else{
            TweenLite.to(this, .5, {theta: 0, translateZ: 0});
            setTimeout(this.updateRotation, 600);
        }
    },

    onTweenComplete : function(){
        this.sideNum = (this.sideNum + 1) % 4;
        var sideNum = this.sideNum + 3;


        var rad = this.sideList[sideNum];

        var gosa=0;
        switch(sideNum){
            case 3:
                gosa = -90 / 180 * Math.PI;
                break;
            case 4:
                gosa = 45 / 180 * Math.PI;
                break;
        }

        this.normalPtArr = [];

        for(var i = 0; i < sideNum; i++){
            var theta = i / sideNum * 2 * Math.PI;
            var pt = new Point( rad * Math.cos(theta + gosa), rad * Math.sin(theta + gosa), 0);
            this.normalPtArr.push(pt);
        }

        this.translateZ = this.originTranslateZ = rad * Math.cos( Math.PI / (sideNum * 2) );
        this.theta = Math.PI/2;

        this.updateRotation();

    },

    duration : 0,

    update : function(dt){
      this.duration += dt;
      this.ctx.fillStyle = '#fff';
      this.ctx.strokeStyle = '#fff';

      var side  = this.side * scale;

      this.ctx.save();

      this.ctx.translate(camera.display.x, camera.display.y);
      this.ctx.rotate(this.duration/3);

      this.ctx.beginPath();

      for(var i = 0; i < this.ptArr.length; i++){
        var pt = this.ptArr[i];

        var scale = ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - pt.z))* camera.zoom;

        var xPos = pt.x * scale;
        var yPos = pt.y * scale;

        if(i == 0){
          this.ctx.moveTo(xPos, yPos);
        }else{
          this.ctx.lineTo(xPos, yPos);
        }
      }

      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.restore();
    }
};

Object.defineProperty(Shape.prototype, 'theta', {
  get : function(){
    return this._theta;
  },

  set : function(val){
    this._theta = val;

    this.ptArr = [];
    for(var i = 0; i < this.normalPtArr.length; i++){
      var normalPt = this.normalPtArr[i];

      var rotateX = normalPt.x;
      var rotateY = Math.cos(val) * normalPt.y - Math.sin(val) * normalPt.z;
      var rotateZ = Math.sin(val) * normalPt.y + Math.cos(val) * normalPt.z;

      var rotatePt = new Point(rotateX, rotateY, rotateZ - this.translateZ);
      this.ptArr.push(rotatePt);
    }

  }
});

// ================

init();
loop();

var shape;

function init(){

    prevTime = +new Date;
    shape = new Shape(ctx, 1000);
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    shape.update(duration);

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
