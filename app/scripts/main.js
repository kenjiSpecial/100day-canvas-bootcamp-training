(function(scope) {

    var app = scope.app || {};

    var Rect = app.Rect = function(ctx, x, y){
        this.ctx = ctx;
        this.col = '#fff';
        this.x = x;
        this.y = y;

        this.side = 30;
    };

    Rect.prototype = {
        update : function(){

        }
    };


})(window.__scope__ || window);
