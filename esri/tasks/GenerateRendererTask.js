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
define(["dijit","dojo","dojox","dojo/require!esri/tasks/_task,esri/symbol"],function(_1,_2,_3){_2.provide("esri.tasks.GenerateRendererTask");_2.require("esri.tasks._task");_2.require("esri.symbol");_2.declare("esri.tasks.GenerateRendererTask",esri.tasks._Task,{constructor:function(_4,_5){this.url=_4;this._url.path+="/generateRenderer";this._handler=_2.hitch(this,this._handler);this.source=_5&&_5.source;this.gdbVersion=_5&&_5.gdbVersion;},_handler:function(_6,io,_7,_8,_9){try{var _a=esri.renderer.fromJson(_6);if(_6.type==="classBreaks"){_a._setMaxInclusiveness(true);}this._successHandler([_a],"onComplete",_7,_9);}catch(err){this._errorHandler(err,_8,_9);}},execute:function(_b,_c,_d){var _e=_2.mixin(_b.toJson(),{f:"json"}),_f=this._handler,_10=this._errorHandler;if(this.source){var _11={source:this.source.toJson()};_e.layer=_2.toJson(_11);}if(this.gdbVersion){_e.gdbVersion=this.gdbVersion;}var dfd=new _2.Deferred(esri._dfdCanceller);dfd._pendingDfd=esri.request({url:this._url.path,content:_e,callbackParamName:"callback",load:function(r,i){_f(r,i,_c,_d,dfd);},error:function(r){_10(r,_d,dfd);}});return dfd;},onComplete:function(){}});_2.declare("esri.tasks.GenerateRendererParameters",null,{classificationDefinition:null,where:null,toJson:function(){var _12={classificationDef:_2.toJson(this.classificationDefinition.toJson()),where:this.where};return _12;}});_2.declare("esri.tasks.ClassificationDefinition",null,{type:null,baseSymbol:null,colorRamp:null,toJson:function(){var _13={};if(this.baseSymbol){_2.mixin(_13,{baseSymbol:this.baseSymbol.toJson()});}if(this.colorRamp){_2.mixin(_13,{colorRamp:this.colorRamp.toJson()});}return _13;}});_2.declare("esri.tasks.ClassBreaksDefinition",esri.tasks.ClassificationDefinition,{type:"classBreaksDef",classificationField:null,classificationMethod:null,breakCount:null,standardDeviationInterval:null,normalizationType:null,normalizationField:null,toJson:function(){var _14=this.inherited(arguments);var _15;switch(this.classificationMethod.toLowerCase()){case "natural-breaks":_15="esriClassifyNaturalBreaks";break;case "equal-interval":_15="esriClassifyEqualInterval";break;case "quantile":_15="esriClassifyQuantile";break;case "standard-deviation":_15="esriClassifyStandardDeviation";break;case "geometrical-interval":_15="esriClassifyGeometricalInterval";break;default:_15=this.classificationMethod;}_2.mixin(_14,{type:this.type,classificationField:this.classificationField,classificationMethod:_15,breakCount:this.breakCount});if(this.normalizationType){var _16;switch(this.normalizationType.toLowerCase()){case "field":_16="esriNormalizeByField";break;case "log":_16="esriNormalizeByLog";break;case "percent-of-total":_16="esriNormalizeByPercentOfTotal";break;default:_16=this.normalizationType;}_2.mixin(_14,{normalizationType:_16});}if(this.normalizationField){_2.mixin(_14,{normalizationField:this.normalizationField});}if(this.standardDeviationInterval){_2.mixin(_14,{standardDeviationInterval:this.standardDeviationInterval});}return _14;}});_2.declare("esri.tasks.UniqueValueDefinition",esri.tasks.ClassificationDefinition,{type:"uniqueValueDef",attributeField:null,attributeField2:null,attributeField3:null,fieldDelimiter:null,toJson:function(){var _17=this.inherited(arguments);this.uniqueValueFields=[];if(this.attributeField){this.uniqueValueFields.push(this.attributeField);}if(this.attributeField2){this.uniqueValueFields.push(this.attributeField2);}if(this.attributeField3){this.uniqueValueFields.push(this.attributeField3);}_2.mixin(_17,{type:this.type,uniqueValueFields:this.uniqueValueFields});if(this.fieldDelimiter){_2.mixin(_17,{fieldDelimiter:this.fieldDelimiter});}return _17;}});_2.declare("esri.tasks.ColorRamp",null,{type:null});_2.declare("esri.tasks.AlgorithmicColorRamp",esri.tasks.ColorRamp,{type:"algorithmic",fromColor:null,toColor:null,algorithm:null,toJson:function(){var _18;switch(this.algorithm.toLowerCase()){case "cie-lab":_18="esriCIELabAlgorithm";break;case "hsv":_18="esriHSVAlgorithm";break;case "lab-lch":_18="esriLabLChAlgorithm";break;default:}var _19={type:"algorithmic",algorithm:_18};_19.fromColor=esri.symbol.toJsonColor(this.fromColor);_19.toColor=esri.symbol.toJsonColor(this.toColor);return _19;}});_2.declare("esri.tasks.MultipartColorRamp",esri.tasks.ColorRamp,{type:"multipart",colorRamps:[],toJson:function(){var _1a=_2.map(this.colorRamps,function(_1b){return _1b.toJson();});var _1c={type:"multipart",colorRamps:_1a};return _1c;}});});