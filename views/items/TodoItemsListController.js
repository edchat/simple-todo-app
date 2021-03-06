define(["dojo/dom", "dojo/_base/lang", "dojo/sniff", "dojo/_base/declare", "dojo/dom-style", "dojo/when", 
		"dijit/registry", "dojox/mvc/at", "dojox/mobile/RoundRectList", 
		"dojox/mvc/WidgetList", "dojox/mvc/Templated", "dojox/mobile/ListItem", 
		"dojox/mvc/EditStoreRefListController", "dojox/mvc/getStateful", "dojo/data/ItemFileWriteStore", 
		"dojo/store/DataStore", "dojox/mobile/parser", "dojox/mobile/TransitionEvent",	
		"dojo/text!../../templates/items/RoundRectWidListTemplate.html"],
function(dom, lang, has, declare, domStyle, when, registry, at, RoundRectList, WidgetList, 
			Templated, ListItem, EditStoreRefListController, getStateful, ItemFileWriteStore, DataStore, 
			parser, TransitionEvent, RoundRectWidListTemplate){

	var roundRectWidList = null;


	return {
		showListData: function(/*dojox/mvc/EditStoreRefListController*/ datamodel){
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
						transitionOptions: {title: "Detail",target: "details,TodoItemDetailsController",url: "#details,TodoItemDetailsController"},
						clickable: true,
						onClick: function(){app.showItemDetails(this.indexAtStartup);}
					},
					childBindings: {
						titleNode: {value: at("rel:", "title"), 
						class: at("rel:","completed").direction(at.from).transform(app.itemCompletedClassTransform)},
						checkedNode: {checked: at("rel:", "completed")}
					},
					templateString: RoundRectWidListTemplate
				});
				roundRectWidList.placeAt(dom.byId("list_container"));
				roundRectWidList.startup();
			}
		},

		init: function(){
			// summary:
			//		view life cycle init()
			// description:
			//		init is doing the same thing as beforeAcitvate only to handle the case where a page  
			//		page refresh is done on a selected item, without this code in init the details will not display.
			
			// when the itemslist_add attachpoint is clicked transition to the TodoItemDetailsController with this.app._addNewItem set to true
			this.getView().itemslist_add.on("click", lang.hitch(this, function(e){
				this.app._addNewItem = true;

				// transition to TodoItemDetailsController view 
				var transOpts = {
					title: "Detail",
					target: "details,TodoItemDetailsController",
					url: "#details,TodoItemDetailsController"
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

		getView: function(){
			// summary:
			//		getView is setup here to give access to the attach-points setup in the template which are available from _widget
			//		this function will be moved into the View base class next release
			return this._widget;
		}
	};
});
