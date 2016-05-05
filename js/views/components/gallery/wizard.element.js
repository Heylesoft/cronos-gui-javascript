define([
    'jQuery',
    'Underscore',
    'Backbone',
    'router.cms',
    'collections/lenguages',
    'collections/images',
    'models/image',
    'models/gallery'
], function($, _, Backbone, AppRouter, LenguagesCollection, ImagesCollection, ImageModel, Gallery){
    var WizardElementComponent = Backbone.View.extend({
        galleryData: {},
        lenguages:'',
        galleryID:'',
        lenguageSelected:'',
        pageWizard:1,
        imagesData: {},
        initialize: function(options){
            var selfClass = this;

            this.router = new AppRouter.initialize();

            this.galleryData.name = [];
            this.galleryData.description = [];
            this.galleryData.images = [];
            this.galleryData.cover = {};

            this.galleryID = options.galleryID;

            this.lenguages = [];
            this.lenguageSelected = '';
            $("#lenguages",this.$el).html('');

            $("#txt-name-gallery", this.$el).val('');
            $("#txt-description-gallery", this.$el).val('');

            $("#image-cover", this.$el).attr('src', 'images/gallery-cover.jpg');
            $("#images-content-gallery", this.$el).html('');

            this.$el.on('hidden.bs.modal', function(e){
                delete selfClass.galleryData._id;

                selfClass.galleryData.name = [];
                selfClass.galleryData.description = [];
                selfClass.galleryData.images = [];
                selfClass.galleryData.cover = {};

                selfClass.undelegateEvents();
            });

            var lenguages = new LenguagesCollection();
            lenguages.getLenguages();

            lenguages.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            lenguages.responseSuccess(function(response){
                if(response.code == undefined){
                    selfClass.lenguages = lenguages;
                    selfClass.onRenderLenguages();
                } else {
                    console.log("NO DATA IN ACCOUNT");
                }
            });

            lenguages.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });

            var imagesMedia = new ImagesCollection();
            imagesMedia.getImages();

            imagesMedia.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            imagesMedia.responseSuccess(function(response){
                if(response.code == undefined){
                    selfClass.imagesData = imagesMedia;

                    $("#images-content-gallery-cover",this.$el).html('');
                    $("#images-content-gallery-group",this.$el).html('');
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
        events:{
            "click .btnLenguageSelector":"onLenguageSelected",
            "click #btnNextWizard":"onNextWizard",
            "click #btnDelete":"onDeleteElementGallery",
            "click .imgThumbnail":"onSelectedImageModal",
            "click #btnSaveElement":"onSaveElementGallery",
            "click .imageElementGallery":"onImageGalleryDelete"
        },
        responseSaveElementGallery: function(suscriber, callback){
            this.on('onSaveElementGallery', callback, suscriber);
        },
        onRenderLenguages:function(){
            var selfClass = this;

            var i = 0;
            selfClass.lenguages.each(function(lenguage){
                if(i == 0){
                    selfClass.lenguageSelected = lenguage.get('code');
                    $("#lenguages",this.$el).append('<li role="presentation" class="active libtnLenguageSelector" data-code="'+lenguage.get('code')+'"><a href="#" class="btnLenguageSelector" id="leng-'+lenguage.get('code')+'">'+lenguage.get('code')+'</a></li>');
                } else {
                    $("#lenguages",this.$el).append('<li role="presentation" class="libtnLenguageSelector" data-code="'+lenguage.get('code')+'" ><a href="#" class="btnLenguageSelector" id="leng-'+lenguage.get('code')+'">'+lenguage.get('code')+'</a></li>');
                }

                i++;
            });
        },
        onRenderBasicDataElementGallery:function(lenguageCode){
            var selfClass = this;

            if($("#txt-name-gallery",this.$el).val().length > 0){
                existValue = false;

                $.each(selfClass.galleryData.name, function(i, name){
                    if(selfClass.lenguageSelected == name.lenguage){
                        selfClass.galleryData.name[i].value = $("#txt-name-gallery",this.$el).val();
                        existValue = true;
                    }
                });

                if(!existValue){
                    var nameData = {
                        value:$("#txt-name-gallery",this.$el).val(),
                        lenguage:selfClass.lenguageSelected
                    }

                    selfClass.galleryData.name.push(nameData);
                }
            }

            if($("#txt-description-gallery", this.$el).val().length > 0){
                existValue = false;

                $.each(selfClass.galleryData.description, function(i, description){
                    if(selfClass.lenguageSelected == description.lenguage){
                        selfClass.galleryData.description[i].value = $("#txt-description-gallery", this.$el).val();
                        existValue = true;
                    }
                });

                if(!existValue){
                    var descriptionData = {
                        value:$("#txt-description-gallery",this.$el).val(),
                        lenguage:selfClass.lenguageSelected
                    }

                    selfClass.galleryData.description.push(descriptionData);
                }
            }

            $("#txt-name-gallery",this.$el).val("");
            $("#txt-description-gallery",this.$el).val("");

            $.each(selfClass.galleryData.description, function(i, description){
                if(lenguageCode == description.lenguage){
                    $("#txt-description-gallery",this.$el).val(description.value);
                }
            });

            $.each(selfClass.galleryData.name, function(i, name){
                if(lenguageCode == name.lenguage){
                    $("#txt-name-gallery",this.$el).val(name.value);
                }
            });

            selfClass.lenguageSelected = lenguageCode;

            $("#lenguages > li", this.$el).removeClass("active");

            $("#lenguages", this.$el).children('li').each(function(component){
                if($(this).attr("data-code") == lenguageCode){
                    $(this).addClass("active");
                }
            });
        },
        initWizard:function(type, galleryData){
            var selfClass = this;

            this.pageWizard = 1;

            $('#wizard-modal-panel-gallery-1',this.$el).show();
            $('#wizard-modal-title-gallery-1',this.$el).show();

            $('#wizard-modal-panel-gallery-2',this.$el).hide();
            $('#wizard-modal-title-gallery-2',this.$el).hide();

            $('#wizard-modal-panel-gallery-3',this.$el).hide();
            $('#wizard-modal-title-gallery-3',this.$el).hide();
            
            $("#images-content-gallery-cover",this.$el).html("Loading Images ...");
            $("#images-content-gallery-group",this.$el).html("Loading Images ...");


            if(type=='add'){
                $('#btnSaveElement',this.$el).hide();
                $("#btnDelete",this.$el).hide();
                $('#btnSaveElement',this.$el).button('reset');
                $('#btnNextWizard',this.$el).show();
            }

            if(type == 'edit'){
                $('#btnSaveElement', this.$el).hide();
                $('#btnSaveElement', this.$el).button('reset');
                $("#btnDelete", this.$el).show();
                $("#btnDelete", this.$el).button('reset');
                $('#btnNextWizard', this.$el).show();

                this.galleryData = galleryData;

                if(this.galleryData.name.length > 0){
                    this.onRenderBasicDataElementGallery(this.galleryData.name[0].lenguage);
                }

                var imageModel = new ImageModel();
                $("#image-cover", this.$el).attr("src", imageModel.getImage(this.galleryData.cover.name, 'small'));

                $.each(this.galleryData.images, function(i, image){
                    selfClass.onAddImageElementContent(image._id, image.name);
                });    
            }      

            this.$el.modal('show');
        },
        onLenguageSelected:function(ev){
            ev.preventDefault();
            var codeLenguage = ev.target.id.split('-')[1];
            this.onRenderBasicDataElementGallery(codeLenguage);
        },
        completeResponse:function(){
            delete this.galleryData._id;

            this.galleryData.name = [];
            this.galleryData.description = [];
            this.galleryData.images = [];
            this.galleryData.cover = {};

            this.$el.modal('hide');
        },
        onNextWizard:function(ev){
            var selfClass = this;

            $('#wizard-modal-panel-gallery-'+selfClass.pageWizard, this.$el).hide();
            $('#wizard-modal-title-gallery-'+selfClass.pageWizard, this.$el).hide();

            if(selfClass.pageWizard == 1){
                selfClass.onRenderBasicDataElementGallery(selfClass.lenguageSelected);
            }

            selfClass.pageWizard++;

            $('#wizard-modal-panel-gallery-'+selfClass.pageWizard, this.$el).show();
            $('#wizard-modal-title-gallery-'+selfClass.pageWizard, this.$el).show();

            if(selfClass.pageWizard == 2){
                selfClass.onRenderImagesModal('cover');
            }

            if(selfClass.pageWizard == 3){
                selfClass.onRenderImagesModal('gallery-images');

                $('#btnNextWizard', this.$el).hide();
                $('#btnSaveElement', this.$el).show();
            }
        },
        onRenderImagesModal:function(type){
            var selfClass = this;

            selfClass.imagesData.each(function(image){
                var htmlImage = '';

                if(type == "cover"){
                    htmlImage += '<img id="image-'+image.get('_id')+'-cover" class="col-xs-6 col-md-3 col-lg-4 imgThumbnail selectdImageGallery" data-image-type="cover" data-image-id="'+image.get('_id')+'" data-image-name="'+image.get('name')+'" src="'+image.getImage(image.get('name'), 'small')+'" alt="view">';
                    $("#images-content-gallery-cover",this.$el).append(htmlImage);
                }
                
                if(type == "gallery-images"){
                    htmlImage += '<img id="image-'+image.get('_id')+'-gallery" class="col-xs-6 col-md-3 col-lg-4 imgThumbnail selectdImageGallery" data-image-type="gallery-images" data-image-id="'+image.get('_id')+'" data-image-name="'+image.get('name')+'" src="'+image.getImage(image.get('name'), 'small')+'" alt="view">';
                    $("#images-content-gallery-group", this.$el).append(htmlImage);
                }
            });
        },
        onSelectedImageModal:function(ev){
            ev.preventDefault();
            var selfClass = this;

            var id = $("#" + ev.target.id, this.$el).attr("data-image-id");
            var name = $("#" + ev.target.id, this.$el).attr("data-image-name");
            var type = $("#" + ev.target.id, this.$el).attr("data-image-type");

            var imageModel = new ImageModel();

            if(type == "cover"){
                selfClass.galleryData.cover._id = id;
                $("#image-cover", this.$el).attr("src", imageModel.getImage(name, 'small'));
            }

            if(type == "gallery-images"){
                existImage = false;

                $("#images-content-gallery", this.$el).children('img').each(function(){
                    if($(this).attr('data-image-id') == id){
                        existImage = true;
                    }
                });

                if(!existImage){
                    selfClass.galleryData.images.push({ _id:id });
                    selfClass.onAddImageElementContent(id, name);
                }
            }
        },
        onAddImageElementContent:function(id, name){
            var htmlImage = '';
            var imageModel = new ImageModel();
            htmlImage += '<img id="image-gallery-'+id+'" class="col-xs-6 col-md-3 col-lg-4 imageElementGallery selectdImageGallery" data-image-id="'+id+'" data-image-name="'+name+'" src="'+imageModel.getImage(name, 'small')+'" alt="view">';
            $("#images-content-gallery", this.$el).append(htmlImage);
        },
        onSaveElementGallery:function(ev){
            var selfClass = this;
            ev.preventDefault();

            $('#btnSaveElement', this.$el).button('loading');

            var saveElement = new Gallery();
            saveElement.saveElementGallery(this.galleryID, this.galleryData);

            saveElement.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            saveElement.responseSuccess(function(response){
                if(response.code == undefined){
                    selfClass.completeResponse();
                    selfClass.trigger('onSaveElementGallery', response);
                } else {
                    console.log("NO DATA IN ACCOUNT");
                }
            });

            saveElement.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });
        },
        onDeleteElementGallery:function(ev){
            var selfClass = this;
            ev.preventDefault();

            $('#btnDelete',this.$el).button('loading');

            var deletelement = new Gallery();
            deletelement.deleteElementGallery(this.galleryID, this.galleryData);

            deletelement.responseNoSession(function(){
                selfClass.router.navigate("page/login", true);
            });

            deletelement.responseSuccess(function(response){
                if(response.code == undefined){
                    selfClass.completeResponse();
                    selfClass.trigger('onSaveElementGallery', response);
                } else {
                    console.log("NO DATA IN ACCOUNT");
                }
            });

            deletelement.responseError(function(response){
                require(["views/error"], function(ErrorPage) {
                    ErrorPage.render('code:' + response.code + '</br>message: ' + response.error);
                });
            });
        }
    });

    return WizardElementComponent;
});