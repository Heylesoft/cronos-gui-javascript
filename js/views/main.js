define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'flot',
    'settings',
    'router.cronos',
    'text!html/main.html'
], function($, _, Backbone, Boostrap, Flot, Settings, AppRouter, templateMain){
    var View = Backbone.View.extend({
        el: $('body'),
        template: _.template(templateMain),
        events:{
            //'click #btnLogin':'onLogout'
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
            this.sessionData = Settings.getDataSession();
        },
        render: function(){
            var page = this;
            require(["json!location/main/"+this.sessionData.location+'.json'], function(LocationParameters) {
                page.formParameters = LocationParameters;
                page.$el.html(page.template(LocationParameters));
                page.$el.addClass('nav-md');
                //this.onLoadMenu();
                //page.messagesList = new MessagesView({el:$("#messages-alert", page.$el)});


                // Menu Temp
                $('#sidebar-menu li ul').slideUp();
                $('#sidebar-menu li').removeClass('active');

                $('#sidebar-menu li').click(function () {
                    if ($(this).is('.active')) {
                        $(this).removeClass('active');
                        $('ul', this).slideUp();
                        $(this).removeClass('nv');
                        $(this).addClass('vn');
                    } else {
                        $('#sidebar-menu li ul').slideUp();
                        $(this).removeClass('vn');
                        $(this).addClass('nv');
                        $('ul', this).slideDown();
                        $('#sidebar-menu li').removeClass('active');
                        $(this).addClass('active');
                    }
                });

                $('#menu_toggle').click(function () {
                    if ($('body').hasClass('nav-md')) {
                        $('body').removeClass('nav-md');
                        $('body').addClass('nav-sm');
                        $('.left_col').removeClass('scroll-view');
                        $('.left_col').removeAttr('style');
                        $('.sidebar-footer').hide();

                        if ($('#sidebar-menu li').hasClass('active')) {
                            $('#sidebar-menu li.active').addClass('active-sm');
                            $('#sidebar-menu li.active').removeClass('active');
                        }
                    } else {
                        $('body').removeClass('nav-sm');
                        $('body').addClass('nav-md');
                        $('.sidebar-footer').show();

                        if ($('#sidebar-menu li').hasClass('active-sm')) {
                            $('#sidebar-menu li.active-sm').addClass('active');
                            $('#sidebar-menu li.active-sm').removeClass('active-sm');
                        }
                    }
                });
            });                     
        },
        onLoadMenu:function(){
            //Loads the correct sidebar on window load,
            //collapses the sidebar on window resize.
            // Sets the min-height of #page-wrapper to window size
            /*$(window).bind("load resize", function() {
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
            searchBox.render();*/
        },
        onLogout:function(ev){
            ev.preventDefault();
            /*var selfClass = this;

            var account = new Account();
            account.logout();

            account.responseSuccess(function(response){
                selfClass.router.navigate("page/login", true);
            });

            account.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });*/
        }
    });
    return new View();
});