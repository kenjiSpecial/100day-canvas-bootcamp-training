// --------------------------

var width, height, prevTime;
var angularSpeed;
var renderer, camera, scene, plane;
var app, collections;
var canvas = document.getElementById('c');

angularSpeed = 0.2;
prevTime = (new Date()).getTime();

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;

// ================


var Collections = function(){
    _.bindAll(this, "start");

    this.widthNum = parseInt(width/this.side) + 1;
    this.heightNum = parseInt(height/this.side) + 1;

    console.log("width: " + this.widthNum + ", height: " + this.heightNum);

    this.planes = [];
    this.scores = [];
    var maxScore = 10;
    for(var yy = 0; yy < this.heightNum; yy++){
        this.planes[yy] = [];
        this.scores[yy] = [];
        for(var xx = 0; xx < this.widthNum; xx++){
            plane = new THREE.Mesh(new THREE.PlaneGeometry(this.side, this.side), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}));
            plane.position.x = xx * this.side - width/2;
            plane.position.y = yy * this.side - height/2;
            //plane.rotation.x = Math.PI/3;
            plane.rotation.y = -Math.PI;

            //plane.rotation.z= Math.PI/2;
            plane.overdraw = true;

            this.planes[yy][xx] = plane;
            scene.add(plane);

            //this.scores[yy][xx] = {x: xx, y: yy, score: yy};
            var score = parseInt(maxScore * Math.random());

            this.scores[yy][xx] = score;
            //maxScore = Math.max(maxScore, yy);
        }
    }

    this.maxScore = maxScore;
    // 0 : {x: 10, y: 10}, 1 : {}

    this.scorePosArr = [];
    for(var i = 0; i <= maxScore; i++){
        this.scorePosArr[i] = [];

        for(var yy = 0; yy < this.scores.length; yy++){
            for(var xx = 0; xx < this.scores[yy].length; xx++){
                if(i == this.scores[yy][xx]){
                    var pos = {x: xx, y: yy};

                    this.scorePosArr[i].push(pos);
                }
            }
        }
    };


    setTimeout(this.start, 2000);
};

Collections.prototype = {
    side : 100,
    count : 0,
    planes : null,

    update : function(){
        for(var yy = 0; yy < this.heightNum; yy++){
            for(var xx = 0; xx < this.widthNum; xx++){
                this.planes[yy][xx].position.x += Math.random() * 2 - 1;
                this.planes[yy][xx].position.y += Math.random() * 2 - 1;
                this.planes[yy][xx].position.z += Math.random() * 2 - 1;
            }
        }

    },

    start : function(){
        /*
        for(var yy = 0; yy < this.planes.length; yy++){
            for(var xx = 0; xx < this.planes[yy].length; xx++){
                TweenLite.to(this.planes[yy][xx].rotation, 1, {x: Math.PI* 2, delay:.4});
            }
        }*/

        for(var i = 0; i < this.scorePosArr[this.count].length; i++){
            var pos = this.scorePosArr[this.count][i];

            TweenLite.to(this.planes[pos.y][pos.x].rotation, .3 + Math.random() *.5, {x: Math.random() * Math.PI* 2, y: Math.random() * Math.PI, onComplete: function(){
                TweenLite.to(this.target,.5, {x: 0, y: 0, ease:"Power2.easeOut"})
            }});
        }


        this.count = (this.count + 1) % (this.maxScore + 1);
        if(this.count == 0){
            setTimeout(this.start,3000);
        }else{
            setTimeout(this.start,300);
        }

    }
};



// ================

init();
loop();

function init(){
    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize(width, height);

    // camera
    //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 5000 )
    //camera = new THREE.PerspectiveCamera( 15, 60, 100, 2000);
    //camera = new THREE.OrthographicCamera( width/-2, width/2, height/2, height/-2, 1, 1000);
    camera.position.y = 0;
    camera.position.z = 3000;
    //camera.rotation.x = 45 * (Math.PI / 180);

    scene = new THREE.Scene();

    camera.lookAt(scene.position);
    // plane
    collections = new Collections;

}

function loop(){
    var time = (new Date()).getTime();
    var dt = time - prevTime;

    /*
    camera.position.z += Math.random() * 20 - 10;
    camera.position.x = 300 * Math.cos(time/100);
    camera.position.y = 300 * Math.sin(time/100);
    */

    collections.update();

    renderer.render( scene, camera );

    requestAnimationFrame(loop);
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;