require(["dojox/app/main", "dojox/json/ref"],
	function(Application, json){

	var configurationFile = "./config.json";

	require(["dojo/text!"+configurationFile], function(configJson){
		var config = json.fromJson(configJson);
		Application(config);
	});
});
