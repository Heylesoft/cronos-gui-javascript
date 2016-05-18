define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'settings',
    'router.cronos',
    'views/components/messages/messages',
    'models/message',
    'models/user',
    'text!html/login.html'
], function($, _, Backbone, Bootstrap, Settings, AppRouter, MessagesView, MessageModel, UserModel, templateLogin){
    var View = Backbone.View.extend({
        el: $('body'),
        template: _.template(templateLogin),
        events: {
            "click #btn-login": "onEnter",
            "keypress :input": "logKey"
        },
        logKey: function(ev) {
            if(ev.keyCode == 13)
                this.onEnter(ev);
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
            this.sessionData = Settings.getDataSession();    
        },
        render: function(){
            var page = this;
            require(["json!location/login/"+this.sessionData.location+'.json'], function(LocationParameters) {
                page.formParameters = LocationParameters;
                page.$el.html(page.template(LocationParameters));
                page.$el.css('background-color', '#F7F7F7');
                page.messagesList = new MessagesView({el:$("#messages-alert", page.$el)});
            });
        },
        onEnter:function(ev){
            ev.preventDefault();

            var page = this;

            var hideMessages = setInterval(function(){ 
                page.messagesList.clearMessages();
                clearInterval(hideMessages);
            }, 4000);

            var login = $("#txt-user").val();
            var password = $("#txt-pass").val();
            var isComplete = true;

            if(login == ""){
                this.messagesList.addMessage('danger', new MessageModel({title:'Error', value:page.formParameters.fieldusernameRequired}));
                isComplete = false;
            }
            
            if(password == ""){
                this.messagesList.addMessage('danger', new MessageModel({title:'Error', value:page.formParameters.fieldpasswordRequired}));
                isComplete = false;
            }

            if(isComplete){
                var user = new UserModel();
                user.set('login', login);
                user.set('password', password);
                user.set('location', this.sessionData.location);
                user.login();

                user.responseSuccess(function(status, response){
                    if(status == Settings.responseServiceTypes.ERROR){
                        page.messagesList.addMessage('danger', new MessageModel({title:'Error', value:response}));
                    } else {
                        page.router.navigate("page/"+this.sessionData.location+"/main", true);
                    }
                });

                user.responseError(function(response, code){
                    require(["views/error"], function(ErrorPage) {
                        ErrorPage.render('code:' + code + '</br>message: ' + response);
                    });
                });
            } 
        }
    });
    return new View();
});