define([
    'order!libs/jquery/jquery-min',
    'order!libs/bootstrap/bootstrap.min',
    'order!libs/underscore/underscore-min', 
    'order!libs/backbone/backbone-min',
    'order!libs/uploadifive/jquery.uploadifive.min',
    'order!libs/metisMenu/metisMenu',
    'order!libs/morris/raphael.min',
    'order!libs/morris/morris.min',
    'order!libs/morris/morris-data',
    'order!libs/phronos/phronos',
],
function(){
    return {
        Backbone: Backbone.noConflict(),
        _: _.noConflict(),
        $: jQuery.noConflict()
    };
});
