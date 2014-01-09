//>>built
define(["dijit","dojo","dojox","dojo/require!dojox/dtl/_Templated,dijit/_Widget"],function(_1,_2,_3){_2.provide("dojox.data.demos.widgets.FlickrViewList");_2.require("dojox.dtl._Templated");_2.require("dijit._Widget");_2.declare("dojox.data.demos.widgets.FlickrViewList",[_1._Widget,_3.dtl._Templated],{store:null,items:null,templateString:_2.cache("dojox","data/demos/widgets/templates/FlickrViewList.html","{% load dojox.dtl.contrib.data %}\r\n{% bind_data items to store as flickr %}\r\n<div dojoAttachPoint=\"list\">\r\n\t{% for item in flickr %}\r\n\t<div style=\"display: inline-block; align: top;\">\r\n\t\t<h5>{{ item.title }}</h5>\r\n\t\t<a href=\"{{ item.link }}\" style=\"border: none;\">\r\n\t\t\t<img src=\"{{ item.imageUrlMedium }}\">\r\n\t\t</a>\r\n\t\t<p>{{ item.author }}</p>\r\n\r\n\t\t<!--\r\n\t\t<img src=\"{{ item.imageUrl }}\">\r\n\t\t<p>{{ item.imageUrl }}</p>\r\n\t\t<img src=\"{{ item.imageUrlSmall }}\">\r\n\t\t-->\r\n\t</div>\r\n\t{% endfor %}\r\n</div>\r\n\r\n"),fetch:function(_4){_4.onComplete=_2.hitch(this,"onComplete");_4.onError=_2.hitch(this,"onError");return this.store.fetch(_4);},onError:function(){console.trace();this.items=[];this.render();},onComplete:function(_5,_6){this.items=_5||[];this.render();}});});