define([
    'jquery',
    'underscore',
    'backbone',
    'text!html/components/messages/message.html'
], function($, _, Backbone, templateMessage){
    var MessageComponent = Backbone.View.extend({
    	tagName:'div',
    	className:'alert alert-dismissible fade in',
    	template: _.template(templateMessage),
    	render:function(type){
    		this.$el.html(this.template(this.model.attributes));

    		switch(type){
    			case 'success':
    				this.$el.addClass('alert-success');
    			break;

    			case 'info':
    				this.$el.addClass('alert-info');
    			break;

    			case 'warning':
    				this.$el.addClass('alert-warning');
    			break;

    			case 'danger':
    				this.$el.addClass('alert-danger');
    			break;
    		}

    		return this;
    	}
    });
   	
   	return MessageComponent;
});