define([
    'jQuery',
    'Underscore',
    'Backbone',
    'router.cms',
    'text!html/template.page',
    'text!html/site.page',
    'views/components/menu',
    'views/components/search'
], function($, _, Backbone, AppRouter, templatePage, sitePage, MenuComponent, SearchBoxComponent){
    var View = Backbone.View.extend({
        el: $('body'),
        parametes: {},
        site: {},
        events: {
           
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
        },
        render: function(component){
            this.parametes.component = component;

            this.$el.html(templatePage);
            $("#page-wrapper", this.$el).html(sitePage);

            this.onLoadMenu();
            this.onRenderPage();
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
                    $("#page-wrapper",this.$el).css("min-height", (height) + "px");
                }
            });

            var menu = new MenuComponent({ el:$("#side-menu", this.$el) });
            menu.render();

            var searchBox = new SearchBoxComponent({ el:$("#side-menu", this.$el) });
            searchBox.render();
        },
        onRenderPage:function(){
            switch(this.parametes.component){
                case 'images':
                    $(".page-header", this.$el).html("Media");

                    require(["views/components/media.images"], function(MediaComponent) {
                        var mediaImages = new MediaComponent({el:$("#page-wrapper", this.$el)});
                        mediaImages.render();
                    });
                break;
            }          
        }
    });
    return new View();
});