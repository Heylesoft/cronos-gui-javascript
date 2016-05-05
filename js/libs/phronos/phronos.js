/*
 * phronos - v1.0.3
 * 
 * http://www.heylesoft.com
 *
 * Made by Heylesoft
 * Under MIT License
 */
if (typeof jQuery === 'undefined') { throw new Error('Phronos JavaScript requires jQuery') }

function Phronos(options){
	this.options = options;
  this.dataAccess = { };
  this.url = "http://localhost:3000";
  this.responseServiceTypes = {
      SUCCESS:'success'
    , ERROR: 'error'
  }
  this.ajaxTypes = {
      GET:'GET'
    , POST:'POST'
    , PUT:'PUT'
    , DELETE: 'DELETE'
  }
  this.ajaxRespondeTypes = {
      JSON:'json'
    , HTML:'html'
    , XML:'xml'
  }
  this.errors = {
      e100:{error:'SYSTEM_API_ERROR',code:100}
    , e101:{error:'IMCOMPLETE_PARAMETERS',code:101}
    , e102:{error:'DOMAIN_IS_NOT_VALID', code:102}
    , e103:{error:'NO_DATA_RESULT', code:103}
    , e201:{error:'INVALID_PASSWORD',code:201}
    , e202:{error:'INCORRECT_LOGIN',code:202}
    , e204:{error:'ERROR_TO_DELETE',code:204}
  }
	this.__init();
}

Phronos.prototype = {
	  __init: function () {
		  console.log('init Phronos');

      if(this.options == undefined){
        throw new Error('Phronos need option parameters');
      } else {
        if(this.options.username != undefined){
          this.dataAccess.username = this.options.username;
        } else {
          this.dataAccess.username = '';
        }

        if(this.options.key != undefined){
          this.dataAccess.key = this.options.key;
        } else {
          this.dataAccess.key = '';
        }
      }

      jQuery.support.cors = true;
	  }
  , __ajaxCall: function(options){
      var phronos = this;

      console.log("point-->" + phronos.url + options.service);
      console.log('type-->' + options.requestMethod);

      jQuery.ajax({
        url: phronos.url + options.service,
        type:options.requestMethod,
        dataType:options.responseType,
        username: phronos.dataAccess.username,
        password: phronos.dataAccess.key,
        data:options.data,
        success: function(data,status,xhr){
          // TODO: status redirects
          options.onResponse(data);
        },
        error: function(xhr, status, error){
          console.log(error);
          throw new Error('Phronos xhr error');
        }
      });
    }
  , __responseError: function(code){
      var phronos = this;
      var response;

      switch(code){
        case 100:
          response = phronos.errors.e100;
        break;

        case 101:
          response = phronos.errors.e101;
        break;

        case 102:
          response = phronos.errors.e102;
        break;

        default:
          response = phronos.errors.e100;
        break;
      }

      return response;
    }
  , __setDataSession:function(data){
      var d = new Date();
      d.setTime(d.getTime() + 600000); // 10 Minu
      var expires = "expires="+d.toUTCString();
      document.cookie = "phronos=" + JSON.stringify(data) + "; " + expires;
    }
  , ___getDataSession:function(){
      var name = "phronos=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
      }
      return "";
    }
  , getAccount: function(callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.POST, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/account',
        data:{
          account:sessionData.account,
          key:sessionData.key
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });        
    }
  , getPage:function(site, page, callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.POST, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/page',
        data:{
          account:sessionData.account,
          key:sessionData.key,
          site:site,
          page:page
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , getComponentMedia:function(callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.GET, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/media/image/',
        data:{
          account:sessionData.account,
          key:sessionData.key
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , onRenderUploadedImages:function(idComponent, onCompleteImage, onFinish){
      var phronos = this;

      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      var data = {};
      data.account = sessionData.account;
      data.key = sessionData.key;

      jQuery(idComponent).uploadifive({
          'auto':false,
          'fileType': 'image/*',
          'multi': false,
          'method':'post',
          'formData':data,
          'buttonText':'SELECT IMAGES',
          'width': 300,
          'uploadScript':phronos.url + '/media/image/upload/',
          'onUploadComplete':function(file, response){
            onCompleteImage(JSON.parse(response).data, phronos.getImage(JSON.parse(response).data.name, 'small'));
          },
          'onQueueComplete':function(status){
            onFinish();
          }
      });
    }
  , getImage:function(name, size){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      return phronos.url + '/media/image/' + name + '/' + size + '?account='+sessionData.account+'&key=' + sessionData.key;
    }
  , deleteImage:function(name, callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.DELETE, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/media/image/'+name,
        data:{
          account:sessionData.account,
          key:sessionData.key
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;

                case 204:
                  callback(phronos.errors.e204);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , getComponentGallery:function(gallery, callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.GET, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/gallery/' + gallery,
        data:{
          account:sessionData.account,
          key:sessionData.key
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;

                case 204:
                  callback(phronos.errors.e204);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , addElementGallery:function(elementData, gallery, callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.POST, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/gallery/element/' + gallery,
        data:{
          account:sessionData.account,
          key:sessionData.key,
          elementData:JSON.stringify(elementData)
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;

                case 204:
                  callback(phronos.errors.e204);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , editElementGallery:function(elementData, gallery, callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.PUT, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/gallery/element/' + gallery,
        data:{
          account:sessionData.account,
          key:sessionData.key,
          elementData:JSON.stringify(elementData)
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;

                case 204:
                  callback(phronos.errors.e204);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , deleteElementGallery:function(elementData, gallery, callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.DELETE, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/gallery/element/' + gallery,
        data:{
          account:sessionData.account,
          key:sessionData.key,
          elementData:JSON.stringify(elementData)
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;

                case 204:
                  callback(phronos.errors.e204);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , getCountries:function(callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);

      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.GET, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/common/countries',
        data:{
          account:sessionData.account,
          key:sessionData.key
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;

                case 204:
                  callback(phronos.errors.e204);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
  , getLenguages:function(callback){
      var phronos = this;
      var sessionData = JSON.parse(phronos.___getDataSession());
      phronos.__setDataSession(sessionData);
      
      phronos.__ajaxCall({
        requestMethod:phronos.ajaxTypes.GET, 
        responseType:phronos.ajaxRespondeTypes.JSON, 
        service:'/common/lenguages',
        data:{
          account:sessionData.account,
          key:sessionData.key
        },
        onResponse:function(responseObject){
          if(responseObject.type == phronos.responseServiceTypes.SUCCESS){
            if(typeof responseObject.data.code == 'number'){
              switch(responseObject.data.code){
                case 103:
                  callback(phronos.errors.e103);
                break;

                case 203:
                  callback(phronos.errors.e203);
                break;

                case 204:
                  callback(phronos.errors.e204);
                break;
              }
            } else {
              callback(responseObject.data);
            }
          }

          if(responseObject.type == phronos.responseServiceTypes.ERROR){
            callback(phronos.__responseError(responseObject.data.code));
          }
        }
      });
    }
};