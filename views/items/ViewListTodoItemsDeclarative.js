define(["dojo/dom","dojo/_base/lang", "dojo/sniff", "dojo/dom-style", "dojo/when", "dijit/registry", 
		"dojox/mvc/at", "dojox/mvc/EditStoreRefListController", "dojox/mvc/getStateful", 
		"dojox/mvc/WidgetList", "dojox/mvc/Templated", "dojox/mvc/_InlineTemplateMixin",
        "dojo/data/ItemFileWriteStore", "dojo/store/DataStore", "dojo/date/stamp","dojox/mobile/TransitionEvent"],
function(dom, lang, has, domStyle, when, registry, at, EditStoreRefListController, getStateful, WidgetList,
		 Templated, _InlineTemplateMixin, ItemFileWriteStore, DataStore, stamp, TransitionEvent){

	return {
		showListData: function(/*dojox/mvc/EditStoreRefListController*/ datamodel){
			// summary:
			//		set the children for items_list widget to the datamodel to show the items in the selected list. 
			//
			// datamodel: dojox/mvc/EditStoreRefListController
			//		The EditStoreRefListController whose model holds the items for the selected list.
			//
			var listWidget = registry.byId("itemsDate_list");
			var datamodel = at(datamodel, "model");
			listWidget.set("children", datamodel);	
		},
				
		init: function(){
			// summary:
			//		view life cycle init()
			// description:
			//		call showListData during init, once data is bound it does not have to be called again
			this.getWidget().itemslist_add.on("click", lang.hitch(this, function(e){
				this.app._addNewItem = true;

				// transition to detail view for edit
				var transOpts = {
					title: "Detail",
					target: "details,EditTodoItem",
					url: "#details,EditTodoItem"
				};
				new TransitionEvent(e.srcElement, transOpts, e).dispatch();
			}));

			this.app.selected_item = 0; // reset selected item to 0, -1 is out of index
			this.showListData(this.app.loadedModels.allitemlistmodel);			
		},

		beforeActivate: function(){
			// summary:
			//		view life cycle beforeActivate()
		},

		afterDeactivate: function(){
			// summary:
			//		view life cycle afterDeactivate()
		},

		beforeDeactivate: function(){
			// summary:
			//		view life cycle beforeDeactivate()
			if(!this.app._addNewItemCommit && this.loadedModels.allitemlistmodel){
				this.loadedModels.allitemlistmodel.commit(); //commit mark item as Complete change
			}
			this.app._addNewItemCommit = false;
		},

		getWidget: function(){
			// summary:
			//		return _widget
			return this._widget;
		}
	};
});
