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
define(["dijit","dojo","dojox","dojo/require!esri/dijit/editing/tools/ToggleToolBase,esri/dijit/editing/tools/ButtonToolBase"],function(_1,_2,_3){_2.require("esri.dijit.editing.tools.ToggleToolBase");_2.require("esri.dijit.editing.tools.ButtonToolBase");_2.provide("esri.dijit.editing.tools.AdvancedTools");_2.declare("esri.dijit.editing.tools.Cut",[esri.dijit.editing.tools.ToggleToolBase],{id:"btnFeatureCut",_enabledIcon:"toolbarIcon cutIcon",_disabledIcon:"toolbarIcon cutIcon",_drawType:esri.toolbars.Draw.POLYLINE,_enabled:true,_label:"NLS_cutLbl",_cutConnects:[],activate:function(){this._cutConnects.push(_2.connect(this._toolbar,"onDrawEnd",this,"_onDrawEnd"));this.inherited(arguments);},deactivate:function(){this.inherited(arguments);_2.forEach(this._cutConnects,"dojo.disconnect(item);");this._cutConnects=[];this._edits=[];},_onDrawEnd:function(_4){var _5=this._settings.layers;var _6=this._cutLayers=_2.filter(_5,function(_7){return ((_7.geometryType==="esriGeometryPolygon")||(_7.geometryType==="esriGeometryPolyline")&&_7.visible&&_7._isMapAtVisibleScale());});this._cutConnects=this._cutConnects.concat(_2.map(_6,_2.hitch(this,function(_8){return _2.connect(_8,"onEditsComplete",_2.hitch(this,function(_9,_a,_b){if(this._settings.undoRedoManager){var _c=this._settings.undoRedoManager;_2.forEach(this._edits,_2.hitch(this,function(_d){_c.add(new esri.dijit.editing.Cut({featureLayer:_d.layer,addedGraphics:_d.adds,preUpdatedGraphics:_d.preUpdates,postUpdatedGraphics:_d.updates}));}),this);}this.onFinished();}));})));var _e=new esri.tasks.Query();_e.geometry=_4;_2.forEach(_6,function(_f,idx){this._settings.editor._selectionHelper.selectFeatures([_f],_e,esri.layers.FeatureLayer.SELECTION_NEW,_2.hitch(this,"_cutFeatures",_f,_e));},this);},_cutFeatures:function(_10,_11,_12){if(!_12||!_12.length){return;}this._edits=[];var _13=[];_13.push(this._settings.geometryService.cut(esri.getGeometries(_12),_11.geometry,_2.hitch(this,"_cutHandler",_10,_12)));var _14=new _2.DeferredList(_13).addCallback(_2.hitch(this,function(){this.onApplyEdits(this._edits);}));},_cutHandler:function(_15,_16,_17){var _18=[];var _19=[];var _1a=_2.map(_16,"return new esri.Graphic(dojo.clone(item.toJson()))");var _1b;var _1c;_2.forEach(_17.cutIndexes,function(_1d,i){if(_1b!=_1d){_1b=_1d;_19.push(_16[_1d].setGeometry(_17.geometries[i]));}else{_1c=new esri.Graphic(_17.geometries[i],null,_2.mixin({},_16[_1d].attributes),null);_1c.attributes[_16[0].getLayer().objectIdField]=null;_18.push(_1c);}},this);this._edits.push({layer:_15,adds:_18,updates:_19,preUpdates:_1a});}});_2.declare("esri.dijit.editing.tools.Reshape",[esri.dijit.editing.tools.ToggleToolBase],{id:"btnFeatureReshape",_enabledIcon:"toolbarIcon reshapeIcon",_disabledIcon:"toolbarIcon reshapeIcon",_drawType:esri.toolbars.Draw.POLYLINE,_enabled:true,_label:"NLS_reshapeLbl",activate:function(){_2.disconnect(this._rConnect);this._rConnect=_2.connect(this._toolbar,"onDrawEnd",this,"_onDrawEnd");this.inherited(arguments);},deactivate:function(){this.inherited(arguments);_2.disconnect(this._rConnect);delete this._rConnect;},_onDrawEnd:function(_1e){var _1f=this._settings.layers;var _20=new esri.tasks.Query();_20.geometry=_1e;var _21=this._reshapeLayers=_2.filter(_1f,function(_22){return (_22.geometryType==="esriGeometryPolygon"||"esriGeometryPolyline");});this._settings.editor._selectionHelper.selectFeatures(_21,_20,esri.layers.FeatureLayer.SELECTION_NEW,_2.hitch(this,"_reshape",_20));},_reshape:function(_23,_24){var _25=[];var _26=_24;if(_26.length!==1){return;}this._settings.geometryService.reshape(_26[0].geometry,_23.geometry,_2.hitch(this,function(_27){var _28=[_26[0].setGeometry(_27)];this.onApplyEdits([{layer:_26[0].getLayer(),updates:_28}],_2.hitch(this,function(){this._settings.editor._selectionHelper.clearSelection(false);this.onFinished();}));}));}});_2.declare("esri.dijit.editing.tools.Union",[esri.dijit.editing.tools.ButtonToolBase],{id:"btnFeatureUnion",_enabledIcon:"toolbarIcon unionIcon",_disabledIcon:"toolbarIcon unionIcon",_drawType:esri.toolbars.Draw.POLYLINE,_enabled:true,_label:"NLS_unionLbl",_onClick:function(evt){this._settings.editor._activeTool="UNION";var _29=this._settings.layers;var _2a=_2.filter(_29,"return (item.geometryType === 'esriGeometryPolygon') && (item.visible && item._isMapAtVisibleScale());");var _2b=[];var _2c=0;_2.forEach(_2a,function(_2d,idx){var _2e=_2d.getSelectedFeatures();if(_2e.length>=2){_2c++;var _2f=_2.map(_2e,"return new esri.Graphic(dojo.clone(item.toJson()))");this._settings.geometryService.union(esri.getGeometries(_2e),_2.hitch(this,function(_30){var _31=[_2e.pop().setGeometry(_30)];_2b.push({layer:_2d,updates:_31,deletes:_2e,preUpdates:_2f});_2c--;if(_2c<=0){this.onApplyEdits(_2b,_2.hitch(this,function(){if(this._settings.undoRedoManager){var _32=this._settings.undoRedoManager;_2.forEach(this._edits,_2.hitch(this,function(_33){_32.add(new esri.dijit.editing.Union({featureLayer:_33.layer,addedGraphics:_33.deletes,preUpdatedGraphics:_33.preUpdates,postUpdatedGraphics:_33.updates}));}),this);}this._settings.editor._selectionHelper.clearSelection(false);this.onFinished();}));}}));}},this);}});});