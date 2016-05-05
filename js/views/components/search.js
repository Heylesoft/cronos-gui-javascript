define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!html/searchbox.component'
], function($, _, Backbone, searchComponent){
    var SearchBoxComponent = Backbone.View.extend({
        events:{

        },
        render: function(){
            this.$el.prepend(searchComponent);
            return this;
        }
    });

    return SearchBoxComponent;
});