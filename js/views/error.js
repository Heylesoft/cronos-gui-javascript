define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!html/error.page'
], function($, _, Backbone, ErrorPage){
    var View = Backbone.View.extend({
        el: $('body'),
        render: function(message){
            this.$el.html(ErrorPage);
            $("#msg").html(message);
        }
    });
    return new View();
});
