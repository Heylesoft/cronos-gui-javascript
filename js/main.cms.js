require.config({
    paths: {
        loader: 'libs/loader',
        jQuery: 'libs/jquery/jquery',
        Underscore: 'libs/underscore/underscore',
        Backbone: 'libs/backbone/backbone',
        html: '../html'
    }
});

require(['app.cms'], function(Cms){
    Cms.initialize();
});
