define([], function () {
	var Settings = function () {
		this.restURL = 'http://127.0.0.1/cronos';
		this.keyAPI = '4wcgw04k0scgck0wwwkk44kwc8os84w88g004ss4';
		this.idIdentification = 'id';
		this.locationDefault = 'en';

		this.responseStatus = {
		      E400:{error:'HTTP_BAD_REQUEST',code:400}
		    , E500:{error:'HTTP_INTERNAL_SERVER_ERROR',code:500}
		    , E200:{error:'HTTP_OK', code:200}
		}

		this.responseServiceTypes = {
      		  SUCCESS:true
    		, ERROR: false
  		}
	}

	Settings.prototype = {
		setDataSession:function(data){
	    	var d = new Date();
	      	d.setTime(d.getTime() + 600000); // 10 Minu
	      	var expires = "expires="+d.toUTCString();
	      	document.cookie = "cronosCMS=" + JSON.stringify(data) + "; " + expires;
	    },
  		getDataSession:function(){
	      	var name = "cronosCMS=";
	      	var ca = document.cookie.split(';');
	      	for(var i=0; i<ca.length; i++) {
	        	var c = ca[i];
	          	while (c.charAt(0)==' ') c = c.substring(1);
	          	if (c.indexOf(name) == 0) {
	          		return JSON.parse(c.substring(name.length,c.length));
	          	}
	      	}
	      	return "";
	    },
	    deleteDataSession:function(){
	    	document.cookie = 'cronosCMS=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	    },
	   	responseError:function(code){
	    	var response;

	      	switch(code){
	        	case 100:
	          		response = this.errors.e100;
	        	break;

	        	case 101:
	          		response = this.errors.e101;
	        	break;

	        	case 102:
	          		response = this.errors.e102;
	        	break;

	        	case 104:
	          		response = this.errors.e102;
	        	break;

	        	default:
	          		response = this.errors.e100;
	        	break;
	      	}

	      	return response;
	    }
	}

	return new Settings();
});