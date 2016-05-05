define([
    'jQuery',
    'Underscore',
    'Backbone',
    'collections/images',
    'collections/text.values',
    'models/image'
], function($,_, Backbone,ImagesCollection, TextValuesCollection, ImageModel) {
    var ElementGalleryModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function(){
            var arrayImages = new ImagesCollection(this.get("images"));
            var coverImage = new ImageModel(this.get("cover"));
            var nameValue = new TextValuesCollection(this.get('name'));
            var descriptionValue = new TextValuesCollection(this.get('description'));
            this.set({ "images":arrayImages, "cover":coverImage, "name":nameValue, "description":descriptionValue });
        }
    });
    
    return ElementGalleryModel;
});