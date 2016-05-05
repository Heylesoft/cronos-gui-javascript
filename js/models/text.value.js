define([
    'jQuery',
    'Underscore',
    'Backbone',
    'collections/images',
    'models/image'
], function($,_, Backbone,ImagesCollection, ImageModel) {
    var TextValueModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function(){
            
        }
    });
    
    return TextValueModel;
});