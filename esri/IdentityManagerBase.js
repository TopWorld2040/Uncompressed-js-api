/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
define(["dijit","dojo","dojox","dojo/require!dojo/cookie,esri/utils"],function(_1,_2,_3){_2.provide("esri.IdentityManagerBase");_2.require("dojo.cookie");_2.require("esri.utils");(function(){var _4={};var _5=function(_6,_7){var _8=new _2._Url(_6).host,_9=new _2._Url(_7.server).host,_a=/.+\.arcgis\.com$/i;return (_a.test(_8)&&_a.test(_9));};_2.declare("esri.IdentityManagerBase",null,{constructor:function(){this._portalConfig=_2.getObject("esriGeowConfig");},serverInfos:[],credentials:[],tokenValidity:60,signInPage:null,_busy:null,_soReqs:[],_xoReqs:[],_gwTokenUrl:"/sharing/generateToken",_agsRest:"/rest/services",_agsAdmin:/https?:\/\/[^\/]+\/[^\/]+\/admin\/?(\/.*)?$/i,_agolSuffix:".arcgis.com",_gwDomains:[{regex:/https?:\/\/www\.arcgis\.com/i,tokenServiceUrl:"https://www.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/dev\.arcgis\.com/i,tokenServiceUrl:"https://dev.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/.*dev[^.]*\.arcgis\.com/i,tokenServiceUrl:"https://devext.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/.*qa[^.]*\.arcgis\.com/i,tokenServiceUrl:"https://qaext.arcgis.com/sharing/generateToken"},{regex:/https?:\/\/.*.arcgis\.com/i,tokenServiceUrl:"https://www.arcgis.com/sharing/generateToken"}],_regexSDirUrl:/http.+\/rest\/services\/?/ig,_regexServerType:/(\/(MapServer|GeocodeServer|GPServer|GeometryServer|ImageServer|NAServer|FeatureServer|GeoDataServer|GlobeServer|MobileServer)).*/ig,_gwUser:/http.+\/users\/([^\/]+)\/?.*/i,_gwItem:/http.+\/items\/([^\/]+)\/?.*/i,_gwGroup:/http.+\/groups\/([^\/]+)\/?.*/i,_errorCodes:[499,498,403,401],_publicUrls:[/\/arcgis\/tokens/i,/\/sharing\/generatetoken/i,/\/rest\/info/i],registerServers:function(_b){var _c=this.serverInfos;if(_c){_b=_2.filter(_b,function(_d){return !this.findServerInfo(_d.server);},this);this.serverInfos=_c.concat(_b);}else{this.serverInfos=_b;}},toJson:function(){return esri._sanitize({"serverInfos":_2.map(this.serverInfos,function(_e){return _e.toJson();}),"credentials":_2.map(this.credentials,function(_f){return _f.toJson();})});},initialize:function(_10){if(!_10){return;}if(_2.isString(_10)){_10=_2.fromJson(_10);}var _11=_10.serverInfos,_12=_10.credentials;if(_11){var _13=[];_2.forEach(_11,function(_14){if(_14.server&&_14.tokenServiceUrl){_13.push(_14.declaredClass?_14:new esri.ServerInfo(_14));}});if(_13.length){this.registerServers(_13);}}if(_12){_2.forEach(_12,function(crd){if(crd.userId&&crd.server&&crd.token&&crd.expires&&(crd.expires>(new Date()).getTime())){crd=crd.declaredClass?crd:new esri.Credential(crd);crd.onTokenChange();this.credentials.push(crd);}},this);}},findServerInfo:function(_15){var _16;_15=this._sanitizeUrl(_15);_2.some(this.serverInfos,function(_17){if(esri._hasSameOrigin(_17.server,_15,true)){_16=_17;}return !!_16;});return _16;},findCredential:function(_18,_19){var _1a;_18=this._sanitizeUrl(_18);if(_19){_2.some(this.credentials,function(crd){if(esri._hasSameOrigin(_18,crd.server,true)&&_19===crd.userId){_1a=crd;}return !!_1a;},this);}else{_2.some(this.credentials,function(crd){if(esri._hasSameOrigin(_18,crd.server,true)&&this._getIdenticalSvcIdx(_18,crd)!==-1){_1a=crd;}return !!_1a;},this);}return _1a;},getCredential:function(_1b,_1c){var _1d;if(esri._isDefined(_1c)){if(_2.isObject(_1c)){_1d=!!_1c.token;}else{_1d=_1c;}}_1b=this._sanitizeUrl(_1b);var dfd=new _2.Deferred(esri._dfdCanceller),err,_1e=this._isAdminResource(_1b),_1f=(_1d&&this._doPortalSignIn(_1b))?_2.cookie("esri_auth"):null;if(_1f){_1f=_2.fromJson(_1f);err=new Error("You are currently signed in as: '"+_1f.email+"'. You do not have access to this resource: "+_1b);err.code="IdentityManagerBase."+1;err.log=_2.config.isDebug;dfd.errback(err);return dfd;}var _20=this._findCredential(_1b,_1c);if(_20){dfd.callback(_20);return dfd;}var _21=this.findServerInfo(_1b);if(!_21){var _22=this._getTokenSvcUrl(_1b);if(!_22){err=new Error("Unknown resource - could not find token service endpoint.");err.code="IdentityManagerBase."+2;err.log=_2.config.isDebug;dfd.errback(err);return dfd;}_21=new esri.ServerInfo();_21.server=this._getOrigin(_1b);if(_2.isString(_22)){_21.tokenServiceUrl=_22;}else{_21._restInfoDfd=_22;}this.registerServers([_21]);}return this._enqueue(_1b,_21,_1c,dfd,_1e);},getResourceName:function(_23){if(this._isRESTService(_23)){return _23.replace(this._regexSDirUrl,"").replace(this._regexServerType,"")||"";}else{return (this._gwUser.test(_23)&&_23.replace(this._gwUser,"$1"))||(this._gwItem.test(_23)&&_23.replace(this._gwItem,"$1"))||(this._gwGroup.test(_23)&&_23.replace(this._gwGroup,"$1"))||"";}},generateToken:function(_24,_25,_26){var _27=_26&&_26.isAdmin;var _28=esri.request({url:_27?_24.adminTokenServiceUrl:_24.tokenServiceUrl,content:{request:"getToken",username:_25.username,password:_25.password,expiration:esri.id.tokenValidity,referer:(_27||_24.tokenServiceUrl.toLowerCase().indexOf("/sharing/generatetoken")!==-1)?window.location.href:null,client:_27?"referer":null,f:"json"},handleAs:"json"},{usePost:true,disableIdentityLookup:true,useProxy:this._useProxy(_24,_26)});_28.addCallback(function(_29){if(!_29||!_29.token){var err=new Error("Unable to generate token");err.code="IdentityManagerBase."+3;err.log=_2.config.isDebug;return err;}var _2a=_24.server;if(!_4[_2a]){_4[_2a]={};}_4[_2a][_25.username]=_25.password;return _29;});_28.addErrback(function(_2b){});return _28;},isBusy:function(){return !!this._busy;},setRedirectionHandler:function(_2c){this._redirectFunc=_2c;},setProtocolErrorHandler:function(_2d){this._protocolFunc=_2d;},signIn:function(){},_findCredential:function(_2e,_2f){var idx=-1,_30=_2f&&_2f.token,_31=_2.filter(this.credentials,function(crd){return esri._hasSameOrigin(crd.server,_2e,true);});if(_31.length){if(_31.length===1){idx=this._getIdenticalSvcIdx(_2e,_31[0]);if(_30){if(idx!==-1){_31[0].resources.splice(idx,1);}}else{if(idx===-1){_31[0].resources.push(_2e);}return _31[0];}}else{var _32,i;_2.some(_31,function(crd){i=this._getIdenticalSvcIdx(_2e,crd);if(i!==-1){_32=crd;idx=i;return true;}return false;},this);if(_30){if(_32){_32.resources.splice(idx,1);}}else{if(_32){return _32;}}}}},_useProxy:function(_33,_34){return (_34&&_34.isAdmin)||(!this._isPortalDomain(_33.tokenServiceUrl)&&_33.currentVersion==10.1&&!esri._hasSameOrigin(_33.tokenServiceUrl,window.location.href));},_getOrigin:function(_35){var uri=new _2._Url(_35);return uri.scheme+"://"+uri.host+(esri._isDefined(uri.port)?(":"+uri.port):"");},_sanitizeUrl:function(url){url=_2.trim(url);var _36=(esri.config.defaults.io.proxyUrl||"").toLowerCase(),_37=_36?url.toLowerCase().indexOf(_36+"?"):-1;if(_37!==-1){url=url.substring(_37+_36.length+1);}return esri.urlToObject(url).path;},_isRESTService:function(_38){return (_38.indexOf(this._agsRest)>-1);},_isAdminResource:function(_39){return this._agsAdmin.test(_39);},_isIdenticalService:function(_3a,_3b){var _3c;if(this._isRESTService(_3a)&&this._isRESTService(_3b)){var _3d=this._getSuffix(_3a).toLowerCase(),_3e=this._getSuffix(_3b).toLowerCase();_3c=(_3d===_3e);if(!_3c){var _3f=/(.*)\/(MapServer|FeatureServer).*/ig;_3c=(_3d.replace(_3f,"$1")===_3e.replace(_3f,"$1"));}}else{if(this._isPortalDomain(_3a)){_3c=true;}else{if(this._isAdminResource(_3a)&&this._isAdminResource(_3b)){return true;}}}return _3c;},_isPortalDomain:function(_40){_40=_40.toLowerCase();var _41=(new _2._Url(_40)).authority,_42=this._portalConfig,_43=(_41.indexOf(this._agolSuffix)!==-1);if(!_43&&_42){_43=esri._hasSameOrigin(_42.restBaseUrl,_40,true);}if(!_43){if(!this._arcgisUrl){var _44=_2.getObject("esri.arcgis.utils.arcgisUrl");if(_44){this._arcgisUrl=(new _2._Url(_44)).authority;}}if(this._arcgisUrl){_43=(this._arcgisUrl.toLowerCase()===_41);}}return _43;},_isIdProvider:function(_45,_46){var i=-1,j=-1;_2.forEach(this._gwDomains,function(_47,idx){if(i===-1&&_47.regex.test(_45)){i=idx;}if(j===-1&&_47.regex.test(_46)){j=idx;}});var _48=false;if(i>-1&&j>-1){if(i===0||i===4){if(j===0||j===4){_48=true;}}else{if(i===1){if(j===1||j===2){_48=true;}}else{if(i===2){if(j===2){_48=true;}}else{if(i===3){if(j===3){_48=true;}}}}}}if(!_48){var _49=this.findServerInfo(_46),_4a=_49&&_49.owningSystemUrl;if(_4a&&_5(_4a,_49)&&this._isPortalDomain(_4a)&&this._isIdProvider(_45,_4a)){_48=true;}}return _48;},_isPublic:function(_4b){_4b=this._sanitizeUrl(_4b);return _2.some(this._publicUrls,function(_4c){return _4c.test(_4b);});},_getIdenticalSvcIdx:function(_4d,_4e){var idx=-1;_2.some(_4e.resources,function(_4f,i){if(this._isIdenticalService(_4d,_4f)){idx=i;return true;}return false;},this);return idx;},_getSuffix:function(_50){return _50.replace(this._regexSDirUrl,"").replace(this._regexServerType,"$1");},_getTokenSvcUrl:function(_51){var _52,dfd;if(this._isRESTService(_51)){_52=_51.substring(0,_51.toLowerCase().indexOf("/rest/"))+"/admin/generateToken";_51=_51.substring(0,_51.toLowerCase().indexOf("/rest/")+"/rest/".length)+"info";if(this._isPortalDomain(_51)){_51=_51.replace(/http:/i,"https:");}dfd=esri.request({url:_51,content:{f:"json"},handleAs:"json",callbackParamName:"callback"});dfd.adminUrl_=_52;return dfd;}else{if(this._isPortalDomain(_51)){var url="";_2.some(this._gwDomains,function(_53){if(_53.regex.test(_51)){url=_53.tokenServiceUrl;return true;}return false;});if(!url){var _54=this._getOrigin(_51);url=_54.replace(/http:/i,"https:")+this._gwTokenUrl;}return url;}else{if(_51.toLowerCase().indexOf("premium.arcgisonline.com")!==-1){return "https://premium.arcgisonline.com/server/tokens";}else{if(this._isAdminResource(_51)){_52=_51.substring(0,_51.toLowerCase().indexOf("/admin/")+"/admin/".length)+"generateToken";_51=_51.substring(0,_51.toLowerCase().indexOf("/admin/"))+"/rest/info";dfd=esri.request({url:_51,content:{f:"json"},handleAs:"json",callbackParamName:"callback"});dfd.adminUrl_=_52;return dfd;}}}}},_doPortalSignIn:function(_55){if(_2.cookie.isSupported()){var _56=_2.cookie("esri_auth"),_57=this._portalConfig,_58=window.location.href,_59=this.findServerInfo(_55);if((_57||this._isPortalDomain(_58)||_56)&&(this._isPortalDomain(_55)||(_59&&_59.owningSystemUrl&&this._isPortalDomain(_59.owningSystemUrl)))&&(this._isIdProvider(_58,_55)||(_57&&(esri._hasSameOrigin(_57.restBaseUrl,_55,true)||this._isIdProvider(_57.restBaseUrl,_55))))){return true;}}return false;},_checkProtocol:function(_5a,_5b,_5c){var _5d=true,_5e=_5b.tokenServiceUrl;if(_2.trim(_5e).toLowerCase().indexOf("https:")===0&&window.location.href.toLowerCase().indexOf("https:")!==0&&!esri._canDoXOXHR(_5e)&&!esri._canDoXOXHR(esri._getProxyUrl(true).path)){_5d=this._protocolFunc?!!this._protocolFunc({resourceUrl:_5a,serverInfo:_5b}):false;if(!_5d){var err=new Error("Aborted the Sign-In process to avoid sending password over insecure connection.");err.code="IdentityManagerBase."+4;err.log=_2.config.isDebug;console.log(err.message);_5c(err);}}return _5d;},_enqueue:function(_5f,_60,_61,dfd,_62){if(!dfd){dfd=new _2.Deferred(esri._dfdCanceller);}dfd.resUrl_=_5f;dfd.sinfo_=_60;dfd.options_=_61;dfd.admin_=_62;if(this._busy){if(esri._hasSameOrigin(_5f,this._busy.resUrl_,true)){this._soReqs.push(dfd);}else{this._xoReqs.push(dfd);}}else{this._doSignIn(dfd);}return dfd;},_doSignIn:function(dfd){this._busy=dfd;var _63=this;var _64=function(_65){if(!_65.resources){_65.resources=[];}_65.resources.push(dfd.resUrl_);_65.onTokenChange();if(_2.indexOf(_63.credentials,_65)===-1){_63.credentials.push(_65);}var _66=_63._soReqs,_67={};_63._soReqs=[];_2.forEach(_66,function(_68){if(!this._isIdenticalService(dfd.resUrl_,_68.resUrl_)){var _69=this._getSuffix(_68.resUrl_);if(!_67[_69]){_67[_69]=true;_65.resources.push(_68.resUrl_);}}},_63);dfd.callback(_65);_2.forEach(_66,function(_6a){_6a.callback(_65);});_63._busy=dfd.resUrl_=dfd.sinfo_=null;if(_63._xoReqs.length){_63._doSignIn(_63._xoReqs.shift());}},_6b=function(_6c){dfd.errback(_6c);_63._busy=dfd.resUrl_=dfd.sinfo_=null;if(_63._soReqs.length){_63._doSignIn(_63._soReqs.shift());}if(_63._xoReqs.length){_63._doSignIn(_63._xoReqs.shift());}},_6d=function(){if(_63._doPortalSignIn(dfd.resUrl_)){var _6e=_2.cookie("esri_auth"),_6f=_63._portalConfig;if(_6e){_6e=_2.fromJson(_6e);_64(new esri.Credential({userId:_6e.email,server:dfd.sinfo_.server,token:_6e.token,expires:null}));return;}else{var _70="",_71=window.location.href;if(_63.signInPage){_70=_63.signInPage;}else{if(_6f){_70=_6f.baseUrl+_6f.signin;}else{if(_63._isIdProvider(_71,dfd.resUrl_)){_70=_63._getOrigin(_71)+"/home/signin.html";}else{_70=dfd.sinfo_.server+"/home/signin.html";}}}_70=_70.replace(/http:/i,"https:");if(_6f&&_6f.useSSL===false){_70=_70.replace(/https:/i,"http:");}if(_71.toLowerCase().replace("https","http").indexOf(_70.toLowerCase().replace("https","http"))===0){var err=new Error("Cannot redirect to Sign-In page from within Sign-In page. URL of the resource that triggered this workflow: "+dfd.resUrl_);err.code="IdentityManagerBase."+5;err.log=_2.config.isDebug;_6b(err);}else{if(_63._redirectFunc){_63._redirectFunc({signInPage:_70,returnUrlParamName:"returnUrl",returnUrl:_71,resourceUrl:dfd.resUrl_,serverInfo:dfd.sinfo_});}else{window.location=_70+"?returnUrl="+window.escape(_71);}}return;}}else{if(_63._checkProtocol(dfd.resUrl_,dfd.sinfo_,_6b)){var _72=dfd.options_;if(dfd.admin_){_72=_72||{};_72.isAdmin=true;}dfd._pendingDfd=_63.signIn(dfd.resUrl_,dfd.sinfo_,_72).addCallbacks(_64,_6b);}}};var _73=dfd.sinfo_.tokenServiceUrl;if(_73){_6d();}else{dfd.sinfo_._restInfoDfd.addCallbacks(function(_74){var _75=dfd.sinfo_;_75.adminTokenServiceUrl=_75._restInfoDfd.adminUrl_;_75._restInfoDfd=null;_75.tokenServiceUrl=_2.getObject("authInfo.tokenServicesUrl",false,_74)||_2.getObject("authInfo.tokenServiceUrl",false,_74)||_2.getObject("tokenServiceUrl",false,_74);_75.shortLivedTokenValidity=_2.getObject("authInfo.shortLivedTokenValidity",false,_74);_75.currentVersion=_74.currentVersion;_75.owningTenant=_74.owningTenant;var _76=(_75.owningSystemUrl=_74.owningSystemUrl);if(_76&&_5(_76,_75)){var _77=_63.findCredential(_76);if(!_77){_2.some(_63.credentials,function(_78){if(this._isIdProvider(_76,_78.server)){_77=_78;}return !!_77;},_63);}if(_77){_77=_77.toJson();_77.resources=null;_77.server=_75.server;_64(new esri.Credential(_77));return;}}_6d();},function(){dfd.sinfo_._restInfoDfd=null;var err=new Error("Unknown resource - could not find token service endpoint.");err.code="IdentityManagerBase."+2;err.log=_2.config.isDebug;_6b(err);});}}});_2.declare("esri.ServerInfo",null,{constructor:function(_79){_2.mixin(this,_79);},toJson:function(){return esri._sanitize({server:this.server,tokenServiceUrl:this.tokenServiceUrl,adminTokenServiceUrl:this.adminTokenServiceUrl,shortLivedTokenValidity:this.shortLivedTokenValidity,owningSystemUrl:this.owningSystemUrl,owningTenant:this.owningTenant,currentVersion:this.currentVersion});}});_2.declare("esri.Credential",null,{tokenRefreshBuffer:2,constructor:function(_7a){_2.mixin(this,_7a);this.resources=this.resources||[];if(!esri._isDefined(this.creationTime)){this.creationTime=(new Date()).getTime();}},refreshToken:function(){var _7b=this,_7c=esri.id.findServerInfo(this.server),_7d=_4[this.server],_7e=_7d&&_7d[this.userId];if(!_7e){var dfd,_7f=this.resources&&this.resources[0];if(_7f){_7f=esri.id._sanitizeUrl(_7f);this._enqueued=1;dfd=esri.id._enqueue(_7f,_7c,null,null,this.isAdmin);dfd.addBoth(function(){_7b._enqueued=0;});}return dfd;}return esri.id.generateToken(_7c,{username:_7b.userId,password:_7e},_7b.isAdmin?{isAdmin:true}:null).addCallback(function(_80){_7b.token=_80.token;_7b.expires=esri._isDefined(_80.expires)?Number(_80.expires):null;_7b.creationTime=(new Date()).getTime();_7b.onTokenChange();}).addErrback(function(){});},onTokenChange:function(){clearTimeout(this._refreshTimer);if(esri._isDefined(this.expires)||esri._isDefined(this.validity)){this._startRefreshTimer();}},onDestroy:function(){},destroy:function(){this.userId=this.server=this.token=this.expires=this.validity=this.resources=this.creationTime=null;var _81=_2.indexOf(esri.id.credentials,this);if(_81>-1){esri.id.credentials.splice(_81,1);}this.onTokenChange();this.onDestroy();},toJson:function(){return this._toJson();},_toJson:function(){var _82=esri._sanitize({userId:this.userId,server:this.server,token:this.token,expires:this.expires,validity:this.validity,ssl:this.ssl,isAdmin:this.isAdmin,creationTime:this.creationTime});var _83=this.resources;if(_83&&_83.length>0){_82.resources=_83;}return _82;},_startRefreshTimer:function(){clearTimeout(this._refreshTimer);var _84=this.tokenRefreshBuffer*60000,_85=this.validity?(this.creationTime+(this.validity*60000)):this.expires,_86=(_85-(new Date()).getTime());if(_86<0){_86=0;}this._refreshTimer=setTimeout(_2.hitch(this,this.refreshToken),(_86>_84)?(_86-_84):_86);}});}());});