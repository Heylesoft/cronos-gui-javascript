define([
    'jQuery',
    'Underscore',
    'Backbone',
    'router.cms',
    'models/page',
    'text!html/template.page',
    'text!html/site.page',
    'views/components/menu',
    'views/components/search'
], function($, _, Backbone, AppRouter, Page, templatePage, sitePage, MenuComponent, SearchBoxComponent){
    var View = Backbone.View.extend({
        el: $('body'),
        parametes: {},
        site: {},
        events: {
           
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
        },
        render: function(site, page){
            this.parametes.site = site;
            this.parametes.page = page;

            this.$el.html(templatePage);
            $("#page-wrapper", this.$el).html(sitePage);

            this.onLoadMenu();
            this.onLoadContent();
            return this;
        },
        onLoadMenu:function(){
            //Loads the correct sidebar on window load,
            //collapses the sidebar on window resize.
            // Sets the min-height of #page-wrapper to window size
            $(window).bind("load resize", function() {
                topOffset = 50;
                width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
                if (width < 768) {
                    $('div.navbar-collapse', this.$el).addClass('collapse')
                    topOffset = 100; // 2-row-menu
                } else {
                    $('div.navbar-collapse', this.$el).removeClass('collapse')
                }

                height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
                height = height - topOffset;
                if (height < 1) height = 1;
                if (height > topOffset) {
                    $("#page-wrapper", this.$el).css("min-height", (height) + "px");
                }
            });

            var menu = new MenuComponent({ el:$("#side-menu", this.$el) });
            menu.render();

            var searchBox = new SearchBoxComponent({ el:$("#side-menu", this.$el) });
            searchBox.render();
        },
        onLoadContent:function(){
            var selfClass = this;

            var page = new Page();
            page.getPage(this.parametes.site, this.parametes.page);

            page.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            page.responseSuccess(function(response){
                if(response.code == undefined){
                    selfClass.site = response.pages[0];
                    selfClass.onRenderPage();
                } else {
                    console.log("NO DATA IN ACCOUNT");
                }
            });

            page.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });
        },
        onRenderPage:function(){
            if(this.site.name.length > 0){
                $.each(this.site.name, function(i, name){
                    if(name.lenguage == 'en'){
                        $(".page-header", this.$el).html(name.value);
                    }
                });
            }

            $.each(this.site.components, function(i, component){
                // TODO: Validate Code
                switch(component.name){
                    case 'Gallery':
                        require(["views/components/gallery"], function(GalleryComponent) {
                            var gallery = new GalleryComponent({ el: $("#page-wrapper", this.$el) });
                            gallery.render(component.idComponent);
                        });
                    break;
                }
            });
        }
    });

    return new View();
});