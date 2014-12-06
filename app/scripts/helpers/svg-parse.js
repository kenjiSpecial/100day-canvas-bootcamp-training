var l1pt0 = "M138.1,106.8h-8.5l-2,6.2h-4.5l8.5-24.1h4.6l8.5,24.1h-4.5L138.1,106.8z";
var l1pt1 = "M133.9,93.1c0,0-0.5,2.4-1,3.7l-2.1,6.5h6.3l-2.1-6.5C134.5,95.5,133.9,93.1,133.9,93.1L133.9,93.1z";
var l2pt0 = "M151.2,88.9h7.8c2.6,0,3.8,0.2,4.9,0.7c2.4,1.1,3.9,3.4,3.9,6.6c0,2.9-1.5,5.6-4.1,6.6v0.1c0,0,0.3,0.3,0.8,1.2l5,9h-4.9l-4.8-9h-4.2v9h-4.4L151.2,88.9L151.2,88.9z";
var l2pt1 = "M159.5,100.2c2.3,0,3.8-1.4,3.8-3.8c0-2.3-1-3.7-4.4-3.7h-3.3v7.5L159.5,100.2L159.5,100.2z";
var l3pt0 = "M177,88.9h8.2c7.4,0,12.3,4.4,12.3,12c0,7.6-4.9,12.1-12.3,12.1H177V88.9z";
var l3pt1 = "M184.9,109.3c4.9,0,8-2.9,8-8.3c0-5.4-3.2-8.3-8-8.3h-3.6v16.6H184.9z";
var l4    = "M205.3,106.8c0,0,2.6,2.6,6,2.6c1.8,0,3.5-0.9,3.5-2.9c0-4.3-11.4-3.6-11.4-11c0-4,3.5-7,8.1-7c4.8,0,7.2,2.6,7.2,2.6l-1.9,3.6c0,0-2.3-2.1-5.3-2.1c-2,0-3.6,1.2-3.6,2.9c0,4.3,11.4,3.2,11.4,11c0,3.8-2.9,7.1-8,7.1c-5.4,0-8.3-3.3-8.3-3.3L205.3,106.8z";
var l5    = "M88.7,88.9l-4,16.7c-0.3,1.4-0.4,2.5-0.4,2.5h-0.1c0,0-0.1-1.2-0.4-2.5l-4.3-16.7h-3.8l-4.4,16.7c-0.4,1.4-0.4,2.5-0.4,2.5h-0.1c0,0-0.1-1.2-0.4-2.5l-2.8-12.5l-2.1,9.1l2.7,10.8h5.1l3.7-14.3c0.4-1.6,0.6-3.2,0.6-3.2h0.1c0,0,0.2,1.6,0.6,3.2l3.7,14.3H87l6.2-24.1L88.7,88.9L88.7,88.9z";
var l6    = "M115.9,88.9l-4,16.7c-0.3,1.4-0.4,2.5-0.4,2.5h-0.1c0,0-0.1-1.2-0.4-2.5l-4.3-16.7h-3.8l-4.4,16.7c-0.4,1.4-0.4,2.5-0.4,2.5H98c0,0-0.1-1.2-0.4-2.5L94.8,93l-2.1,9.1l2.7,10.9h5.1l3.7-14.3c0.4-1.6,0.6-3.2,0.6-3.2h0.1c0,0,0.2,1.6,0.6,3.2l3.7,14.3h5.1l6.2-24.1H115.9L115.9,88.9z";
var l7    = "M26,106.8h-8.5l-2,6.2H11l8.5-24.1h4.6l8.5,24.1h-4.5L26,106.8z M21.8,93.1c0,0-0.5,2.4-1,3.7l-2.1,6.5h6.3l-2.1-6.5C22.4,95.5,21.8,93.1,21.8,93.1L21.8,93.1z";
var l8    = "M56.5,105.6c0.4,1.4,0.4,2.5,0.4,2.5H57c0,0,0.1-1.2,0.4-2.5l4-16.7h4.5L59.7,113h-5.1l-3.7-14.3c-0.4-1.6-0.6-3.2-0.6-3.2h-0.1c0,0-0.2,1.6-0.6,3.2L45.9,113h-5.1l-6-24.1h4.5l3.8,16.7c0.3,1.4,0.4,2.5,0.4,2.5h0.1c0,0,0.1-1.2,0.4-2.5l4.4-16.7h3.8L56.5,105.6z";


var left = 11;
var top  = 88;
var width = 215;
var height = 26;

function parsePathData(pathData)
{
    var tokenizer = /([a-z]+)|([+-]?(?:\d+\.?\d*|\.\d+))/gi,
        match,
        current,
        commands = [];

    tokenizer.lastIndex = 0;
    while (match = tokenizer.exec(pathData))
    {
        if (match[1])
        {
            if (current) commands.push(current);
            current = [ match[1] ];
        }
        else
        {
            if (!current) current = [];
            current.push(match[2]);
        }
    }
    if (current) commands.push(current);
    return commands;
}

//var pathData = "M78.1,10v69.1h0.5L113.4,10h49.9l-45.4,78.7L168.8,190h-53.4l-27.5-62.8l-9.8,15.1V190H31.2V10H78.1z";
//var pathData = "M152.2,10v38.3H92.4v30.8h56v36.8h-56v35.8h62V190H45.5V10H152.2z";
//var pathData =   "M88.9,10l30.3,110.9h0.5V10h43.9v180h-51.4L80.8,78.8h-0.5V190H36.5V10H88.9z";
//var pathData = "M155.9,131.9c0,21.4-4.9,36.4-14.6,45.1c-9.8,8.7-24.2,13-43.2,13c-19.4,0-33.2-4.8-41.5-14.4c-8.3-9.6-12.4-23.7-12.4-42.2v-3.7h41.7v8.7c0,8.4,1.1,14.1,3.4,16.9c2.2,2.8,5.1,4.2,8.6,4.2c3.5,0,6.3-1.4,8.6-4.2c2.2-2.8,3.4-8.4,3.4-16.9V10h46.2V131.9z";
//var pathData = "M123.4,10v180H76.6V10H123.4z";

var commands = parsePathData(l8);

var wid = 215;
var hig = 26;


var pts = [];
var pt;
var prevPt;
for(var i = 0; i < commands.length; i++){
    console.log( commands[i]);

    var text = commands[i][0];
    if(pts.length) prevPt = pts[pts.length - 1];

    if(/[a-z]/g.test(text)){



        if(/[v]/.test(text)){
            console.log(prevPt)
            var pt = {x: prevPt.x, y : Number(commands[i][1]) + prevPt.y};
            pts.push(pt);
        }

        if(/[h]/g.test(text)){
            var pt = {x: Number(commands[i][1]) + prevPt.x, y : prevPt.y};
            pts.push(pt);
        }

        if(/[l]/g.test(text)){
            var pt = {x: Number(commands[i][1]) + prevPt.x, y : Number(commands[i][2]) +prevPt.y };
            pts.push(pt);
        }

        if(/[c]/g.test(text)){
            var pt = {x: Number(commands[i][5]) + prevPt.x, y : Number(commands[i][6]) +prevPt.y, c1X: Number(commands[i][1]) + prevPt.x, c1Y: Number(commands[i][2]) + prevPt.y, c2X: Number(commands[i][3]) + prevPt.x, c2Y: Number(commands[i][4]) + prevPt.y};
            pts.push(pt);
        }

        if(/[s]/g.test(text)){
            var pt = {x: Number(commands[i][3]) + prevPt.x, y : Number(commands[i][4]) +prevPt.y, c1X: Number(commands[i][1]) + prevPt.x, c1Y: Number(commands[i][2]) + prevPt.y};
            pts.push(pt);
        }

    }else{

        if( /[M]/g.test(text) ){
            pt = {x: Number(commands[i][1]), y: Number(commands[i][2])};
            pts.push(pt);
        }

        if(/[V]/.test(text)){
            var pt = {x: prevPt.x , y : Number(commands[i][1]) };
            pts.push(pt);
        }

        if(/[H]/g.test(text)){
            var pt = {x: Number(commands[i][1]), y : prevPt.y};
            pts.push(pt);
        }

        if(/[L]/g.test(text)){
            var pt = {x: Number(commands[i][1]), y : Number(commands[i][2])};
            pts.push(pt);
        }

        if(/[S]/g.test(text)){
            //var pt = {x: Number(commands[i][1]) + prevPt.x, y : Number(commands[i][2]) +prevPt.y };
            //pts.push(pt);
            var pt = {x: Number(commands[i][3]), y : Number(commands[i][4]), c1X: Number(commands[i][1]), c1Y: Number(commands[i][2])};
            pts.push(pt);

        }

        if(/[C]/g.test(text)){
            //var pt = {x: Number(commands[i][1]) + prevPt.x, y : Number(commands[i][2]) +prevPt.y };
            //pts.push(pt);
            var pt = {x: Number(commands[i][5]), y : Number(commands[i][6]), c1X: Number(commands[i][1]), c1Y: Number(commands[i][2]), c2X: Number(commands[i][3]), c2Y: Number(commands[i][4])};
            pts.push(pt);

        }
    }
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


var str = "l" + kk;
str += "=[ ";
console.log(str);

for(var i = 0; i < pts.length; i++){

    var number = Object.size(pts[i]);
    var   curStr;

    if(number == 2){
        curStr = "[" + pts[i].x / 200 + ", " + pts[i].y / 40 + "]";
    }

    if(number == 6){
        curStr = "[" + pts[i].c1X/200 + ", " + pts[i].c1Y/40 + ", " + pts[i].c2X/200 + ", " + pts[i].c2Y/40 + "," +  pts[i].x / 200 + ", " + pts[i].y / 40  +"]";
    }

    if(number == 4){
        curStr = "[" + pts[i].c1X/200 + ", " + pts[i].c1Y/40 + "," +  pts[i].x / 200 + ", " + pts[i].y / 40  +"]";
    }


    if(i != pts.length - 1) str += curStr + ", ";
    else                    str += curStr;

}

str += " ];";