/**
*	组件类
*/

/** alert **/
app.alert = function(message, title, callback) {
	$m.message(message, title, callback);
};

/** loading **/
app.loading = {
	show: function(msg) {
		if(!msg){
			msg = "努力加载中，请等待...";
		}
		$m.showLoading(msg, app.api.abort);
	},
	hide: function() {
		$m.hideLoading();
	}
};