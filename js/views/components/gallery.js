define([
    'jQuery',
    'Underscore',
    'Backbone',
    'router.cms',
    'models/gallery',
    'models/image',
    'text!html/gallery/gallery.component',
    'views/components/gallery/wizard.element'
], function($, _, Backbone, AppRouter, Gallery, ImageModel, galleryTemplate, WizardElementComponent){
    var GalleryComponent = Backbone.View.extend({
        componentData: {},
        initialize: function(){
            this.router = new AppRouter.initialize();
        },
        events:{
            "click .imgElement":"onSelectedElementGallery",
            "click #btnAddGalleryModal":"onClickAddGallery",
            "click #btnPropertiesGallery":"onClickProperties"
        },
        render: function(sequence){
            var selfClass = this;
            this.$el.append(galleryTemplate);

            $("#gallery-content", this.$el).html('Loading ...');

            var gallery = new Gallery({_id:sequence});
            gallery.getGallery();

            gallery.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            gallery.responseSuccess(function(response){
                if(response.code == undefined){
                    selfClass.componentData = gallery;
                    selfClass.onRenderElements();
                } else {
                    console.log("NO DATA IN ACCOUNT");
                }
            });

            gallery.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });
        },
        onRenderElements:function(){
            var selfClass = this;

            var htmlImage = '';
            var imageModel = new ImageModel();

            $.each(selfClass.componentData.get('galleries'), function(i, element){
                htmlImage += '<img id="element-'+element._id+'" class="imgElement selectdImageGallery col-xs-6 col-md-3 col-lg-2" data-element-id="'+element._id+'" src="'+imageModel.getImage(element.cover.name, 'small')+'" alt="view">';
            });

            $("#gallery-content", this.$el).html(htmlImage);
        },
        onClickAddGallery:function(ev){
            ev.preventDefault();

            this.wizard = new WizardElementComponent({ el: $("#wizardGalleryModal", this.$el), galleryID:this.componentData.id });
            this.wizard.initWizard('add', null);
            this.wizard.responseSaveElementGallery(this, this.onSaveElementGallery);
        }, 
        onClickProperties:function(ev){
            ev.preventDefault();
            console.log("properties");
        },
        onSelectedElementGallery:function(ev){
            ev.preventDefault();

            var selfClass = this;
            var id = $("#" + ev.target.id,this.$el).attr('data-element-id');
    
            $.each(this.componentData.get('galleries'), function(i, element){
                if(element._id == id){
                    selfClass.wizard = new WizardElementComponent({ el: $("#wizardGalleryModal", this.$el), galleryID:selfClass.componentData.id });
                    selfClass.wizard.initWizard('edit', selfClass.getElementGallery(element));
                    selfClass.wizard.responseSaveElementGallery(selfClass, selfClass.onSaveElementGallery);
                    return false;
                }
            });
        },
        getElementGallery:function(element){
            if(null == element || "object" != typeof element) return element;
            var copy = element.constructor();
            for(var attr in element){
                if(element.hasOwnProperty(attr)) copy[attr] = element[attr];
            }
            return copy;
        },
        onSaveElementGallery:function(element){
            var selfClass = this;
            selfClass.componentData.set('galleries', element);
            selfClass.onRenderElements();
        }
    });

    return GalleryComponent;
});