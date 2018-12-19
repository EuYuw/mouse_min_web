/**
 * system func
 */
app.api.func = {
		add: function(settings){
			app.api.ajax({
				url: '/function', 
				type: 'POST',
				data: settings.data
			}, settings);
		},
		update: function(settings){
			app.api.ajax({
				url: '/function', 
				type: 'PUT',
				data: settings.data
			}, settings);
		},
		findCode: function(settings){
			app.api.ajax({
				url: '/function/findByCode', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		search: function(settings){
			app.api.ajax({
				url: '/function/search', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		find: function(settings){
			app.api.ajax({
				url: '/function/' + settings.data.id, 
				type: 'GET'
			}, settings);
		},
		del: function(settings){
			app.api.ajax({
				url: '/function/' + settings.data.id, 
				type: 'DELETE'
			}, settings);
		},
}