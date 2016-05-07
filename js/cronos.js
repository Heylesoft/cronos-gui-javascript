require.config({
    paths: {
        jquery:'libs/jquery/jquery-2.2.3.min',
    	bootstrap: 'libs/bootstrap/js/bootstrap.min',
    	underscore: 'libs/underscore/underscore-min', 
    	backbone: 'libs/backbone/backbone-min',
    	uploadifive: 'libs/uploadifive/jquery.uploadifive.min',
    	settings: 'util/settings',
        json:'json',
        html: '../html'
    }
});

require(['router.cronos'], function(Cronos){
    Cronos.initialize();
});
