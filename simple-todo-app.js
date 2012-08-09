define(["dojox/mobile/ProgressIndicator"], function(ProgressIndicator){
	return function(){
		// the default select_item is 0, or will throw an error if directly transition to #details,EditTodoItem view
		this.selected_item = 0;
	};
});
