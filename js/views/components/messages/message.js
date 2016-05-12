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
        id:"",
    	render:function(type){
    		this.$el.html(this.template(this.model.attributes));
            this.id = "message-" + new Date().getTime();
            this.$el.attr("id", this.id);

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
    	},
        close:function(){
            this.$el.alert('close');
        }
    });
   	
   	return MessageComponent;
});