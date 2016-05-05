define([
    'jQuery',
    'Underscore',
    'Backbone',
    '../models/image',
    '../util/settings'
], function($,_, Backbone, Images, Settings) {
    var ImagesCollection = Backbone.Collection.extend({
        model:Images,
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
        url:function(){
            if(Settings.getDataSession() != ""){
                sessionData = JSON.parse(Settings.getDataSession());
                accountID = sessionData.account;
                key = sessionData.key;
            } else {
                sessionData = null;
                accountID = null;
                key = null;
            }

            return Settings.restURL + '/media/image' + "?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;
        },
        parse:function(response){
            return response.data;
        },
        getImages:function(){
            var selfCollection = this;

            this.fetch({
                success: function (model, response) {
                    if(response.type == Settings.responseServiceTypes.SUCCESS){
                        if(typeof response.data.code == 'number'){
                            switch(response.data.code){
                                case 103:
                                    var sessionData = JSON.parse(Settings.getDataSession());
                                    Settings.setDataSession(sessionData);
                                    model.trigger('successBack', Settings.errorserrors.e103);
                                break;

                                case 203:
                                    model.trigger('noSession', true);
                                break;
                            }
                        } else {
                            var sessionData = JSON.parse(Settings.getDataSession());
                            Settings.setDataSession(sessionData);
                            model.trigger('successBack', selfCollection);
                        }
                    }

                    if(response.type == Settings.responseServiceTypes.ERROR){
                        model.trigger('errorBack', Settings.responseError(response.data.code)); 
                    }
                },
                error: function(model, response){
                    model.trigger('errorBack', response.responseJSON);
                }
            });
        }
    });
    
    return ImagesCollection;
});