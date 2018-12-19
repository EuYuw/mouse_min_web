/**
 * role module
 */

app.role = {
	init: function() {
		this.initListPager();
		this.bindEvent();
		this.searchForm();
	},
	initListPager: function() {
		app.role.listPager = $m.listPager({
				pageSize: 10,
				varName: 'app.role.listPager',
				itemId: 'list-role',
				columns: [{
						name: 'name',
						label: '角色名称'
					},
					{
						name: 'code',
						label: '角色编码'
					},
					{
						name: 'description',
						label: '描述'
					},
					{
						name: 'createTime',
						label: '创建时间'
					},
					{
						headStyle: "width: 180px",
						label: '操作',
						dataRender: function(data) {
							var trHtml = '<a href="javascript:;" onclick="javascript: app.role.toEdit(\''+data.id+'\');" title="编辑" class="oper-href">编辑</a>' +
							 	'<a href="javascript:;" onclick="javascript: app.role.linkFunc(\''+data.code+'\');" title="添加功能" class="oper-href">添加功能</a>' +
								'<a href="javascript:;" onclick="javascript: app.role.toDel(\''+data.id+'\');" title="删除" class="oper-href">删除</a>';
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
					app.api.role.search({
						data: query,
						success: function(result) {
							app.loading.hide();
							callback(result.totalNum, result.datas);
						}
					});
				}
			});
		app.role.listPager.refresh();
	},
	toEdit: function(dataId){//编辑
		app.role.edit.dataId = dataId;
		app.role.edit.open();
	},
	linkFunc: function(roleCode){
		app.role.addFunc.roleCode = roleCode;
		app.role.addFunc.open();
	},
	toDel: function(dataId){//删除
		layer.confirm("确定删除吗?", function(ix){
			app.api.role.del({
				data: {
					id: dataId
				},
				success: function(res){
					if(res.msg == "ok"){
						app.alert("删除成功");
						app.role.listPager.refresh();
					}else{
						app.alert(res.msg);
					}
				}
			});
			layer.close(ix);
		});
	},
	bindEvent: function(){
		$("#add-role").on("click", app.role.add.open);
		$("#srh-role-form").on("click", ".srh-icon", function(){
			var data = $m("#srh-role-form").serializeObject();
			var listPager = app.role.listPager;
			listPager.query = data;
			listPager.pageNum = 0;
			listPager.refresh();
		});
	},
	searchForm: function(){
		$m('#srh-role-form').validate({
			submitHandler : function(form) {
				var data = $m(form).serializeObject();
				var listPager = app.role.listPager;
				listPager.query = data;
				listPager.pageNum = 0;
				listPager.refresh();
			}
		});
	}
}