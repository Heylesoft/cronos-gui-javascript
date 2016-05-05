define([
    'jQuery',
    'Underscore',
    'Backbone',
    '../util/settings'
], function($,_, Backbone, Settings) {
    var ImageModel = Backbone.Model.extend({
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
        },
        getImage:function(name, size){
            var sessionData = "";
            var accountID = "";
            var key = "";

            if(Settings.getDataSession() != ""){
                sessionData = JSON.parse(Settings.getDataSession());
                accountID = sessionData.account;
                key = sessionData.key;
            } else {
                sessionData = null;
                accountID = null;
                key = null;
            }

            return Settings.restURL + "/media/image/" + name + "/" + size + "?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;
        }
    });
    
    return ImageModel;
});