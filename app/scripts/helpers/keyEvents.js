/**
 * Created by kenji-special on 12/26/14.
 */

var cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();


var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            return window.setTimeout(callback, 1000 / 60);
        };
})();

var keyEvent = {};
_.extend(keyEvent, Backbone.Events);

var KEY_NUMBER = {
    ESC : 27
};

var ESC_DOWN = "ESCAPE_DOWN";

window.addEventListener("keydown", function(event){
    if(KEY_NUMBER.ESC == event.keyCode){
        keyEvent.trigger(ESC_DOWN);
    }
}, false);
