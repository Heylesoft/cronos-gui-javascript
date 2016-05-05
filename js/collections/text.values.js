define([
    'jQuery',
    'Underscore',
    'Backbone',
    '../models/text.value'
], function($,_, Backbone, TextValue) {
    var TextValuesCollection = Backbone.Collection.extend({
        model:TextValue,
        initialize: function(){

        }
    });
    
    return TextValuesCollection;
});