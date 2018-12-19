/**
 * system role
 */
app.api.role = {
		add: function(settings){
			app.api.ajax({
				url: '/role', 
				type: 'POST',
				data: settings.data
			}, settings);
		},
		update: function(settings){
			app.api.ajax({
				url: '/role', 
				type: 'PUT',
				data: settings.data
			}, settings);
		},
		findCode: function(settings){
			app.api.ajax({
				url: '/role/findByCode', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		search: function(settings){
			app.api.ajax({
				url: '/role/search', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		find: function(settings){
			app.api.ajax({
				url: '/role/'+settings.data.id, 
				type: 'GET'
			}, settings);
		},
		del: function(settings){
			app.api.ajax({
				url: '/role/'+settings.data.id, 
				type: 'DELETE'
			}, settings);
		},
		//role func
		rfSearch: function(settings){
			app.api.ajax({
				url: '/roleFunction/search', 
				type: 'GET',
				data: settings.data
			}, settings);
		},
		rfDel: function(settings){
			app.api.ajax({
				url: '/roleFunction/deleteRoleFunctions/' + settings.data.roleCode, 
				type: 'DELETE'
			}, settings);
		},
		rfAdd: function(settings){
			app.api.ajax({
				url: '/roleFunction/addDatas', 
				type: 'POST',
				data: settings.data
			}, settings);
		}
}