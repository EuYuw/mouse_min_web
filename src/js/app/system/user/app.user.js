/**
 * user module
 */

app.user = {
	init: function() {
		this.initListPager();
		this.bindEvent();
		this.searchForm();
	},
	initListPager: function() {
		app.user.listPager = $m
			.listPager({
				pageSize: 10,
				varName: 'app.user.listPager',
				itemId: 'list-user',
				columns: [{
						name: 'userName',
						label: '用户名称'
					},
					{
						name: 'email',
						label: '电子邮箱'
					},
					{
						name: 'tel',
						label: '电话号码'
					},
					{
						label: '用户状态',
						dataRender: function(data) {
							return '<td>' + (data.status == 1 ? '激活' : '挂起') + '</td>';
						}
					},
					{
						name: 'createTime',
						label: '创建时间'
					},
					{
						headStyle: "width: 260px",
						label: '操作',
						dataRender: function(data) {
							var status = (data.status == 2 ? '激活' : '挂起');
							var func = (data.status == 2 ? 'toEnable' : 'toDisable');
							var trHtml = '<a href="javascript:;" onclick="javascript: app.user.'+func+'(\''+data.id+'\');" title="'+status+'" class="oper-href">'+status+'</a>' +
								'<a href="javascript:;" onclick="javascript: app.user.toEdit(\''+data.id+'\');" title="编辑" class="oper-href">编辑</a>' +
								'<a href="javascript:;" onclick="javascript: app.user.toEditPsd(\''+data.id+'\');" title="修改密码" class="oper-href">修改密码</a>' +
								'<a href="javascript:;" onclick="javascript: app.user.linkRole(\''+data.id+'\');" title="添加角色" class="oper-href">添加角色</a>' +
								'<a href="javascript:;" onclick="javascript: app.user.toDel(\''+data.id+'\');" title="删除" class="oper-href">删除</a>';
							return '<td class="oper-td">'+ trHtml +'</td>';
						}
					}
				],
				dataProvider: function(listPager, callback) {
					app.loading.show();
					var query = listPager.query || {};
					query.pageSize = listPager.pageSize;
					query.pageNum = listPager.pageNum;
					if(listPager.orderBy) {
						query.orderBy = listPager.orderBy;
						query.sort = listPager.asc ? 'asc' : 'desc';
					}
					app.api.user.search({
						data: query,
						success: function(result) {
							app.loading.hide();
							callback(result.totalNum, result.datas);
						}
					});
				}
			});
		app.user.listPager.refresh();
	},
	toEnable: function(dataId){//启用
		layer.confirm("确定激活吗?", function(ix){
			app.api.user.enable({
				data: {
					userId: dataId
				},
				success: function(res){
					if(res.msg == "ok"){
						app.alert("激活成功");
						app.user.listPager.refresh();
					}else{
						app.alert(res.msg);
					}
				}
			});
			layer.close(ix);
		});
	},
	toDisable: function(dataId){//挂起
		layer.confirm("确定挂起吗?", function(ix){
			app.api.user.disable({
				data: {
					userId: dataId
				},
				success: function(res){
					if(res.msg == "ok"){
						app.alert("挂起成功");
						app.user.listPager.refresh();
					}else{
						app.alert(res.msg);
					}
				}
			});
			layer.close(ix);
		});
	},
	toEdit: function(dataId){//编辑
		app.user.edit.dataId = dataId;
		app.user.edit.open();
	},
	toEditPsd: function(dataId){//编辑密码
		app.user.editPsd.dataId = dataId;
		app.user.editPsd.open();
	},
	linkRole: function(dataId){//添加角色
		app.user.addRole.userId = dataId;
		app.user.addRole.open();
	},
	toDel: function(dataId){//删除
		layer.confirm("确定删除吗?", function(ix){
			app.api.user.del({
				data: {
					id: dataId
				},
				success: function(res){
					if(res.msg == "ok"){
						app.alert("删除成功");
						app.user.listPager.refresh();
					}else{
						app.alert(res.msg);
					}
				}
			});
			layer.close(ix);
		});
	},
	bindEvent: function(){
		$("#add-user").on("click", app.user.add.open);
		$("#srh-user-form").on("click", ".srh-icon", function(){
			var data = $m("#srh-user-form").serializeObject();
			var listPager = app.user.listPager;
			listPager.query = data;
			listPager.pageNum = 0;
			listPager.refresh();
		});
	},
	searchForm: function(){
		$m('#srh-user-form').validate({
			submitHandler : function(form) {
				var data = $m(form).serializeObject();
				var listPager = app.user.listPager;
				listPager.query = data;
				listPager.pageNum = 0;
				listPager.refresh();
			}
		});
	}
}