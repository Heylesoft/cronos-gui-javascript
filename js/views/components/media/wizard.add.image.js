define([
    'jQuery',
    'Underscore',
    'Backbone',
    'router.cms',
    'models/image',
    'util/settings'
], function($, _, Backbone, AppRouter, ImageModel, Settings){
    var WizardAddImage = Backbone.View.extend({
        events:{
            "click #btnUploadImages":"onStartUpload"
        },
        initialize: function(options){
            this.router = new AppRouter.initialize();

            this.images = [];

            var sessionData = "";

            if(Settings.getDataSession() != ""){
                sessionData = JSON.parse(Settings.getDataSession());
                this.accountID = sessionData.account;
                this.key = sessionData.key;
            } else {
                sessionData = null;
                this.accountID = null;
                this.key = null;
            }
        }, 
        responseCompleteUploadImages: function(suscriber, callback){
            this.on('onCompleteUploadImages', callback, suscriber);
        },
        onShow:function(){
            this.$el.modal('show');
            var selfClass = this;

            $("#imageUploadInput", this.$el).uploadifive({
                'auto':false,
                'fileType': 'image/*',
                'multi': true,
                'method':'post',
                'buttonText':'SELECT IMAGES',
                'width': 300,
                'uploadScript':Settings.restURL + '/media/image/upload?app=' + Settings.apiData.application + '&hash=' + Settings.apiData.key + '&acc=' + selfClass.accountID + '&k=' + selfClass.key,
                'onUploadComplete':function(file, response){
                    selfClass.onUploadComplete(file, JSON.parse(response));
                },
                'onQueueComplete':function(status){
                    selfClass.onQueueComplete(status);
                }
            });
        },
        onStartUpload:function(){
            $("#imageUploadInput", this.$el).uploadifive('upload');
        },
        onUploadComplete:function(file, response){
            if(response.type == "success"){
                if(typeof response.data.code == 'number'){
                    switch(response.data.code){
                        case 203:
                            this.router.navigate("page/login", true);
                        break;
                    }
                } else {
                    var sessionData = JSON.parse(Settings.getDataSession());
                    Settings.setDataSession(sessionData);
                    this.images.push(new ImageModel(response.data));
                }
            }

            if(response.type == "error"){
                console.log('Error to upload ' + file.name);
            }
        },
        onQueueComplete:function(status){
            this.trigger('onCompleteUploadImages', this.images);
            $("#imageUploadInput", this.$el).uploadifive('clearQueue');
        }
    });

    return WizardAddImage;
});