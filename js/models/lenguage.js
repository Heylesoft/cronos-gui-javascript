define([
    'jQuery',
    'Underscore',
    'Backbone',
    '../util/settings'
], function($,_, Backbone, Settings) {
    var LenguageModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function(){

        },
        responseNoSession:function(callback){
            this.on('noSession', callback);
        },
        responseSuccess: function(callback){
            this.on('successBack', callback);
        }, 
        responseError: function(callback){
            this.on('errorBack', callback);
        }
    });
    
    return LenguageModel;
});