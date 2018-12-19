/**
 * app api 
 */

app.api = {
		
	ipConfig: 'http://localhost:8004',//ip及端口
	
	url : '/dz_iot/api',//全局后台地址

	xhrMap : {}, // 保存xhr对象

	abort : function() {
		var id;
		var xhr;
		for (id in app.api.xhrMap) {
			xhr = app.api.xhrMap[id];
			if (xhr) {
				xhr.abort();
			}
		}
		app.loading.hide();
	},

	ajax : function(options, callback) {
		var isIE = app.utils.isIE();
		var settings = {
			url: options.fullUrl || (app.api.url + options.url),		
			type: options.type,
			method: options.type,
			cache: isIE == true ? false : callback.cache,
			contentType: 'application/json',
			async : options.async == null  ? true : options.async,
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			// 90秒超时
			timeout : 90000,
			processData : false,
			success : callback.success,
			error : app.api.error,
			beforeSend : function(XHR) {
				var id = Date.now() + Math.random();
				XHR.id = id;
				app.api.xhrMap[id] = XHR;
				if (callback.beforeSend) {
					callback.beforeSend(XHR);
				}
			},
			complete : function(XHR) {
				var id = XHR.id;
				delete app.api.xhrMap[id];

				if (!XHR) {
					// abort
					app.loading.hide();
				}

				if (callback.complete) {
					callback.complete(XHR);
				}
			}
		};

		if (callback.error) {
			settings.error = callback.error;
		}
		if (callback.complete) {
			settings.complete = callback.complete;
		}

		var $d = window.$ || $m;

		if (options.data) {
			if (options.type.toUpperCase() === 'GET') {
				if ($m) {
					settings.data = $m.serialize(options.data);
				} else {
					settings.data = $d.serializeObject(options.data);
				}
			} else {
				settings.data = JSON.stringify(options.data);
			}
		}
		return $d.ajax(settings);
	},

	error : function(XHR) {
		app.loading.hide();
		if (XHR.status === 401) {
			app.user.login.open();
			return false;
		} else if (XHR.status === 403) {
			app.alert('权限错误');
			return false;
		}
		try {
			var result = JSON.parse(XHR.responseText);
			if (result) {
				app.alert(result.msg);
			}
		} catch (e) {
			if (XHR.status === 400) {
				app.alert('请求参数错误');
				return false;
			}
			app.alert('无法连接服务,请稍后再试');
		}
	}
};
