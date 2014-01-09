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
define(["dijit","dojo","dojox","dojo/require!dojo/data/ItemFileReadStore,dojox/grid/DataGrid,dijit/_Widget,dijit/_Templated,dojox/gfx,esri/utils,esri/symbol"],function(_1,_2,_3){_2.provide("esri.dijit.editing.TemplatePicker");_2.require("dojo.data.ItemFileReadStore");_2.require("dojox.grid.DataGrid");_2.require("dijit._Widget");_2.require("dijit._Templated");_2.require("dojox.gfx");_2.require("esri.utils");_2.require("esri.symbol");(function(){var _4=[_2.moduleUrl("esri.dijit.editing","css/TemplatePicker.css"),_2.moduleUrl("dojox","grid/resources/Grid.css")];var _5=document.getElementsByTagName("head").item(0),_6,i,il=_4.length;for(i=0;i<il;i++){_6=document.createElement("link");_6.type="text/css";_6.rel="stylesheet";_6.href=_4[i].toString();_5.appendChild(_6);}}());_2.declare("esri.dijit.editing.TemplatePicker",[_1._Widget,_1._Templated],{widgetsInTemplate:true,templateString:"<div class=\"templatePicker\">\r\n\r\n  <table dojoType=\"dojox.grid.DataGrid\" noDataMessage=\"${emptyMessage}\" selectionMode=\"none\" autoHeight=\"${_rows}\" autoWidth=\"${_autoWidth}\"\r\n         query=\"{ query: '*' }\" dojoAttachPoint=\"grid\" class=\"grid\">\r\n  </table>\r\n  \r\n</div>",basePath:_2.moduleUrl("esri.dijit.editing"),featureLayers:null,items:null,grouping:true,showTooltip:false,maxLabelLength:0,rows:4,columns:3,surfaceWidth:30,surfaceHeight:30,emptyMessage:"",useLegend:true,legendCache:{},_uniqueId:{id:0},_assumedCellWidth:90,_initialAutoWidth:300,_initialAutoHeight:200,_ieTimer:150,constructor:function(_7,_8){_7=_7||{};if(!_7.items&&!_7.featureLayers){console.error("TemplatePicker: please provide 'featureLayers' or 'items' parameter in the constructor");}this._dojo14x=(_2.version.minor>=4);this._itemWidgets={};if(_7.featureLayers&&_7.featureLayers.length){this._flChanged=1;}this._nls=_2.getObject("bundle.widgets.templatePicker",false,esri);this.emptyMessage=_7.emptyMessage||(this._nls&&this._nls.creationDisabled)||"";},postMixInProperties:function(){this.inherited(arguments);this._preprocess();},startup:function(){this.inherited(arguments);if(this.rows==="auto"&&this.columns==="auto"){var _9=_2.contentBox(this.domNode);if(!_9.w){this.domNode.style.width=this._initialAutoWidth+"px";}if(!_9.h){this.domNode.style.height=this._initialAutoHeight+"px";}_9=_2.contentBox(this.domNode);this._columns=Math.floor(_9.w/this._assumedCellWidth)||1;}this._applyGridPatches();this._setGridLayout();_2.connect(this.grid,"onRowClick",this,this._rowClicked);this._setGridData();this._toggleTooltip();if(_2.isIE<9){this._repaintItems=_2.hitch(this,this._repaintItems);setTimeout(this._repaintItems,this._ieTimer);}},destroy:function(){this.showTooltip=false;this._toggleTooltip();this._clearLegendInfo();this.featureLayers=this.items=this.grid=this._flItems=this._itItems=this._groupRowIndices=this._selectedCell=this._selectedInfo=this._selectedItem=null;this.inherited(arguments);},getSelected:function(){return this._selectedCell?this._selectedItem:null;},clearSelection:function(){var _a=this._selectedCell,_b=this._selectedInfo;if(_a){this._rowClicked({cellNode:_a,rowIndex:_b.selRow,cellIndex:_b.selCol});}},update:function(_c){var _d=(this.rows==="auto"&&this.columns==="auto"&&_c)?true:false,_e=this.grid,_f;if(_d){var _10=this.domNode,id=_10.id,_11,_12=_2.query("#"+id+".templatePicker div.item")[0];_f=_2.contentBox(_10);_12=_12&&_12.parentNode;if(_12){_11=_2.coords(_12).w;}else{_11=this._assumedCellWidth;}this._columns=Math.floor((_f.w-_e.views.views[0].getScrollbarWidth())/_11);this._columns=this._columns||1;}var _13=this._rows;this._preprocess();var _14=this._rows;this._setGridLayout();this._setGridData();if(_14!==_13){_e.set("autoHeight",this._rows,false);}if(_d){_e._resize({w:_f.w,h:_f.h});_e.viewsHeaderNode.style.display="none";}else{_e.update();}this._toggleTooltip();var _15=this,_16=this.getSelected();if(_16){_e.store.fetch({onComplete:function(its){var _17=_15._locate(_16,_15._selectedInfo,its);var _18=_17&&_e.views.views[0].getCellNode(_17[0],_17[1]);if(_18){_15._rowClicked({cellNode:_18,rowIndex:_17[0],cellIndex:_17[1]},true);}}});}if(_2.isIE<9){setTimeout(this._repaintItems,this._ieTimer);}var _19=this.featureLayers,_1a=this.items;if((!_19||!_19.length)&&(!_1a||!_1a.length)&&_e&&this.emptyMessage){_e.showMessage(this.emptyMessage);}},onSelectionChange:function(){},_setUseLegendAttr:function(use){var _1b=this.useLegend;if(!this._started||_1b!==use){if(use){this._flChanged=1;}else{this._clearLegendInfo();}}this.useLegend=use;},_setFeatureLayersAttr:function(_1c){var _1d=this.featureLayers;if(!this._started||_1d!==_1c){this._flChanged=1;}this.featureLayers=_1c;},_preprocess:function(){if(this.items){this.grouping=false;}this._autoWidth=false;if(this.rows==="auto"||this.columns==="auto"){this._autoWidth=true;}var _1e;if(this.featureLayers){if(this.useLegend&&this._flChanged){this._legendIndices=[];this._loadingIndices=[];this._legendSymbols={};this._ignoreLegends();this._loadingLegends=[];clearTimeout(this._legendTimer);this._legendTimer=null;this._processSelectionLayers();this._flChanged=0;}_1e=this._flItems=this._getItemsFromLayers(this.featureLayers);}else{_1e=this._itItems=this._getItemsFromItems(this.items);}if(this.rows==="auto"&&this.columns==="auto"){if(!this._started){this._rows=false;this._columns=null;this._autoWidth=false;}return;}var len=0;this._rows=this.rows;this._columns=this.columns;if(this.rows==="auto"){if(this.featureLayers){if(this.grouping){len=_1e.length;_2.forEach(_1e,function(_1f){len+=Math.ceil(_1f.length/this.columns);},this);}else{_2.forEach(_1e,function(_20){len+=_20.length;},this);len=Math.ceil(len/this.columns);}}else{len=Math.ceil(_1e.length/this.columns);}this._rows=len;}else{if(this.columns==="auto"){if(this.featureLayers){if(this.grouping){len=3;}else{_2.forEach(_1e,function(_21){len+=_21.length;},this);len=Math.ceil(len/this.rows);}}else{len=Math.ceil(_1e.length/this.rows);}this._columns=len;}}},_processSelectionLayers:function(){var map,_22,_23,_24,key,_25,_26,_27={};_2.forEach(this.featureLayers,function(_28,idx){if(_28.mode===esri.layers.FeatureLayer.MODE_SELECTION&&_28._map&&_28.url&&_28._params.drawMode&&!_28.source){_22=_2.trim(_28._url.path).replace(/\/(MapServer|FeatureServer).*/ig,"/MapServer").replace(/^https?:\/\//ig,"").toLowerCase();_23=(_27[_22]=_27[_22]||{});_24=(_23.featureLayers=_23.featureLayers||{});_25=(_23.indices=_23.indices||[]);_24[idx]=_28;_25.push(idx);map=_28._map;}});if(map){_2.forEach(map.layerIds,function(_29){_29=map.getLayer(_29);if(_29&&_29.url&&(_29.getImageUrl||_29.getTileUrl)&&_29.loaded&&_29.version>=10.1){_22=_2.trim(_29._url.path).replace(/(\/MapServer).*/ig,"$1");key=_22.replace(/^https?:\/\//ig,"").toLowerCase();if(_27[key]&&(!_27[key].mapServiceUrl)){_23=_27[key];_23.mapServiceUrl=_22;_23.mapServiceLayer=_29;this._legendIndices=this._legendIndices.concat(_23.indices);_26=this._fetchLegend({pickerInstance:this,info:_23},key);if(_26.then){this._loadingIndices=this._loadingIndices.concat(_23.indices);this._loadingLegends.push(_26);}else{this._processLegendResponse(_26,_23);}}}},this);}},_fetchLegend:function(_2a,key){var _2b=esri.dijit.editing.TemplatePicker.prototype,_2c=_2b.legendCache[key];if(!_2c){_2c=(_2b.legendCache[key]=esri.request({url:_2a.info.mapServiceUrl+"/legend",content:{f:"json"},callbackParamName:"callback"}));_2c._contexts=[_2a];_2c.addBoth(function(_2d){if(_2c.canceled){return;}_2b.legendCache[key]=_2d;var _2e=_2c._contexts;_2c._contexts=null;_2.forEach(_2e,function(_2f){var _30=_2f.pickerInstance,_31=_2f.info,_32;if(_30._destroyed){return;}_2.forEach(_31.indices,function(idx){_32=_2.indexOf(_30._loadingIndices,idx);if(_32>-1){_30._loadingIndices.splice(_32,1);}});_32=_2.indexOf(_30._loadingLegends,_2c);if(_32>-1){_30._loadingLegends.splice(_32,1);}_30._processLegendResponse(_2d,_31);});});}else{if(_2c.then){_2c._contexts.push(_2a);}}return _2c;},_clearLegendInfo:function(){clearTimeout(this._legendTimer);this._ignoreLegends();this._legendIndices=this._loadingIndices=this._legendSymbols=this._loadingLegends=this._legendTimer=null;},_ignoreLegends:function(){if(this._loadingLegends){_2.forEach(this._loadingLegends,function(_33){var _34=-1;_2.some(_33._contexts,function(_35,idx){if(_35.pickerInstance===this){_34=idx;}return (_34>-1);},this);if(_34>-1){_33._contexts.splice(_34,1);}},this);}},_processLegendResponse:function(_36,_37){if(_36&&!(_36 instanceof Error)){_2.forEach(_37.indices,function(idx){var _38=_37.featureLayers[idx].layerId,i,_39=_37.mapServiceUrl+"/"+_38+"/images/",_3a=_37.mapServiceLayer._getToken(),_3b,obj,_3c,url;if(this._legendSymbols[idx]){return;}_3b=null;_2.some(_36.layers,function(_3d){if(_3d.layerId==_38){_3b=_3d;}return !!_3b;});if(_3b){obj=(this._legendSymbols[idx]={});_2.forEach(_3b.legend,function(_3e){_3c=_3e.values;if(_3c&&_3c.length){for(i=0;i<_3c.length;i++){obj[_3c[i]]=_3e;}}else{obj.defaultSymbol=_3e;}url=_3e.url;if(url&&!_3e._fixed){_3e._fixed=1;if((url.search(/https?\:/)===-1)){_3e.url=_39+url;}if(_3a&&_3e.url.search(/https?\:/)!==-1){_3e.url+=(((_3e.url.indexOf("?")>-1)?"&":"?")+"token="+_3a);}}});}},this);}else{var _3f;_2.forEach(_37.indices,function(idx){_3f=_2.indexOf(this._legendIndices,idx);if(_3f>-1){this._legendIndices.splice(_3f,1);}},this);}var _40=this;if(_40._started&&!_40._legendTimer){_40._legendTimer=setTimeout(function(){clearTimeout(_40._legendTimer);_40._legendTimer=null;if(!_40._destroyed){_40.update();}},0);}},_applyGridPatches:function(){var _41=this.grid;var _42=_41.adaptWidth,_43,i,_44;_41.adaptWidth=function(){_43=this.views.views;for(i=0;_44=_43[i];i++){_2.style(_44.headerNode,"display","block");}_42.apply(this,arguments);for(i=0;_44=_43[i];i++){_2.style(_44.headerNode,"display","none");}};if(this._dojo14x){if(this.rows!=="auto"&&this.columns!=="auto"){var _45=_2.connect(_41,"_onFetchComplete",this,function(){_2.disconnect(_45);this.grid.set("autoHeight",this._rows);});}_2.connect(_41,"_onDelete",this,this._destroyItems);_2.connect(_41,"_clearData",this,this._destroyItems);_2.connect(_41,"destroy",this,this._destroyItems);var _46=_41.focus;if(_46&&_46.findAndFocusGridCell){_46.findAndFocusGridCell=function(){return false;};}}},_setGridLayout:function(){var _47=function(_48){return function(_49,_4a){return this._cellGet(_48,_49,_4a);};};var _4b=_2.hitch(this,this._cellFormatter),_4c=[],_4d=this._columns,i;for(i=0;i<_4d;i++){_4c.push({field:"cell"+i,get:_2.hitch(this,_47(i)),formatter:_4b});}var _4e={cells:[_4c]};if(this.grouping){var _4f={field:"groupName",colSpan:_4d,get:_2.hitch(this,this._cellGetGroup),formatter:_2.hitch(this,this._cellGroupFormatter)};_4e.cells.push([_4f]);}var _50=this.grid,_51=_3.grid.DataGrid.prototype.rowsPerPage;_50.set("rowsPerPage",(this._rows>_51)?this._rows:_51);_50.set("structure",_4e);},_setGridData:function(){var _52=[];if(this.grouping){this._groupRowIndices=[];var _53,_54,_55=this._columns;_2.forEach(this._flItems,function(_56,idx){_52.push({});var _57=(idx===0)?0:(_53+_54+1);this._groupRowIndices.push(_57);_53=_57;_54=Math.ceil(_56.length/_55);_52=_52.concat(this._getStoreItems(_56));},this);}else{if(this.featureLayers){_2.forEach(this._flItems,function(_58){_52=_52.concat(_58);});_52=this._getStoreItems(_52);}else{_52=this._getStoreItems(this._itItems);}}var _59=new _2.data.ItemFileReadStore({data:{items:_52}});this.grid.setStore(_59);},_toggleTooltip:function(){if(this.showTooltip){if(this.tooltip){return;}this.tooltip=_2.create("div",{"class":"tooltip"},this.domNode);this.tooltip.style.display="none";this.tooltip.style.position="fixed";var _5a=this.grid;this._mouseOverConnect=_2.connect(_5a,"onCellMouseOver",this,this._cellMouseOver);this._mouseOutConnect=_2.connect(_5a,"onCellMouseOut",this,this._cellMouseOut);}else{if(this.tooltip){_2.disconnect(this._mouseOverConnect);_2.disconnect(this._mouseOutConnect);_2.destroy(this.tooltip);this.tooltip=null;}}},_rowClicked:function(evt,_5b){var _5c=evt.cellNode,row=evt.rowIndex,col=evt.cellIndex;var _5d=this._getCellInfo(_5c,row,col);if(!_5d){return;}var _5e=this.grid.store;if(_5e.getValue(_5d,"loadingCell")){return;}if(this._selectedCell){_2.removeClass(this._selectedCell,"selectedItem");}if(_5c!==this._selectedCell){_2.addClass(_5c,"selectedItem");this._selectedCell=_5c;this._selectedItem={featureLayer:_5e.getValue(_5d,"layer"),type:_5e.getValue(_5d,"type"),template:_5e.getValue(_5d,"template"),symbolInfo:_5e.getValue(_5d,"symbolInfo"),item:this._getItem(_5d)};this._selectedInfo={selRow:row,selCol:col,index1:_5e.getValue(_5d,"index1"),index2:_5e.getValue(_5d,"index2"),index:_5e.getValue(_5d,"index")};}else{this._selectedCell=this._selectedInfo=this._selectedItem=null;}if(!_5b){this.onSelectionChange();}},_locate:function(_5f,_60,_61){var _62=this.grid.store,_63=new Array(this._columns);var _64,_65=_60.index1,_66=_60.index2,_67=_60.index,_68=_5f.item;_2.some(_61,function(_69,_6a){return _2.some(_63,function(_6b,_6c){var _6d=_62.getValue(_69,"cell"+_6c);if(_6d&&(_68?(_67===_62.getValue(_6d,"index")):(_65===_62.getValue(_6d,"index1")&&_66===_62.getValue(_6d,"index2")))){_64=[_6a,_6c];return true;}else{return false;}});});return _64;},_getCellInfo:function(_6e,row,col){if(!_6e){return;}var _6f=this.grid;var _70=_6f.getItem(row);var _71=_6f.store.getValue(_70,"cell"+col);return _71;},_getItem:function(_72){var _73=this.items;if(_73){return _73[this.grid.store.getValue(_72,"index")];}},_cellMouseOver:function(evt){var _74=this.tooltip;var _75=evt.cellNode,row=evt.rowIndex,col=evt.cellIndex;var _76=this._getCellInfo(_75,row,col);if(_74&&_76){var _77=this.grid.store;var _78=_77.getValue(_76,"template");var _79=_77.getValue(_76,"type");var _7a=_77.getValue(_76,"symbolInfo");var _7b=_77.getValue(_76,"layer");var _7c=this._getItem(_76);var _7d=(_7c&&(_7c.label+(_7c.description?(": "+_7c.description):"")))||(_78&&(_78.name+(_78.description?(": "+_78.description):"")))||(_79&&_79.name)||(_7a&&(_7a.label+(_7a.description?(": "+_7a.description):"")))||((_7b&&_7b.name+": ")+"Default");_74.style.display="none";_74.innerHTML=_7d;var _7e=_2.coords(_75.firstChild);_2.style(_74,{left:(_7e.x)+"px",top:(_7e.y+_7e.h+5)+"px"});_74.style.display="";}},_cellMouseOut:function(){var _7f=this.tooltip;if(_7f){_7f.style.display="none";}},_destroyItems:function(){var _80=this._itemWidgets,w;for(w in _80){if(!_80[w]){continue;}_80[w].destroy();delete _80[w];}},_repaintItems:function(){var _81=this._itemWidgets,w;for(w in _81){var _82=_81[w];if(_82){_82._repaint(_82._surface);}}},_getStoreItems:function(_83){var uid=this._uniqueId;_83=_2.map(_83,function(_84){return _2.mixin({"surfaceId":"tpick-surface-"+(uid.id++)},_84);});var len=_83.length,_85=0,obj={},k=0,_86,_87=[],_88=true,_89=this._columns;while(_85<len){_88=true;_86="cell"+k;obj[_86]=_83[_85];_85++;k++;if(k%_89===0){_88=false;_87.push(obj);obj={};k=0;}}if(_88&&len){_87.push(obj);}return _87;},_getItemsFromLayers:function(_8a){var _8b=[];_2.forEach(_8a,function(_8c,_8d){_8b.push(this._getItemsFromLayer(_8c,_8d));},this);return _8b;},_getItemsFromLayer:function(_8e,_8f){var _90=[];if(this.useLegend&&_2.indexOf(this._loadingIndices,_8f)>-1){return [{label:(this._nls&&this._nls.loading)||"",symbol:null,layer:_8e,type:null,template:null,index1:_8f,index2:0,loadingCell:1}];}var _91=[];_91=_91.concat(_8e.templates);_2.forEach(_8e.types,function(_92){var _93=_92.templates;_2.forEach(_93,function(_94){_94._type_=_92;});_91=_91.concat(_93);});_91=_2.filter(_91,esri._isDefined);var _95=_8e.renderer;if(_95){var _96=_95.declaredClass.replace("esri.renderer.","");if(_91.length>0){_2.forEach(_91,function(_97){var _98=_97.prototype;if(_98){var _99=_95.getSymbol(_98);if(_99){var _9a=null,pms,_9b;if(this.useLegend&&_2.indexOf(this._legendIndices,_8f)>-1){_9b=this._legendSymbols&&this._legendSymbols[_8f];if(_9b){switch(_96){case "SimpleRenderer":_9a=_9b.defaultSymbol;break;case "UniqueValueRenderer":_2.some(_95.infos,function(_9c){if(_9c.symbol===_99){_9a=_9b[_9c.value];}return !!_9a;});break;case "ClassBreaksRenderer":_2.some(_95.infos,function(_9d){if(_9d.symbol===_99){_9a=_9b[_9d.maxValue];}return !!_9a;});break;}}if(_9a){pms=_2.fromJson(_2.toJson(esri.symbol.defaultPictureMarkerSymbol));pms.url=_9a.url;pms.imageData=_9a.imageData;pms.contentType=_9a.contentType;pms.width=_9a.width;pms.height=_9a.height;if(!esri._isDefined(pms.width)||!esri._isDefined(pms.height)){pms.width=15;pms.height=15;}_9a=new esri.symbol.PictureMarkerSymbol(pms);}}_90.push({label:this._trimLabel(_97.name),symbol:_9a||_99,legendOverride:!!_9a,layer:_8e,type:_97._type_,template:_97,index1:_8f,index2:_90.length});}}delete _97._type_;},this);}else{var _9e=[];if(_96==="TemporalRenderer"){_95=_95.observationRenderer;if(_95){_96=_95.declaredClass.replace("esri.renderer.","");}}switch(_96){case "SimpleRenderer":_9e=[{symbol:_95.symbol,label:_95.label,description:_95.description}];break;case "UniqueValueRenderer":case "ClassBreaksRenderer":_9e=_95.infos;break;}_90=_2.map(_9e,function(_9f,idx){return {label:this._trimLabel(_9f.label),description:_9f.description,symbolInfo:_2.mixin({constructor:function(){}},_9f),symbol:_9f.symbol,layer:_8e,index1:_8f,index2:idx};},this);}}return _90;},_getItemsFromItems:function(_a0){return _2.map(_a0,function(_a1,idx){_a1=_2.mixin({index:idx},_a1);_a1.label=this._trimLabel(_a1.label);return _a1;},this);},_trimLabel:function(_a2){var max=this.maxLabelLength;if(max&&_a2){if(_a2.length>max){_a2=_a2.substr(0,max)+"...";}}return _a2||"";},_cellGet:function(_a3,_a4,_a5){if(!_a5){return "";}return this.grid.store.getValue(_a5,"cell"+_a3);},_cellFormatter:function(_a6){if(_a6){var _a7=this._itemWidgets,_a8=this.grid.store;var sid=_a8.getValue(_a6,"surfaceId");var w=_a7[sid];if(!w){w=(_a7[sid]=new esri.dijit.editing.TemplatePickerItem({id:sid,label:_a8.getValue(_a6,"label"),symbol:_a8.getValue(_a6,"symbol"),legendOverride:_a8.getValue(_a6,"legendOverride"),surfaceWidth:this.surfaceWidth,surfaceHeight:this.surfaceHeight,template:_a8.getValue(_a6,"template")}));}return w||"";}else{return "";}},_cellGetGroup:function(_a9,_aa){if(!this._groupRowIndices){return "";}var _ab=_2.indexOf(this._groupRowIndices,_a9);if(!_aa||_ab===-1){return "";}return (this.featureLayers[_ab]&&this.featureLayers[_ab].name)||"";},_cellGroupFormatter:function(_ac){if(_ac){return "<div class='groupLabel'>"+_ac+"</div>";}else{return "";}}});_2.declare("esri.dijit.editing.TemplatePickerItem",[_1._Widget,_1._Templated],{templateString:"<div class='item' style='text-align: center;'>"+"<div class='itemSymbol' dojoAttachPoint='_surfaceNode'></div>"+"<div class='itemLabel'>${label}</div>"+"</div>",startup:function(){if(this._started){return;}this.inherited(arguments);this._surface=this._draw(this._surfaceNode,this.symbol,this.surfaceWidth,this.surfaceHeight,this.template);},_draw:function(_ad,_ae,_af,_b0,_b1){if(!_ae){return;}var _b2=_3.gfx.createSurface(_ad,_af,_b0);if(_2.isIE<9){var _b3=_b2.getEventSource();_2.style(_b3,"position","relative");_2.style(_b3.parentNode,"position","relative");}var _b4=(!this.legendOverride&&this._getDrawingToolShape(_ae,_b1))||esri.symbol.getShapeDescriptors(_ae);var _b5;try{_b5=_b2.createShape(_b4.defaultShape).setFill(_b4.fill).setStroke(_b4.stroke);}catch(e){_b2.clear();_b2.destroy();return;}var dim=_b2.getDimensions();var _b6={dx:dim.width/2,dy:dim.height/2};var _b7=_b5.getBoundingBox(),_b8=_b7.width,_b9=_b7.height;if(_b8>_af||_b9>_b0){var _ba=_b8>_b9?_b8:_b9;var _bb=_af<_b0?_af:_b0;var _bc=(_bb-5)/_ba;_2.mixin(_b6,{xx:_bc,yy:_bc});}_b5.applyTransform(_b6);return _b2;},_getDrawingToolShape:function(_bd,_be){var _bf,_c0=_be?_be.drawingTool||null:null;switch(_c0){case "esriFeatureEditToolArrow":_bf={type:"path",path:"M 10,1 L 3,8 L 3,5 L -15,5 L -15,-2 L 3,-2 L 3,-5 L 10,1 E"};break;case "esriFeatureEditToolLeftArrow":_bf={type:"path",path:"M -15,1 L -8,8 L -8,5 L 10,5 L 10,-2 L -8,-2 L -8,-5 L -15,1 E"};break;case "esriFeatureEditToolRightArrow":_bf={type:"path",path:"M 10,1 L 3,8 L 3,5 L -15,5 L -15,-2 L 3,-2 L 3,-5 L 10,1 E"};break;case "esriFeatureEditToolUpArrow":_bf={type:"path",path:"M 1,-10 L 8,-3 L 5,-3 L 5,15 L -2,15 L -2,-3 L -5,-3 L 1,-10 E"};break;case "esriFeatureEditToolDownArrow":_bf={type:"path",path:"M 1,15 L 8,8 L 5,8 L 5,-10 L -2,-10 L -2,8 L -5,8 L 1,15 E"};break;case "esriFeatureEditToolTriangle":_bf={type:"path",path:"M -10,14 L 2,-10 L 14,14 L -10,14 E"};break;case "esriFeatureEditToolRectangle":_bf={type:"path",path:"M -10,-10 L 10,-10 L 10,10 L -10,10 L -10,-10 E"};break;case "esriFeatureEditToolCircle":_bf={type:"circle",cx:0,cy:0,r:10};break;case "esriFeatureEditToolEllipse":_bf={type:"ellipse",cx:0,cy:0,rx:10,ry:5};break;case "esriFeatureEditToolFreehand":if(_bd.type==="simplelinesymbol"||_bd.type==="cartographiclinesymbol"){_bf={type:"path",path:"m -11, -7c-1.5,-3.75 7.25,-9.25 12.5,-7c5.25,2.25 6.75,9.75 3.75,12.75c-3,3 -3.25,2.5 -9.75,5.25c-6.5,2.75 -7.25,14.25 2,15.25c9.25,1 11.75,-4 13.25,-6.75c1.5,-2.75 3.5,-11.75 12,-6.5"};}else{_bf={type:"path",path:"M 10,-13 c3.1,0.16667 4.42564,2.09743 2.76923,3.69231c-2.61025,2.87179 -5.61025,5.6718 -6.14358,6.20513c-0.66667,0.93333 -0.46667,1.2 -0.53333,1.93333c-0.00001,0.86666 0.6,1.66667 1.13334,2c1.03077,0.38462 2.8,0.93333 3.38974,1.70769c0.47693,0.42564 0.87693,0.75897 1.41026,1.75897c0.13333,1.06667 -0.46667,2.86667 -1.8,3.8c-0.73333,0.73333 -3.86667,2.66666 -4.86667,3.13333c-0.93333,0.8 -7.4,3.2 -7.6,3.06667c-1.06667,0.46667 -4.73333,1.13334 -5.2,1.26667c-1.6,0.33334 -4.6,0.4 -6.25128,0.05128c-1.41539,-0.18462 -2.34872,-2.31796 -1.41539,-4.45129c0.93333,-1.73333 1.86667,-3.13333 2.64615,-3.85641c1.28718,-1.47692 2.57437,-2.68204 3.88718,-3.54359c0.88718,-1.13845 1.8,-1.33333 2.26666,-2.45641c0.33334,-0.74359 0.37949,-1.7641 0.06667,-2.87692c-0.66666,-1.46666 -1.66666,-1.86666 -2.98975,-2.2c-1.27692,-0.26666 -2.12307,-0.64102 -3.27692,-1.46666c-0.66667,-1.00001 -1.01538,-3.01539 0.73333,-4.06667c1.73333,-1.2 3.6,-1.93333 4.93333,-2.2c1.33333,-0.46667 4.84104,-1.09743 5.84103,-1.23076c1.60001,-0.46667 6.02564,-0.50257 7.29231,-0.56924z"};}break;default:return null;}return {defaultShape:_bf,fill:_bd.getFill(),stroke:_bd.getStroke()};},_repaint:function(_c1){if(!_c1){this._surface=this._draw(this._surfaceNode,this.symbol,this.surfaceWidth,this.surfaceHeight,this.template);return;}if(_c1.getStroke&&_c1.setStroke){_c1.setStroke(_c1.getStroke());}if(_c1.getFill&&_c1.setFill){_c1.setFill(_c1.getFill());}if(_c1.children&&_2.isArray(_c1.children)){_2.forEach(_c1.children,this._repaint,this);}},destroy:function(){if(this._surface){this._surface.destroy();delete this._surface;}this.inherited(arguments);}});});