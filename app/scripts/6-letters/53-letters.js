// k
var kArr = [ [0.39049999999999996, 0.05], [0.39049999999999996, 0.39549999999999996], [0.39299999999999996, 0.39549999999999996], [0.5670000000000001, 0.05], [0.8165, 0.05], [0.5895, 0.4435], [0.8440000000000001, 0.95], [0.5770000000000001, 0.95], [0.4395, 0.636], [0.39050000000000007, 0.7115], [0.39050000000000007, 0.95], [0.156, 0.95], [0.156, 0.05], [0.39049999999999996, 0.05] ]
// e
var eArr = [ [0.7609999999999999, 0.05], [0.7609999999999999, 0.2415], [0.462, 0.2415], [0.462, 0.39549999999999996], [0.742, 0.39549999999999996], [0.742, 0.5794999999999999], [0.462, 0.5794999999999999], [0.462, 0.7585], [0.772, 0.7585], [0.772, 0.95], [0.2275, 0.95], [0.2275, 0.05], [0.7609999999999999, 0.05] ];
// n
var nArr = [ [0.4445, 0.05], [0.596, 0.6045], [0.5985, 0.6045], [0.5985, 0.05], [0.818, 0.05], [0.818, 0.95], [0.5609999999999999, 0.95], [0.40399999999999997, 0.39399999999999996], [0.40149999999999997, 0.39399999999999996], [0.40149999999999997, 0.95], [0.1825, 0.95], [0.1825, 0.05], [0.4445, 0.05] ] ;
// j
//var jArr = [ [0.7795000000000001, 0.6595], [0.7065, 0.885, 0.7795000000000001, 0.7665000000000001, 0.755, 0.8415], [0.49050000000000005, 0.95, 0.6575, 0.9285, 0.5855, 0.95], [0.28300000000000003, 0.878, 0.39350000000000007, 0.95, 0.3245, 0.9259999999999999], [0.22100000000000006, 0.6669999999999999, 0.24150000000000005, 0.83, 0.22100000000000006, 0.7595000000000001], [0.22100000000000006, 0.6485], [0.42950000000000005, 0.6485], [0.42950000000000005, 0.6919999999999998], [0.44650000000000006, 0.7765, 0.42950000000000005, 0.7339999999999999, 0.435, 0.7624999999999998], [0.48950000000000005, 0.7974999999999999, 0.4575000000000001, 0.7905, 0.47200000000000003, 0.7974999999999999], [0.5325, 0.7765, 0.507, 0.7974999999999999, 0.521, 0.7904999999999999], [0.5495, 0.6919999999999998, 0.5435, 0.7624999999999998, 0.5495, 0.7344999999999999], [0.5495, 0.05], [0.7805000000000001, 0.05], [0.7805000000000001, 0.6595] ];
var jArr = [ [0.7795000000000001, 0.6595], [0.7795000000000001, 0.7665000000000001, 0.755, 0.8415,0.7065, 0.885], [0.6575, 0.9285, 0.5855, 0.95,0.49050000000000005, 0.95], [0.39350000000000007, 0.95, 0.3245, 0.9259999999999999,0.28300000000000003, 0.878], [0.24150000000000005, 0.83, 0.22100000000000006, 0.7595000000000001,0.22100000000000006, 0.6669999999999999], [0.22100000000000006, 0.6485], [0.42950000000000005, 0.6485], [0.42950000000000005, 0.6919999999999998], [0.42950000000000005, 0.7339999999999999, 0.435, 0.7624999999999998,0.44650000000000006, 0.7765], [0.4575000000000001, 0.7905, 0.47200000000000003, 0.7974999999999999,0.48950000000000005, 0.7974999999999999], [0.507, 0.7974999999999999, 0.521, 0.7904999999999999,0.5325, 0.7765], [0.5435, 0.7624999999999998, 0.5495, 0.7344999999999999,0.5495, 0.6919999999999998], [0.5495, 0.05], [0.7805000000000001, 0.05], [0.7805000000000001, 0.6595] ];
// i
var iArr = [ [0.617, 0.05], [0.617, 0.95], [0.38299999999999995, 0.95], [0.38299999999999995, 0.05], [0.617, 0.05] ] ;


var kenjiArr = [kArr, eArr, nArr, jArr, iArr];

var size = 400;
if(size > window.innerHeight) size = window.innerHeight * .8;
var textNumber = 360;
var kenjiPtArrs = [];

for(var ii = 0; ii < kenjiArr.length; ii++){
    kenjiPtArrs[ii] = [];

    var kankakuDuration = parseInt(textNumber / kenjiArr[ii].length) + 1;
    var curNumber = textNumber;

    for(var jj = 0; jj < kenjiArr[ii].length; jj++){
        for(var kk = 0; kk < kankakuDuration; kk++){
            var ptX, ptY;

            var rate = kk / kankakuDuration;
            var curNum = jj;
            var nextNum = (jj + 1) % kenjiArr[ii].length;

            if(kenjiArr[ii][nextNum].length == 6){
                //ptX = kenjiArr[ii][curNum][0] * size * (1 - rate) +  kenjiArr[ii][nextNum][0] * size * rate;
                //ptY = kenjiArr[ii][curNum][1] * size * (1 - rate) +  kenjiArr[ii][nextNum][1] * size * rate;
                var x1, y1, x2, y2, x3, y3, x4, y4;
                if(kenjiArr[ii][curNum].length == 2){
                    x1 = kenjiArr[ii][curNum][0] * size;
                    y1 = kenjiArr[ii][curNum][1] * size;
                }else if(kenjiArr[ii][curNum].length == 6){
                    x1 = kenjiArr[ii][curNum][4] * size;
                    y1 = kenjiArr[ii][curNum][5] * size;
                }

                x2 =  kenjiArr[ii][nextNum][0] * size;
                y2 =  kenjiArr[ii][nextNum][1] * size;
                x3 =  kenjiArr[ii][nextNum][2] * size;
                y3 =  kenjiArr[ii][nextNum][3] * size;
                x4 =  kenjiArr[ii][nextNum][4] * size;
                y4 =  kenjiArr[ii][nextNum][5] * size;


                ptX = x1 * (1 - rate) * (1 - rate) * (1 - rate) + x2 * 3 * (1-rate) * (1-rate) * rate + x3 * 3 * (1 -rate) * rate * rate + rate * rate * rate * x4;
                ptY = y1 * (1 - rate) * (1 - rate) * (1 - rate) + y2 * 3 * (1-rate) * (1-rate) * rate + y3 * 3 * (1 -rate) * rate * rate + rate * rate * rate * y4;

            }else{
                if(kenjiArr[ii][curNum].length == 2){
                    ptX = kenjiArr[ii][curNum][0] * size * (1 - rate) +  kenjiArr[ii][nextNum][0] * size * rate;
                    ptY = kenjiArr[ii][curNum][1] * size * (1 - rate) +  kenjiArr[ii][nextNum][1] * size * rate;
                }else if(kenjiArr[ii][curNum].length == 6){
                    ptX = kenjiArr[ii][curNum][4] * size * (1 - rate) +  kenjiArr[ii][nextNum][0] * size * rate;
                    ptY = kenjiArr[ii][curNum][5] * size * (1 - rate) +  kenjiArr[ii][nextNum][1] * size * rate;
                }
            }

            var pos = {x: ptX - size/2, y: ptY - size/2};
            kenjiPtArrs[ii].push(pos);
        }
        curNumber -= kankakuDuration;
        if(kankakuDuration > curNumber) kankakuDuration = curNumber;
    }
}





// --------------------------

var width, height, prevTime;
var canvas = document.getElementById('c');
var ctx    = canvas.getContext('2d');
var rot = 0;

width = window.innerWidth;
height = window.innerHeight;

canvas.width  = width;
canvas.height = height;


// ================

var Line = function(){
    this.x0 = 0;
    this.x1 = width;

    this.velY = 2;

    this.y = 0;
};

Line.prototype = {
    update : function(){
        this.y += this.velY;

        if(this.y > height){
            this.y = height;
            this.velY = -2;
        }

        if(this.y < 0){
            this.y = 0;
            this.velY = 2;
        }
    },

    draw : function(){
        ctx.save();
        ctx.strokeStyle = "#ffffff";
        ctx.moveTo(this.x0, this.y);
        ctx.lineTo(this.x1, this.y);
        ctx.stroke();
        ctx.restore();
    }


};

// ================


var count = 0;
var curPtArr = [];
var rate;
var line;

init();
loop();


function init(){
    line = new Line();

    prevTime = +new Date;

    for(var i = 0; i < kenjiPtArrs[count].length; i++){
        var pt = { x: kenjiPtArrs[count][i].x, y : kenjiPtArrs[count][i].y };
        curPtArr.push(pt);
    }

    //setTimeout(timer, 500);
}

function loop(){
    line.update();

    rot += .1;
    var curTime = +new Date;
    var duration = (curTime - prevTime)/1000;
    prevTime = curTime;

    ctx.globalCompositeOperation="source-over";
    ctx.fillStyle = 'rgba(30, 30, 30, .3)';
    ctx.fillRect(0, 0, width, height);

    for(var n = 0; n < 3; n++){
        ctx.save();
        ctx.globalCompositeOperation="lighter";
        ctx.beginPath();

        //ctx.rotate(rot);
        ctx.translate(width/2, height/2)

        if(n == 0) ctx.fillStyle = "rgba(200, 0, 0,1)";
        if(n == 1) ctx.fillStyle = "rgba(200, 200, 0, 1)";
        if(n == 2) ctx.fillStyle = "rgba(0, 0, 200, 1)";

        var biv;
        for(var i = 0; i < curPtArr.length; i++){

            if(line.y - height/2 > curPtArr[i].y) biv = 0;
            else                       biv = 10;
            if(i == 0) ctx.moveTo( curPtArr[i].x + Math.random() * biv, curPtArr[i].y+ Math.random() * biv);
            else       ctx.lineTo( curPtArr[i].x + Math.random() * biv, curPtArr[i].y + Math.random() * biv);

        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    line.draw();

    requestAnimationFrame(loop);
}

function timer(){
    rate = 0;
    TweenLite.to(this,.75, {rate: 1, onUpdate: onUpdateTweenHandler, onComplete: onCompleteTwennHandler, ease:Elastic.easeInOut});

    setTimeout(timer, 1000);
}

function onUpdateTweenHandler(){
    var nextCount = (count + 1) % kenjiPtArrs.length;
    for(var i = 0; i < 360; i++){

        var xPos = kenjiPtArrs[count][i].x * (1-rate) + kenjiPtArrs[nextCount][i].x * rate;
        var yPos = kenjiPtArrs[count][i].y * (1-rate) + kenjiPtArrs[nextCount][i].y * rate;
        curPtArr[i] = {x: xPos, y: yPos};
    }

}

function onCompleteTwennHandler(){
    count = (count + 1) % kenjiPtArrs.length;
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;