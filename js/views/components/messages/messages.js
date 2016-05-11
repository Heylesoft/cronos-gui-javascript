define([
    'jquery',
    'underscore',
    'backbone',
    'views/components/messages/message'
], function($, _, Backbone, MessageView){
    var MessagesComponent = Backbone.View.extend({
    	initialize:function(){
    		this.render();
    	},
    	render:function(){
    		this.$el.html('');
    	},
    	addMessage:function(type, message){
    		var message = new MessageView({model:message});
    		this.$el.append(message.render(type).el);
    	}
    });
   	
   	return MessagesComponent;
});