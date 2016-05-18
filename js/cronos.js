require.config({
    paths: {
        jquery:'libs/jquery/jquery-2.2.3.min',
    	bootstrap: 'libs/bootstrap/js/bootstrap.min',
    	underscore: 'libs/underscore/underscore-min', 
    	backbone: 'libs/backbone/backbone-min',
        backboneauth: 'libs/backbone/backbone.basicauth',
    	uploadifive: 'libs/uploadifive/jquery.uploadifive.min',
        flot: 'libs/flot/loader.flot',
    	settings: 'util/settings',
        json:'json',
        html: '../html'
    },
    waitSeconds: 10,
});

require(['router.cronos', 'jquery', 'settings'], function(Cronos, $, Settings){

    $.ajaxSetup({
        beforeSend: function(xhr){
            xhr.setRequestHeader("CRONOS-KEY", Settings.keyAPI);
        }
    });

    Cronos.initialize();
});
