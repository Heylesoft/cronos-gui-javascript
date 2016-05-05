define([
    'jQuery', 
    'Underscore', 
    'Backbone',
    'router.cms', // Request router.js
    ], function($, _, Backbone, Router){
    var initialize = function(){
        if(!window['console']){
            var mock_console = {};
            mock_console.log = function(){};
            mock_console.debug = function(){};
            mock_console.warm = function(){};
            mock_console.info = function(){};
            window['console'] = mock_console;
        }
        // Pass in our Router module and call it's initialize function
        Router.initialize();
    }

    return { 
        initialize: initialize
    };
});
