define(["dojo/dom","dojo/_base/lang", "dojo/sniff", "dojo/dom-style", "dojo/when", "dijit/registry", 
		"dojox/mvc/at", "dojox/mvc/EditStoreRefListController", "dojox/mvc/getStateful", 
		"dojox/mvc/WidgetList", "dojox/mvc/Templated", "dojox/mvc/_InlineTemplateMixin",
        "dojo/data/ItemFileWriteStore", "dojo/store/DataStore", "dojo/date/stamp","dojox/mobile/TransitionEvent"],
function(dom, lang, has, domStyle, when, registry, at, EditStoreRefListController, getStateful, WidgetList,
		 Templated, _InlineTemplateMixin, ItemFileWriteStore, DataStore, stamp, TransitionEvent){

	showItemDetails = function(index){
		// summary:
		//		set the cursorIndex for this.app.currentItemListModel so the selected item will be displayed after transition to details 

		//console.log("in views/items/ViewAllTodoItemsByDate select item ", index);
		this.app.selected_item = parseInt(index);
		this.app.currentItemListModel.set("cursorIndex", this.app.selected_item);
	};

	itemCompletedClassTransform = {
		format : function(value) {
			// check to see if the item is completed, if so display it in strikethrough and gray
			if(value){
				return "itemCompleted";
			}else{
				return "";
			}
		}
	};

	dateListClassTransform = {
		format : function(value) {
			// check to see if the date is in the past, if so display it in red
			if(value && value < stamp.toISOString(new Date(), {selector: "date"})){
				return "dateLabelInvalid";
			}else{
				return "";
			}
		}
	};

	var showListData = function(/*dojox/mvc/EditStoreRefListController*/ datamodel){
		// summary:
		//		set the children for items_list widget to the datamodel to show the items in the selected list. 
		//
		// datamodel: dojox/mvc/EditStoreRefListController
		//		The EditStoreRefListController whose model holds the items for the selected list.
		//
		var listWidget = registry.byId("itemsDate_list");
		var datamodel = at(datamodel, "model");
		listWidget.set("children", datamodel);		
	};

	return {
		init: function(){
			// summary:
			//		view life cycle init()
			// description:
			//		call showListData during init, once data is bound it does not have to be called again
			registry.byId("itemslist_add2").on("click", lang.hitch(this, function(e){
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
			var listCtl = this.app.loadedModels.allitemlistmodel
			this.app.currentItemListModel = listCtl;
			showListData(listCtl);			
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
			if(!this.app._addNewItemCommit && this.app.currentItemListModel){
				this.app.currentItemListModel.commit(); //commit mark item as Complete change
			}
			this.app._addNewItemCommit = false;
		}
	};
});
