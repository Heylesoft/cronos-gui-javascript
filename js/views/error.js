define([
    'jquery',
    'underscore',
    'backbone',
    'text!html/error.html'
], function($, _, Backbone, ErrorPage){
    var View = Backbone.View.extend({
        el: $('body'),
        render: function(message){
            this.$el.html(ErrorPage);
            this.$el.addClass('nav-md');
            $("#msg").html(message);
        }
    });
    return new View();
});
