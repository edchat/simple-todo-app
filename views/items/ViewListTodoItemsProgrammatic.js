define(["dojo/dom", "dojo/_base/lang", "dojo/sniff", "dojo/_base/declare", "dojo/dom-style", "dojo/when", 
		"dijit/registry", "dojox/mvc/at", "dojox/mobile/RoundRectList", 
		"dojox/mvc/WidgetList", "dojox/mvc/Templated", "dojox/mobile/ListItem", 
		"dojox/mvc/EditStoreRefListController", "dojox/mvc/getStateful", "dojo/data/ItemFileWriteStore", 
		"dojo/store/DataStore", "dojox/mobile/parser", "dojox/mobile/TransitionEvent",	
		"dojo/text!../../templates/items/RoundRectWidListTemplate.html"],
function(dom, lang, has, declare, domStyle, when, registry, at, RoundRectList, WidgetList, 
			Templated, ListItem, EditStoreRefListController, getStateful, ItemFileWriteStore, DataStore, 
			parser, TransitionEvent, RoundRectWidListTemplate){

	showItemDetails = function(index){
		// summary:
		//		set the cursorIndex for this.app.currentItemListModel so the selected item will be displayed after transition to details 
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

	var roundRectWidList = null;

	var showListData = function(/*dojox/mvc/EditStoreRefListController*/ datamodel){
		// summary:
		//		create the WidgetList programatically if it has not been created, and 
		//		set the children for items_list widget to the datamodel to show the items in the selected list.
		//		RoundRectWidListTemplate is used for the templateString of the WidgetList.
		//
		// datamodel: dojox/mvc/EditStoreRefListController
		//		The EditStoreRefListController whose model holds the items for the selected list.
		//
		if(!roundRectWidList) {
			var clz = declare([WidgetList, RoundRectList], {});
			roundRectWidList = new clz({
				children: at(datamodel, "model"),
				childClz: declare([Templated /* dojox/mvc/Templated module return value */, ListItem /* dojox/mobile/ListItem module return value */]),
				childParams: {
					transitionOptions: {title: "Detail",target: "details,EditTodoItem",url: "#details,EditTodoItem"},
					clickable: true,
					onClick: function(){showItemDetails(this.indexAtStartup);}
				},
				childBindings: {
					titleNode: {value: at("rel:", "title"), 
								class: at("rel:","completed").direction(at.from).transform(itemCompletedClassTransform)},
					checkedNode: {checked: at("rel:", "completed")}
				},
				templateString: RoundRectWidListTemplate
			});
			roundRectWidList.placeAt(dom.byId("list_container"));
			roundRectWidList.startup();
		}else{
			roundRectWidList.set("children", at(datamodel, 'model'));
		}
	};

	return {
		init: function(){
			// summary:
			//		view life cycle init()
			// description:
			//		init is doing the same thing as beforeAcitvate only to handle the case where a page  
			//		page refresh is done on a selected item, without this code in init the details will not display.
			registry.byId("itemslist_add").on("click", lang.hitch(this, function(e){
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
			var listCtl = this.loadedModels.allitemlistmodel;
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
