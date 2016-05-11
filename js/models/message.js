define([
    'jquery',
    'underscore',
    'backbone'
], function($,_, Backbone) {
    var MessageModel = Backbone.Model.extend({
    	defaults: {
			title: "Holy guacamole!",
			value: "Best check yo self, you're not looking too good."
		}
    });

    return MessageModel;
});