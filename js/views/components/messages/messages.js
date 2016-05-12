define([
    'jquery',
    'underscore',
    'backbone',
    'views/components/messages/message'
], function($, _, Backbone, MessageView){
    var MessagesComponent = Backbone.View.extend({
        messagesData:[],
    	initialize:function(){
    		this.render();
    	},
    	render:function(){
    		this.$el.html('');
    	},
    	addMessage:function(type, message){
    		var message = new MessageView({model:message});
    		this.$el.append(message.render(type).el);
            this.messagesData.push(message);
    	},
        clearMessages:function(){
            $.each(this.messagesData, function(i, elementView){
                 elementView.close();
            });
        }
    });
   	
   	return MessagesComponent;
});