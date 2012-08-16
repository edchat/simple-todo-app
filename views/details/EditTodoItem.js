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
			var datamodel = this.loadedModels.allitemlistmodel.model;

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
				var binding = at(item.atparm1, item.atparm2).direction(item.direction);
				if (item.transform){ binding.transform(item.transform); }
				this.getWidget()[item.attachpoint].set(item.attribute, binding);
			}
		},

		init: function(){
			// summary:
			//		view life cycle init()
			// description:
			//		init is doing the same thing as beforeAcitvate only to handle the case where a page  
			//		page refresh is done on a selected item, without this code in init the details will not display.
			listsmodel = this.loadedModels.listsmodel;


			// use _this.backFlag to identify the EditTodoItem view back to items,ViewListTodoItemsProgrammatic view
			this.getWidget().detail_back.on("click", lang.hitch(this, function(){
				this._backFlag = true;
				history.back();
			}));

			this.getWidget().deleteCurrentItem.on("click", lang.hitch(this, function(){
				isComplete = false;
				isDelete = true;
				dom.byId("dlg_title").innerHTML = "Delete";
				dom.byId("dlg_text").innerHTML = "Are you sure you want to delete this item?";
				this.getWidget().dlg_confirm.show();

			}));

			this.getWidget().confirm_yes.on("click", lang.hitch(this, function(){
				var datamodel = this.loadedModels.allitemlistmodel;
				var index = this.app.selected_item;
				if(isDelete){
					datamodel = this.loadedModels.allitemlistmodel.model;
					var len = datamodel.length;
					//remove from current datamodel
					if(index>=0 && index<len){
						datamodel.splice(index, 1);
					}
				}
				this.loadedModels.allitemlistmodel.commit(); // commit updates
				//hide confirm dialog
				this.getWidget().dlg_confirm.hide();

				//transition to list view TODO: this should go back to where it was
				var transOpts = {
						title:"List",
						target:"items,ViewListTodoItemsProgrammatic",
						url: "#items,ViewListTodoItemsProgrammatic"
				};
				new TransitionEvent(dom.byId("item_detailsGroup"), transOpts, null).dispatch();
			}));

			this.getWidget().confirm_no.on("click", lang.hitch(this, function(){
				this.getWidget().dlg_confirm.hide();
			}));
			
			// we only need to set the target for the group once, so we can do it in init
			// the cursorIndex is set in the app.showItemDetails function in simple-todo-app 
			this.getWidget().item_detailsGroup.set("target", at(this.loadedModels.allitemlistmodel, "cursor"));

			// Setup data bindings here for the fields inside the item_detailsGroup.
			// use at() to bind the attribute of the widget with the attachpoint to value from the model with direction and an optional transform
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
			
			this.getWidget().detail_todo.focus();
			this.app._addNewItem = false;
		},

		afterDeactivate: function(){
			domStyle.set(dom.byId("detailwrapper"), "visibility", "hidden"); // hide the items list 
		},

		beforeDeactivate: function(){
			this.getWidget().detail_todoNote.focus();
			if(this.app._addNewItem){
				return;	// refresh view operation, DO NOT commit the data change 
			}
			var title = this.getWidget().detail_todo.value;
			// a user maybe set "Priority" first and then set title. This operation will cause EditTodoItem view beforeDeactivate() be called.
			// So we use this._backFlag to identify only back from EditTodoItem view and item's title is empty, the item need to be removed.
			if(!title && this._backFlag){
				// remove this item
				this.loadedModels.allitemlistmodel.model.splice(this.app.selected_item, 1);
			}
			this.loadedModels.allitemlistmodel.commit();
			this.app._addNewItemCommit = true;
			this._backFlag = false;
		},

		getWidget: function(){
			// summary:
			//		return _widget
			return this._widget;
		},

		destroy: function(){
			// _WidgetBase.on listener is automatically destroyed when the Widget itself his.
		}
	}
});
