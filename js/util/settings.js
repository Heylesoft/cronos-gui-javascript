define([], function () {
	var Settings = function () {
		this.restURL = 'http://localhost:3001';
		this.apiData = {
			  application:'CMS_PUBLIC'
			, key:'Aer!04LosERP20167'
		};

		this.errors = {
		      e100:{error:'SYSTEM_API_ERROR',code:100}
		    , e101:{error:'IMCOMPLETE_PARAMETERS',code:101}
		    , e102:{error:'DOMAIN_IS_NOT_VALID', code:102}
		    , e103:{error:'NO_DATA_RESULT', code:103}
		    , e104:{error:'DONT_HAVE_API_KEY_PARAMETERS', code:104}
		    , e201:{error:'INVALID_PASSWORD',code:201}
		    , e202:{error:'INCORRECT_LOGIN',code:202}
		    , e204:{error:'ERROR_TO_DELETE',code:204}
		}

		this.responseServiceTypes = {
      		  SUCCESS:'success'
    		, ERROR: 'error'
  		}
	}

	Settings.prototype = {
		setDataSession:function(data){
	    	var d = new Date();
	      	d.setTime(d.getTime() + 600000); // 10 Minu
	      	var expires = "expires="+d.toUTCString();
	      	document.cookie = "phronos=" + JSON.stringify(data) + "; " + expires;
	    },
  		getDataSession:function(){
	      	var name = "phronos=";
	      	var ca = document.cookie.split(';');
	      	for(var i=0; i<ca.length; i++) {
	        	var c = ca[i];
	          	while (c.charAt(0)==' ') c = c.substring(1);
	          	if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	      	}
	      	return "";
	    },
	    deleteDataSession:function(){
	    	document.cookie = 'phronos=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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