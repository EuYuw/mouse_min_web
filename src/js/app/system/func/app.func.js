/**
 * func module
 */

app.func = {
	init: function() {
		this.initListPager();
		this.bindEvent();
		this.searchForm();
	},
	initListPager: function() {
		app.func.listPager = $m.listPager({
				pageSize: 10,
				varName: 'app.func.listPager',
				itemId: 'list-func',
				columns: [{
						name: 'name',
						label: '功能名称'
					},
					{
						name: 'code',
						label: '功能编码'
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
						headStyle: "width: 160px",
						label: '操作',
						dataRender: function(data) {
							var trHtml = '<a href="javascript:;" onclick="javascript: app.func.toEdit(\''+data.id+'\');" title="编辑" class="oper-href">编辑</a>' +
								'<a href="javascript:;" onclick="javascript: app.func.toDel(\''+data.id+'\');" title="删除" class="oper-href">删除</a>';
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
					app.api.func.search({
						data: query,
						success: function(result) {
							app.loading.hide();
							callback(result.totalNum, result.datas);
						}
					});
				}
			});
		app.func.listPager.refresh();
	},
	toEdit: function(dataId){//编辑
		app.func.edit.dataId = dataId;
		app.func.edit.open();
	},
	toDel: function(dataId){//删除
		layer.confirm("确定删除吗?", function(ix){
			app.api.func.del({
				data: {
					id: dataId
				},
				success: function(res){
					if(res.msg == "ok"){
						app.alert("删除成功");
						app.func.listPager.refresh();
					}else{
						app.alert(res.msg);
					}
				}
			});
			layer.close(ix);
		});
	},
	bindEvent: function(){
		$("#add-func").on("click", app.func.add.open);
		$("#srh-func-form").on("click", " .srh-icon", function(){
			var data = $m("#srh-func-form").serializeObject();
			var listPager = app.func.listPager;
			listPager.query = data;
			listPager.pageNum = 0;
			listPager.refresh();
		});
	},
	searchForm: function(){
		$m('#srh-func-form').validate({
			submitHandler : function(form) {
				var data = $m(form).serializeObject();
				var listPager = app.func.listPager;
				listPager.query = data;
				listPager.pageNum = 0;
				listPager.refresh();
			}
		});
	}
}