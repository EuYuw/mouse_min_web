/**
 * role add
 */

app.role.add = {
		url: "pages/system/role/addRole.html",
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			$("#role-window .close-btn").on("click", app.role.add.close);
			$("#roleadd-save-btn").on("click", app.role.add.saveForm);
		},
		saveForm: function(){
			var res = app.dzcheck.formCheck("#form-role");
			if(res){
				var fcode = $("#form-role").find("[name='code']").val();
				app.api.role.findCode({
					data: {
						code: fcode
					},
					success: function(res){//res boolean true false
						if(res){
							var fdata = app.comFun.selfFormSerialize("#form-role");
							app.api.role.add({
								data: fdata,
								success: function(res){
									if(res.msg == "ok"){
										app.alert("新增成功");
										app.role.add.close();
										app.role.listPager.refresh();
									}else{
										app.alert(res.msg);
									}
								}
							});
						}else{
							app.alert("当前编码已存在");
							$("#form-role").find("[name='code']").val("");
						}
					}
				});
			}
		},
		open: function(){
			$m.page.openPage(app.role.add.url, 'fade', 'container-wrapper');
		},
		close: function(){
			$m.page.closePage(app.role.add.url, 'fade', 'container-wrapper');
		}
}
