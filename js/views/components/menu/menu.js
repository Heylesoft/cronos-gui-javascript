define([
    'jquery',
    'underscore',
    'backbone',
    'router.cronos',
    'text!html/menu.html'
], function($, _, Backbone, AppRouter, Account, menuComponent){
    var MenuComponent = Backbone.View.extend({
        events:{
            "click .btnPage":"onOpenPage"
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
        },
        render: function(){
            var selfClass = this;

            selfClass.$el.html(menuComponent);

            var account = new Account();
            account.getAccount();

            account.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            account.responseSuccess(function(response){
                if(response.code == undefined){
                    var menuHTML = '';

                    // if admin site
                    $.each(response.sites, function(i, site){
                        menuHTML += '<li>';
                        menuHTML += '<a id="site-'+site._id+'" href="#"><i class="fa fa-files-o fa-fw"></i> '+site.name+':'+site.domain+'<span class="fa arrow"></span></a>';

                        var countPages = site.pages.length;

                        if(countPages > 0){
                            $("#site-"+site._id, menuHTML).append('<span class="fa arrow"></span>');
                            menuHTML += '<ul class="nav nav-second-level">';

                            $.each(site.pages, function(j, page){
                                menuHTML += '<li>';
                                menuHTML += '<a class="btnPage" site-data="'+site._id+'" id="btnPage-'+page._id+'" href="#">'+ (j+1) + ". " + page.name[0].value+'</a>';
                                menuHTML += '</li>';
                            });

                            menuHTML += '</ul>';
                        }

                        menuHTML += '</li>';
                    });

                    selfClass.$el.append(menuHTML);
                    selfClass.$el.metisMenu();

                    var activePage = window.location.hash.split("/");

                    if(activePage[0] == "#loadsite"){
                        $("#btnPage-"+activePage[1], selfClass.$el).addClass("active");
                        $("#btnPage-"+activePage[2], selfClass.$el).addClass("active");
                    } else {
                        $("#btnPage-"+activePage[1], selfClass.$el).addClass("active");
                    }
                } else {
                    
                }
            });

            account.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });

            return this;
        },
        onOpenPage:function(event){
            event.preventDefault();
            var selfClass = this;
            var id = event.target.id.split("-")[1];

            var site = $("#btnPage-" + id).attr('site-data');
            selfClass.router.navigate("loadsite/"+site+"/"+id, true);
        }
    });

    return MenuComponent;
});