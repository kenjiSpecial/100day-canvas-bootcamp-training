window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;



// --------------------------


(function () {
    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.mix = x;
        this.miy = y;
    }

    var Boid = function(ctx){
        this.ctx = ctx;

        this.x   = width * Math.random();
        this.y   = height * Math.random();

        this.vx  = 0;
        this.vy  = 0;
    };

    Boid.prototype = {
        rad : 2,
        col : '#fff',

        update : function(){
            
        },

        draw : function(){
            this.ctx.fillStyle = this.col; 
            this.ctx.beginPath();
            this.ctx.arc( this.x, this.y, this.rad, 0, 2 * Math.PI, false );
            this.ctx.fill();
            this.ctx.closePath();
        }
        
    };

    var boids      = [];

    var NUM_BOIDS = 30;
    var NUM_BOIDS_EXC = NUM_BOIDS - 1;
    var BOID_SIDE = 40;
    var MAX_SPEED = 10;
    var MAX_DIStANCE = 150;



  
  var Circle = function(ctx){
        var centerX = 0;
        var centerY = 0;

        for(var i = 0;i < NUM_BOIDS; i++){
            centerX += boids[i].x;
            centerY += boids[i].y;
        }

        centerX /= NUM_BOIDS;
        centerY /= NUM_BOIDS;
        
        this.x = centerX;
        this.y = centerY;
  
  };
  
  Circle.prototype = {
    update : function(){
        var centerVelX = 0;
        var centerVelY = 0;

        for(var i = 0;i < NUM_BOIDS; i++){
            centerVelX += boids[i].vx;
            centerVelY += boids[i].vy;
        }

        centerVelX /= NUM_BOIDS;
        centerVelY /= NUM_BOIDS;
        
        this.x += centerVelX;
        this.y += centerVelY;
     
    }
  }


    function Particles(particles, context) {
        this.particles = particles;
        this.context = context;
    }

    Particles.prototype.draw = function () {
        for (var i = 0; i < this.particles.length; i++) {
            this.context.beginPath();
            this.context.fillStyle = "#fff";
            this.context.arc(this.particles[i].x, this.particles[i].y, 3, 0, 2 * Math.PI, false);
            this.context.fill();
            this.context.closePath();
        }
    };

    Particles.prototype.lineDraw = function(){
        for (var i = 0; i < this.particles.length; i++) {
            this.context.beginPath();
            this.context.strokeStyle = "rgba( 255, 255, 255, .6)";
            this.context.moveTo(this.particles[i].mix, this.particles[i].miy);
            this.context.lineTo(this.particles[i].x, this.particles[i].y);
            this.context.stroke();
            this.context.closePath();
        }
    }

    function getMousePos(canvas, evt) {
        var rect = rect = canvas.getBoundingClientRect();
//        new Particle( evt.clientX - rect.left, evt.clientY - rect.top);
        return  new Particle(evt.clientX - rect.left, evt.clientY - rect.top);
    }


    var mainCanvas, mainContext;

    var width = window.innerWidth;
    var height = window.innerHeight;

    var gridWidNums = 20 + 1;
    var gridHigNums = 20 + 1;

    var gripWid = width / (gridWidNums - 1);
    var gripHig = height / (gridHigNums - 1);

    var range = gripWid * 3;

    var particleArray = [];

    var grids;
    var circle;

    var speed = 50;
    var multiSpeed = 1;

    var drawCheck = false;


    mainCanvas = document.getElementById("c");
    mainCanvas.width = width;
    mainCanvas.height = height;

    mainContext = mainCanvas.getContext("2d");

    init();

    function init() {
        for (var _x = 0; _x < gridWidNums; _x++) {
            for (var _y = 0; _y < gridHigNums; _y++) {
                var posX = gripWid * _x;
                var posY = gripHig * _y;
                var particle = new Particle(posX, posY);
                particleArray.push(particle);
            }
        }
      

        grids = new Particles(particleArray, mainContext);
        grids.draw();

        for(var i = 0; i < NUM_BOIDS; i++){
            var boid = new Boid(mainContext);

            boids.push(boid);
        }


        circle = new Circle();
    }
  
 
  
    loop()

    function loop(){

        mainContext.fillStyle = "#333";
        mainContext.fillRect(0, 0, width, height);


      


        for(var i = 0; i < boids.length; i++){
            var b = boids[i];

            rule1(i);
            rule2(i);
            rule3(i);
          
            var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);

            var speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
            if(speed >= MAX_SPEED) {
                var r = MAX_SPEED / speed;
                b.vx *= r;
                b.vy *= r;
            }

                if(b.x < 0 && b.vx < 0 || b.x > width  && b.vx > 0) b.vx *= -1;
                if(b.y < 0 && b.vy < 0 || b.y > height && b.vy > 0) b.vy *= -1;
        
        
            b.x += b.vx;
            b.y += b.vy;


            b.draw();

        }

       circle.update();
      
        var particleNums = grids.particles.length;

          for (var i = 0; i < particleNums; i++) {
            var dx, dy, distance;
            var particle = grids.particles[i];
            
             dx = circle.x - particle.x;
             dy = circle.y - particle.y;
            
            distance = Math.sqrt(dx * dx + dy * dy);
              particle.x = (particle.x - (dx / distance) * (range / distance) * speed) - ((particle.x - particle.mix) / 2);
              particle.y = (particle.y - (dy / distance) * (range / distance) * speed) - ((particle.y - particle.miy) / 2);            
            
          
        }
        
            grids.draw();

        requestAnimationFrame(loop);
    }

    function rule1(index){
        var c = {x: 0, y: 0};

        for(var i = 0; i < boids.length; i++){

            if(i != index){
                c.x += boids[i].x;
                c.y += boids[i].y;
            }
        }

        c.x = c.x / NUM_BOIDS_EXC;
        c.y = c.y / NUM_BOIDS_EXC;

        boids[index].vx += (c.x - boids[index].x)/100;
        boids[index].vy += (c.y - boids[index].y)/100;
    }

    function rule2(index){
        for( var i = 0; i < boids.length; i++){
            var d = getDistance(boids[i], boids[index]);
            if(d < BOID_SIDE){
                boids[index].vx -= boids[i].x - boids[index].x;
                boids[index].vy -= boids[i].y - boids[index].y;
            }
        }
    }

    function rule3(index){
        var pv = {x: 0, y: 0};
        for(var i = 0; i < boids.length; i++){
            if(i != index){
                pv.x += boids[i].vx;
                pv.y += boids[i].vy;
            }
        }

        pv.x /= NUM_BOIDS_EXC;
        pv.y /= NUM_BOIDS_EXC;

        boids[index].vx += (pv.x - boids[index].vx) / 8;
        boids[index].vy += (pv.y - boids[index].vy) / 8;
    }

    function getDistance(p1, p2){
        var dx = p1.x - p2.x;
        var dy = p1.y -p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

})();
