define([
    'jQuery',
    'Underscore',
    'Backbone',
    '../util/settings'
], function($,_, Backbone, Settings) {
    var GalleryModel = Backbone.Model.extend({
        urlRoot:Settings.restURL + '/gallery',
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
        parse:function(response){
            return response.data;
        },
        getGallery:function(){
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

            this.url = this.urlRoot + '/' + this.id + "?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;
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
                            model.trigger('successBack', response.data);
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
        },
        saveElementGallery:function(gallery, element){
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

            this.url = this.urlRoot + '/element/' + gallery + "?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;

            this.save(element, {
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
                                    model.trigger('successBack', false);
                                break;
                            }
                        } else {
                            var sessionData = JSON.parse(Settings.getDataSession());
                            Settings.setDataSession(sessionData);
                            model.trigger('successBack', response.data);
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
        },
        deleteElementGallery:function(gallery, element){
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

            this.set(element);
            this.url = this.urlRoot + '/element/' + gallery + "/" + this.id + "?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;            

            this.destroy({
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
                                    model.trigger('successBack', false);
                                break;
                            }
                        } else {
                            var sessionData = JSON.parse(Settings.getDataSession());
                            Settings.setDataSession(sessionData);
                            model.trigger('successBack', response.data);
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
    
    return GalleryModel;
});