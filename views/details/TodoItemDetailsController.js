define(["dojo/_base/lang", "dojo/dom", "dojo/dom-style", "dojo/on", "dijit/registry",
	"dojox/mobile/TransitionEvent", "dojox/mvc/getStateful", "dojox/mvc/at", "dojo/date/stamp", "dojox/mobile/CheckBox"],
	function(lang, dom, domStyle, on, registry, TransitionEvent, getStateful, at, stamp){
	var listsmodel = null;
	var isComplete = false;
	var isDelete = false;
	var detailsSetup = false;
	this.app._addNewItemCommit = false; // identify the new item is committed

	return {

		addNewItem: function(){
			// summary:
			//		add to add a new item to a todo list
			var listId = 0;

			this.loadedModels.allitemlistmodel.model.push(new getStateful({
				"id": parseInt((new Date().getTime())),
				"listId": listId,
				"title": "",
				"notes": "",
				"due": null,
				"completionDate": "",
				"reminderOnAday": "off",   
				"reminderDate": "",
				"reminderOnAlocation": "off",   
				"reminderLocation": null,
				"repeat": 0,
				"priority": 0,
				"hidden": false,
				"completed": false,
				"deleted": false
			}));
			this.app.selected_item = this.loadedModels.allitemlistmodel.model.length - 1;
			this.loadedModels.allitemlistmodel.commit();
			this.loadedModels.allitemlistmodel.set("cursorIndex", this.app.selected_item);
		},

		bindAttributes: function(bindingArray){
			// summary:
			//		add to add a new item to a todo list
			for(var i=0; i < bindingArray.length; i++){
				item = bindingArray[i];
				// setup the binding with the parameters and the direction
				var binding = at(item.atparm1, item.atparm2).direction(item.direction);
				// set the transform if one is used
				if (item.transform){ binding.transform(item.transform); }
				// do the binding for the attach-point's attribute with the binding setup above
				this.getView()[item.attachpoint].set(item.attribute, binding);
			}
		},

		init: function(){
			// summary:
			//		view life cycle init()
			// description:
			//		init is doing the same thing as beforeAcitvate only to handle the case where a page  
			//		page refresh is done on a selected item, without this code in init the details will not display.
			listsmodel = this.loadedModels.listsmodel;


			// when the detail_back attach-point is clicked the view back to items,TodoItemsListController view
			this.getView().detail_back.on("click", lang.hitch(this, function(){
				this._backFlag = true;
				history.back();
			}));

			// when the deleteCurrentItem attach-point is clicked show the Delete confirmation dialog
			this.getView().deleteCurrentItem.on("click", lang.hitch(this, function(){
				isComplete = false;
				isDelete = true;
				dom.byId("dlg_title").innerHTML = "Delete";
				dom.byId("dlg_text").innerHTML = "Are you sure you want to delete this item?";
				this.getView().dlg_confirm.show();

			}));

			// when the confirm_yes attach-point is clicked delete the selected item from allitemlistmodel, and 
			// transition back to TodoItemsListController
			this.getView().confirm_yes.on("click", lang.hitch(this, function(){
				var index = this.app.selected_item;
				if(isDelete){
					var len = this.loadedModels.allitemlistmodel.length;
					//remove from allitemlistmodel
					if(index>=0 && index<len){
						this.loadedModels.allitemlistmodel.splice(index, 1);
					}
				}
				this.loadedModels.allitemlistmodel.commit(); // commit updates
				//hide confirm dialog
				this.getView().dlg_confirm.hide();

				//transition to list view TODO: this should go back to where it was
				var transOpts = {
						title:"List",
						target:"items,TodoItemsListController",
						url: "#items,TodoItemsListController"
				};
				new TransitionEvent(dom.byId("item_detailsGroup"), transOpts, null).dispatch();
			}));

			// when the confirm_no attach-point is clicked hide the confirm dialog with out deleting the item
			this.getView().confirm_no.on("click", lang.hitch(this, function(){
				this.getView().dlg_confirm.hide();
			}));
			
			// we only need to set the target for the group once, so we can do it in init()
			// when the item_detailsGroup attach-point sets the target the relative bindings for the fields in the group are set
			// the cursorIndex is set in the app.showItemDetails function in simple-todo-app 
			this.getView().item_detailsGroup.set("target", at(this.loadedModels.allitemlistmodel, "cursor"));

			// Setup data bindings here for the fields inside the item_detailsGroup.
			// use at() to bind the attribute of the widget with the attach-point to value from the model with direction and an optional transform
			var bindingArray = [
				{"attachpoint":"detail_todo", "attribute":"value", "atparm1":'rel:', "atparm2":'title',"direction":at.both,"transform":null},
				{"attachpoint":"detail_todo", "attribute":"class", "atparm1":'rel:', "atparm2":'completed',"direction":at.from,"transform":app.itemCompletedClassTransform},
				{"attachpoint":"detail_todoNote", "attribute":"value", "atparm1":'rel:', "atparm2":'notes',"direction":at.both,"transform":null},			
				{"attachpoint":"detail_completed", "attribute":"checked", "atparm1":'rel:', "atparm2":'completed',"direction":at.both,"transform":null}			
			];
			
			// bind all of the attrbutes setup in the bindingArray, this is a one time setup
			this.bindAttributes(bindingArray);
			
		},

		beforeActivate: function(){
			if(this.app._addNewItem){
				this.addNewItem();
			}
			domStyle.set(dom.byId("detailwrapper"), "visibility", "visible"); // show the items list
			
			// set the focus to the detail_todo attach-point here in beforeActivate
			this.getView().detail_todo.focus();
			this.app._addNewItem = false;
		},

		afterDeactivate: function(){
			domStyle.set(dom.byId("detailwrapper"), "visibility", "hidden"); // hide the items list 
		},

		beforeDeactivate: function(){
			// set the focus to the detail_todoNote attach-point here in beforeDeactivate to force the update of detail_todo since the TextBox notifies of updates on a focus change
			this.getView().detail_todoNote.focus();
			if(this.app._addNewItem){
				return;	// refresh view operation, DO NOT commit the data change 
			}
			// If the title has been blanked out, we will need to delete the item
			var title = this.getView().detail_todo.value;
			if(!title && this._backFlag){
				// remove this item
				this.loadedModels.allitemlistmodel.model.splice(this.app.selected_item, 1);
			}
			this.loadedModels.allitemlistmodel.commit();
			this.app._addNewItemCommit = true;
			this._backFlag = false;
		},

		getView: function(){
			// summary:
			//		getView is setup here to give access to the attach-points setup in the template which are available from _widget
			//		this function will be moved into the View base class next release
			return this._widget;
		},

		destroy: function(){
			// _WidgetBase.on listener is automatically destroyed when the Widget itself his.
		}
	}
});
