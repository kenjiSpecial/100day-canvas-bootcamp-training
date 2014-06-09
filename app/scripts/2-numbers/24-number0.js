// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================

var Point = function(x, y){
    this.x = this.origX = x;
    this.y = this.origY = y;
};

var AnimationPoint = function(ctx){
    this.ctx = ctx;
    this.x = this.origX = width/2;
    this.y = this.origY = height/2;

    this.isDraw = true;
};

AnimationPoint.prototype = {
    rad1   : height/2 * .6,
    theta1 : 0,

    rad2   : width /2 * .6,
    theta2 : 0,

    rad : 3,

    update : function(){
        this.theta1 += .04;
        this.theta2 += .02;

        this.x = this.origX + this.rad2 * Math.cos(this.theta2);
        this.y = this.origY + this.rad1 * Math.sin(this.theta1);

        if(this.isDraw) this.draw();
    },

    draw : function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fff';
        this.ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.closePath();
    }
};

var DIVIDE_X = 20;
var DIVIDE_Y = 20;

var Shape = function(ctx){
   this.ctx = ctx;
   this.nodeArr = []; 

   for(var i = 0; i < this.ny; i++){
       this.nodeArr[i] = [];

       for(var j = 0; j < this.nx; j++){
           var node = new Node();
           
           node.ox = node.x = i * width / DIVIDE_X;
           node.oy = node.y = j * height/ DIVIDE_Y;

           this.nodeArr[i].push(node);
       }
   }

   for(var i = 0; i < this.ny; i++){
       for(var j = 0; j < this.nx; j++){
           node = this.nodeArr[i][j];

           var bounds = [];

           bounds[0] = (i == 0)         ? true : false;
           bounds[1] = (j == this.nx-1) ? true : false;
           bounds[2] = (i == this.ny-1) ? true : false;
           bounds[3] = (j == 0)         ? true : false;

          // ===================== 

          node.nn[0] = ( bounds[0]              ) ? null : this.nodeArr[i - 1][j    ];
          node.nn[1] = ( bounds[0] || bounds[1] ) ? null : this.nodeArr[i - 1][j + 1];
          node.nn[2] = ( bounds[1]              ) ? null : this.nodeArr[i    ][j + 1];
          node.nn[3] = ( bounds[1] || bounds[2] ) ? null : this.nodeArr[i + 1][j + 1];
          node.nn[4] = ( bounds[2]              ) ? null : this.nodeArr[i + 1][j    ];
          node.nn[5] = ( bounds[3] || bounds[2] ) ? null : this.nodeArr[i + 1][j + 1];
          node.nn[6] = ( bounds[3]              ) ? null : this.nodeArr[i    ][j - 1];
          node.nn[7] = ( bounds[3] || bounds[0] ) ? null : this.nodeArr[i - 1][j - 1];

          var isFirst, oldNode;
          if(!this.first){
              this.first = node;
              oldNode = node;
          }else{
              oldNode.next = node;
              oldNode      = node;
          }
       }
   }
};

Shape.prototype = {
    first : null,

    col : '#444',
    count : 0,

    nx : DIVIDE_X + 1,
    ny : DIVIDE_Y + 1,

    SPRING : .2,
    FRICTION : .05,

    nodeArr : null,

    update : function(pt){

        var dx, dy, dist;
        var node = this.first;


        do{
           dx = node.ox - pt.x; 
           dy = node.oy - pt.y;

           dist = Math.sqrt(dx * dx + dy * dy) + 1;

           tx = node.ox + dx / dist * 10;
           ty = node.oy + dy / dist * 10;

           node.vx += (tx - node.x) * this.SPRING;
           node.vy += (ty - node.y) * this.SPRING;

           node.x += node.vx * this.FRICTION;
           node.y += node.vy * this.FRICTION;


        }while(node = node.next);
        

        this.draw();
    },
    
    draw : function(){
        var n1, n2, n3, n4;
        var node = this.first;

 
        this.count += 1;
        var col = this.count % 255;
       
        this.ctx.save();
        this.ctx.globalAlpha = .1;
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'hsl(' + col + ', 100%, 70%)';       
        do{
            var px = node.x;
            var py = node.y;

            n1 = node.nn[1];
            n2 = node.nn[2];
            n3 = node.nn[3];
            n4 = node.nn[4];
            
            if(n1){
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(n1.x, n1.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }

            if(n2){
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(n2.x, n2.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            
            if(n3){
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(n3.x, n3.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }

            if(n4){
                this.ctx.beginPath();
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(n4.x, n4.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
 

        }while(node = node.next);

        this.ctx.restore();

    }
};



var Node = function(){
    this.nn = [];
}

Node.prototype = {
    x : 0,
    y : 0,
    vx: 0,
    vy: 0,
    ox: 0,
    oy: 0,

    nn   : null,
    next : null,
};


// ================

var animationPt;
var shape;

init();
loop();

function init(){
    shape = new Shape(ctx);
    animationPt = new AnimationPoint( ctx); 
     
    ctx.fillStyle = 'rgb(30, 30, 30)';
    ctx.fillRect(0, 0, width, height);
    
    prevTime = +new Date;
}

function loop(){
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.fillStyle = 'rgba(30, 30, 30, .1)';
    ctx.fillRect(0, 0, width, height);

    animationPt.update();
    shape.update(animationPt);

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
