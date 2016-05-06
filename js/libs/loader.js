define([
    'order!libs/jquery/jquery-2.2.3.min',
    'order!libs/bootstrap/js/bootstrap.min',
    'order!libs/underscore/underscore-min', 
    'order!libs/backbone/backbone-min',
    'order!libs/uploadifive/jquery.uploadifive.min',
],
function(){
    return {
        Backbone: Backbone.noConflict(),
        _: _.noConflict(),
        $: jQuery.noConflict()
    };
});
