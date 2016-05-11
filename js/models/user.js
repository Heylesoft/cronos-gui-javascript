define([
    'underscore',
    'backbone',
    'settings'
], function(_, Backbone, Settings) {
    var User = Backbone.Model.extend({
        urlRoot: Settings.restURL + '/security',
        idAttribute: Settings.idIdentification,
        credentials: {
            username: 'cms-front',
            password: '4wcgw04k0scgck0wwwkk44kwc8os84w88g004ss4'
        },
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
            this.url = this.urlRoot + "/login";
            this.save(null, {
                success: function (model, response) {
                    if(response.status == Settings.responseServiceTypes.SUCCESS){
                        var sessionData = Settings.getDataSession();

                        if(sessionData instanceof Object){
                            sessionData.key = response.data;
                            Settings.setDataSession(sessionData);
                        } else {
                            Settings.setDataSession({key:response.data});
                        }

                        model.trigger('successBack', response.status, response.data);
                    }

                    if(response.status == Settings.responseServiceTypes.ERROR){
                        model.trigger('successBack', response.status, response.data);       
                    }
                },
                error: function(model, response){
                    model.trigger('errorBack', response.responseText, response.status);
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
        }
    });
    
    return User;
});