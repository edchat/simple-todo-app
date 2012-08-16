define([], function(){
	return function(){

		// the default select_item is 0, or will throw an error if directly transition to #details,TodoItemDetailsController view
		this.selected_item = 0;

		this.itemCompletedClassTransform = {
			format : function(value) {
				// check to see if the item is completed, if so display it in strikethrough and gray
				if(value){
					return "itemCompleted";
				}else{
					return "";
				}
			}
		};

		this.showItemDetails = function(index){
			// summary:
			//		set the cursorIndex for this.loadedModels.allitemlistmodel so the selected item will be displayed after transition to details 
			this.selected_item = parseInt(index);
			this.loadedModels.allitemlistmodel.set("cursorIndex", this.selected_item);
		};

		
	};
});
