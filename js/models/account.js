define([
    'jQuery',
    'Underscore',
    'Backbone',
    '../util/settings'
], function($,_, Backbone, Settings) {
    var AccountModel = Backbone.Model.extend({
        urlRoot:Settings.restURL + '/account',
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
        login: function(){
            this.url = this.urlRoot + "/login?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key;
            this.save(null, {
                success: function (model, response) {
                    if(response.type == Settings.responseServiceTypes.SUCCESS){
                        if(typeof response.data.code == 'number'){
                            switch(response.data.code){
                                case 201:
                                    model.trigger('successBack', Settings.errors.e201);
                                break;

                                case 202:
                                    model.trigger('successBack', Settings.errors.e202);
                                break;
                            }
                        } else {
                            Settings.setDataSession(response.data);
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
        logout:function(){
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

            this.url = this.urlRoot + "/logout?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;
            this.save(null, {
                success: function (model, response) {
                    if(response.type == Settings.responseServiceTypes.SUCCESS){
                        Settings.deleteDataSession();
                        model.trigger('successBack', true);
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
        validateAccountSession:function(){
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

            this.url = this.urlRoot + "/sessionvalid?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;
            this.save(null, {
                success: function (model, response) {
                    if(response.type == Settings.responseServiceTypes.SUCCESS){
                        if(typeof response.data.code == 'number'){
                            switch(response.data.code){
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
        getAccount:function(){
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

            this.url = this.urlRoot + "?app=" + Settings.apiData.application + "&hash=" + Settings.apiData.key + "&acc=" + accountID + "&k=" + key;
            this.fetch({
                success: function (model, response) {
                    if(response.type == Settings.responseServiceTypes.SUCCESS){
                        if(typeof response.data.code == 'number'){
                            switch(response.data.code){
                                case 103:
                                    var sessionData = JSON.parse(Settings.getDataSession());
                                    Settings.setDataSession(sessionData);
                                    model.trigger('successBack', Settings.errors.e103);
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
        }
    });
    
    return AccountModel;
});