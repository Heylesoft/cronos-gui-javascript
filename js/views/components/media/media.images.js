define([
    'jQuery',
    'Underscore',
    'Backbone',
    'router.cms',
    'collections/images',
    'views/components/media/wizard.add.image',
    'views/components/util/paginator',
    'text!html/media/images.component'
], function($, _, Backbone, AppRouter, ImagesCollection, WizardAddImage, Paginator, galleryTemplate){
    var MediaImagesView = Backbone.View.extend({
        imagesData: {},
        events:{
            "click .imgThumbnail":"onDeleteImage",
            "click #btnAddImageGallery":"onClickAddImage",
            "click #btnPropertiesGallery":"onClickProperties"
        },
        initialize: function(){
            this.router = new AppRouter.initialize();
        },
        render: function(){
            var selfClass = this;
            this.$el.append(galleryTemplate);

            this.paginator = new Paginator({ el: $("#images-paginator", this.$el) });
            this.paginator.onChange(this, this.onChangeDataImages);

            var imagesMedia = new ImagesCollection();
            imagesMedia.getImages();

            imagesMedia.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            imagesMedia.responseSuccess(function(response){
                if(response.code == undefined){
                    selfClass.imagesData = response;
                    selfClass.paginator.setData(selfClass.imagesData);
                    selfClass.onRenderImages();
                } else {
                    console.log("NO DATA IN ACCOUNT");
                }
            });

            imagesMedia.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });
        },
        onClickAddImage:function(ev){
            ev.preventDefault();

            this.wizard = new WizardAddImage({ el: $("#uploadFileModal", this.$el) });
            this.wizard.responseCompleteUploadImages(this, this.onSaveUploadImages);
            this.wizard.onShow();
        }, 
        onClickProperties:function(ev){
            ev.preventDefault();
            console.log("properties");
        },
        onRenderImages:function(){    
            $("#images-content", this.$el).html('');

            for (var i = 0; i < this.paginator.getDataPage().length; i++) {
                var image = this.paginator.getDataPage()[i];
                $("#images-content", this.$el).append('<div id="layerImage-' + image.id + '" class="col-xs-6 col-md-3" style="padding-top: 10px; padding-bottom: 10px;"><a href="#" class="imgThumbnail"><img id="image-'+image.id+'" src="'+image.getImage(image.get('name'), 'small')+'" style="width:100%;" alt="view"></a></div>');
            };

            this.paginator.render();
        },
        onChangeDataImages:function(data){
            this.onRenderImages();
        },
        onSaveUploadImages:function(response){
            this.imagesData.unshift(response);
            this.paginator.setData(this.imagesData);
            this.onRenderImages();
        },
        onDeleteImage:function(ev){
            ev.preventDefault();
            var selfClass = this;
            var name = ev.target.id.split("-")[1];

            /*selfClass.phronos.deleteImage(name, function(response){
                if(response.error != undefined){
                    switch(response.code){
                        case 103:
                            console.log("NO DATA IN ACCOUNT");
                        break;

                        case 203:
                            selfClass.router.navigate("page/login", true);
                        break;

                        case 204:
                            //TODO: MENSAJE DE ERROR 
                            console.log('error al borrar');
                        break;
                    }
                } else {
                    //TODO: MENSAJE DE CONFIRMACION

                    $("#layerImage-"+name).remove();
                }
            });*/
        }
    });
    return MediaImagesView;
});