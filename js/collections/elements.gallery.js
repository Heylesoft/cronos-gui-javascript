define([
    'jQuery',
    'Underscore',
    'Backbone',
    '../models/element.gallery'
], function($,_, Backbone, Images) {
    var ElementsGalleryCollection = Backbone.Collection.extend({
        model:Images,
        initialize: function(){

        }
    });
    
    return ElementsGalleryCollection;
});