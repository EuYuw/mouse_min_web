/**
 * system user
 */
app.api.user = {
		add: function(settings){
			app.api.ajax({
				url: '/user/add', 
				type: 'POST',
				data: settings.data
			}, settings);
		},
		del: function(settings){
			app.api.ajax({
				url: '/user/delete/' + settings.data.id, 
				type: 'DELETE'
			}, settings);
		},
		disable: function(settings){
			app.api.ajax({
				url: '/user/disable', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		enable: function(settings){
			app.api.ajax({
				url: '/user/enable', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		find: function(settings){
			app.api.ajax({
				url: '/user/find/' + settings.data.id, 
				type: 'GET'
			}, settings);
		},
		findByUN: function(settings){
			app.api.ajax({
				url: '/user/findByUsername', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		listFun: function(settings){
			app.api.ajax({
				url: '/user/listFunctions', 
				type: 'GET'
			}, settings);
		},
		login: function(settings){
			app.api.ajax({
				url: '/user/login', 
				type: 'POST',
				data: settings.data
			}, settings);
		},
		getLgUser: function(settings){
			app.api.ajax({
				url: '/user/loginUser', 
				type: 'GET'
			}, settings);
		},
		loginOut: function(settings){
			app.api.ajax({
				url: '/user/logout', 
				type: 'GET'
			}, settings);
		},
		resetPsd: function(settings){
			app.api.ajax({
				url: '/user/resetPassword', 
				type: 'PUT',
				data: settings.data
			}, settings);
		},
		search: function(settings){
			app.api.ajax({
				url: '/user/search', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		update: function(settings){
			app.api.ajax({
				url: '/user/' + settings.data.id, 
				type: 'PUT',
				data: settings.data
			}, settings);
		},
		//user role
		urSearch: function(settings){
			app.api.ajax({
				url: '/userRole/search', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		urAdd: function(settings){
			app.api.ajax({
				url: '/userRole/addDatas', 
				type: 'POST',
				data: settings.data
			}, settings);
		},
		urDel: function(settings){
			app.api.ajax({
				url: '/userRole/deleteUserRoles/' + settings.data.userId, 
				type: 'DELETE'
			}, settings);
		}
}