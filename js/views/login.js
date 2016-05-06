define([
    'jquery',
    'underscore',
    'backbone',
    'settings',
    'router.cronos',
    'text!html/login.html'
], function($, _, Backbone, Settings, AppRouter, templateLogin){
    var View = Backbone.View.extend({
        el: $('body'),
        template: _.template(templateLogin),
        events: {
            "click #btn-login": "onEnter",
            "keypress :input": "logKey"
        },
        logKey: function(e) {
            if(e.keyCode == 13)
                this.onEnter();
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
            this.sessionData = Settings.getDataSession();
        },
        render: function(){


            this.$el.html(this.template({name:'Jefferson Ortiz'}));

            console.log(this.sessionData);

            //$("#mssg-box").hide();
        },
        onEnter:function(ev){
            ev.preventDefault();

            /*var selfClass = this;

            $("#btn-login").button('loading');

            var login = $("#txt-login").val();
            var password = $("#txt-password").val();
            var isComplete = true;
            var mssages = "";

            if(login == ""){
                mssages += '<li>The "Username" field is required.</li>';
                isComplete = false;
            }
            
            if(password == ""){
                mssages +=  '<li>The "Password" field is required.</li>';
                isComplete = false;
            }
            
            if(isComplete){
                var account = new Account();
                account.set('login', login);
                account.set('password', password);
                account.login();

                account.responseSuccess(function(response){
                    if(typeof response.code == 'number'){
                        switch(response.code){
                            case 201:
                                mssages = '<li>The password is incorrect.</li>';
                                selfClass.onShowErrorMessage(mssages);
                            break;

                            case 202:
                                mssages = '<li>The data is incorrect.</li>';
                                selfClass.onShowErrorMessage(mssages);
                            break;
                        }
                    } else {
                        selfClass.router.navigate("page/main", true);
                    }
                });

                account.responseError(function(response){
                    require(["views/error"], function(ErrorPage) {
                        ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                    });
                });
            } else {
                $("#btn-login").button('reset');
                selfClass.onShowErrorMessage(mssages);
            }*/
        },
        onShowErrorMessage:function(message){
            /*var selfClass = this;
            $("#mssg-box").show();
            $("#mssg-box").append("<div id='list-messages'><strong>Error!</strong><ul>"+message+"</ul></div>");

            var timer = setInterval(function(){
                $("#mssg-box", selfClass.el).hide();
                $("#list-messages").remove();
                $("#btn-login").button('reset');

                clearInterval(timer);                    
            },2000);*/
        }
    });
    return new View();
});