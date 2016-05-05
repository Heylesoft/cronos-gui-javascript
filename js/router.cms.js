define([
    'jQuery',
    'Underscore',
    'Backbone',
    'models/account',
], function($, _, Backbone, Account){
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'mainAction',
            'page/:page': 'onLoadPageAction',
            'page/:page/:option': 'onLoadPageAction',
            'loadsite/:site/:page':'onLoadComponentSite',
            'loadComponent/:name':'onLoadComponent'
        },
        mainAction:function(){
            var selfClass = this;

            this.validateSession(function(insession){
                if(typeof insession == 'object'){
                    require(["views/error"], function(ErrorPage) {
                        ErrorPage.render('code:' + insession.code + '</br>message: ' + insession.error);
                    });
                }

                if(typeof insession == 'boolean'){
                    if(insession){
                        selfClass.navigate("page/main", true);
                    } else {
                        selfClass.navigate("page/login", true);
                    }
                }
            });
        },
        onLoadPageAction:function(page, option){
            this.validateSession(function(insession){
                if(typeof insession == 'object'){
                    require(["views/error"], function(ErrorPage) {
                        ErrorPage.render('code:' + insession.code + '</br>message: ' + insession.error);
                    });
                }

                if(typeof insession == 'boolean'){
                    if(insession){
                        switch(page){
                            case 'login':
                                require(["views/login"], function(LoginPage) {
                                    LoginPage.render();
                                });
                            break;

                            case 'main':
                                require(["views/main"], function(MainPage) {
                                    MainPage.render();
                                });
                            break;
                        }

                    } else {
                        require(["views/login"], function(LoginPage) {
                            LoginPage.render();
                        });
                    }
                }
            });
        },
        onLoadComponent:function(name){
            var selfClass = this;
            this.validateSession(function(insession){
                if(typeof insession == 'object'){
                    require(["views/error"], function(ErrorPage) {
                        ErrorPage.render('code:' + insession.code + '</br>message: ' + insession.error);
                    });
                }

                if(typeof insession == 'boolean'){
                    if(insession){
                        require(["views/component"], function(ComponentPage) {
                            ComponentPage.render(name);
                        });
                    } else {
                        selfClass.navigate("page/login", true);
                    }
                }
            });
        },
        onLoadComponentSite:function(site, page){
            var selfClass = this;
            this.validateSession(function(insession){
                if(typeof insession == 'object'){
                    require(["views/error"], function(ErrorPage) {
                        ErrorPage.render('code:' + insession.code + '</br>message: ' + insession.error);
                    });
                }

                if(typeof insession == 'boolean'){
                    if(insession){
                        require(["views/site"], function(SiteComponentPage) {
                            SiteComponentPage.render(site, page);
                        });
                    } else {
                        selfClass.navigate("page/login", true);
                    }
                }
            });
        },
        validateSession:function(callback){
            var account = new Account();
            account.validateAccountSession();

            account.responseSuccess(function(response){
                callback(response);
            });

            account.responseError(function(response){
                callback(response);
            });
        }
    });

    var appRouter = new AppRouter();

    Backbone.history.start();

    var initialize = function(){
        return appRouter;
    };

    return { 
        initialize: initialize
    };
});