sw = 1000;
sh = 1000;
var dtr = function(v) {return v * Math.PI/180;}
var camera = {
    focus : 700,
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
        x : 700/2,
        y : 700/2,
        z : 0
    }
};
var affine = {
    world : {
        size : function(p, size) {
            return {
                x :	p.x * size.x,
                y : p.y * size.y,
                z : p.z * size.z
            }
        },
        rotate: {
            x : function(p, rotate) {
                return {
                    x : p.x,
                    y : p.y*Math.cos(dtr(rotate.x)) - p.z*Math.sin(dtr(rotate.x)),
                    z : p.y*Math.sin(dtr(rotate.x)) + p.z*Math.cos(dtr(rotate.x))
                }
            },
            y : function(p, rotate) {
                return {
                    x : p.x*Math.cos(dtr(rotate.y)) + p.z*Math.sin(dtr(rotate.y)),
                    y : p.y,
                    z : -p.x*Math.sin(dtr(rotate.y)) + p.z*Math.cos(dtr(rotate.y))
                }
            },
            z : function(p, rotate) {
                return {
                    x : p.x*Math.cos(dtr(rotate.z)) - p.y*Math.sin(dtr(rotate.z)),
                    y : p.x*Math.sin(dtr(rotate.z)) + p.y*Math.cos(dtr(rotate.z)),
                    z : p.z
                }
            }
        },
        position : function(p, position) {
            return {
                x : p.x + position.x,
                y : p.y + position.y,
                z : p.z + position.z
            }
        },
    },
    view : {
        point : function(p) {
            return {
                x : p.x - camera.self.x,
                y : p.y - camera.self.y,
                z : p.z - camera.self.z
            }
        },
        x : function(p) {
            return {
                x : p.x,
                y : p.y*Math.cos(dtr(camera.rotate.x)) - p.z*Math.sin(dtr(camera.rotate.x)),
                z : p.y*Math.sin(dtr(camera.rotate.x)) + p.z*Math.cos(dtr(camera.rotate.x))
            }
        },
        y : function(p) {
            return {
                x : p.x*Math.cos(dtr(camera.rotate.y)) + p.z*Math.sin(dtr(camera.rotate.y)),
                y : p.y,
                z : -p.x*Math.sin(dtr(camera.rotate.y)) + p.z*Math.cos(dtr(camera.rotate.y))
            }
        },
        zReversal : function(p) {
            return {
                x : p.x,
                y : p.y,
                z : -p.z
            }
        }
    },
    perspective : function(p) {
        return {
            x : p.x * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
            y : p.y * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
            z : p.z * ((camera.focus-camera.self.z) / ((camera.focus-camera.self.z) - p.z)) * camera.zoom,
            p : ((camera.focus) / ((camera.focus) - p.z)) * camera.zoom
        }
    },
    display : function(p, display) {
        return {
            x : p.x + display.x,
            y : p.y + display.y,
            z : p.z + display.z,
            p : p.p
        }
    },
    process : function(model, size, rotate, position) {
        var ret = affine.world.size(model, size);
        ret = affine.world.rotate.x(ret, rotate);
        ret = affine.world.rotate.y(ret, rotate);
        ret = affine.world.rotate.z(ret, rotate);
        ret = affine.world.position(ret, position);
        ret = affine.view.point(ret);
        ret = affine.view.x(ret);
        ret = affine.view.y(ret);
        ret = affine.view.zReversal(ret);
        ret = affine.perspective(ret);
        ret = affine.display(ret, camera.display);
        return ret;
    }
}
