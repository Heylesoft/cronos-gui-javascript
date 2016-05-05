define([
    'jQuery',
    'Underscore',
    'Backbone',
    'router.cms',
    'models/account',
    'text!html/template.page',
    'text!html/main.page',
    'views/components/menu',
    'views/components/search'
], function($, _, Backbone, AppRouter, Account, templatePage, mainPage, MenuComponent, SearchBoxComponent){
    var View = Backbone.View.extend({
        el: $('body'),
        events:{
            'click #btnLogin':'onLogout'
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
        },
        render: function(){
            this.$el.html(templatePage);
            $("#page-wrapper",this.$el).html(mainPage);
            this.onLoadMenu();
        },
        onLoadMenu:function(){
            //Loads the correct sidebar on window load,
            //collapses the sidebar on window resize.
            // Sets the min-height of #page-wrapper to window size
            $(window).bind("load resize", function() {
                topOffset = 50;
                width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
                if (width < 768) {
                    $('div.navbar-collapse').addClass('collapse')
                    topOffset = 100; // 2-row-menu
                } else {
                    $('div.navbar-collapse').removeClass('collapse')
                }

                height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
                height = height - topOffset;
                if (height < 1) height = 1;
                if (height > topOffset) {
                    $("#page-wrapper").css("min-height", (height) + "px");
                }
            });

            var menu = new MenuComponent({ el:$("#side-menu", this.$el) });
            menu.render();

            var searchBox = new SearchBoxComponent({ el:$("#side-menu", this.$el) });
            searchBox.render();
        },
        onLogout:function(ev){
            ev.preventDefault();
            var selfClass = this;

            var account = new Account();
            account.logout();

            account.responseSuccess(function(response){
                selfClass.router.navigate("page/login", true);
            });

            account.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });
        }
    });

    return new View();
});