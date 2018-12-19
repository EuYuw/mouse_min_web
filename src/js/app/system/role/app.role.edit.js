/**
 * role edit
 */

app.role.edit = {
		url: "pages/system/role/editRole.html",
		dataId: null,
		init: function(){
			this.fillBackData();
			this.bindEvent();
		},
		fillBackData: function(){
			if(app.role.edit.dataId){
				app.api.role.find({
					data: {
						id: app.role.edit.dataId
					},
					success: function(res){
						if(res){
							$("#form-role").find("[name='id']").val(res.id);
							$("#form-role").find("[name='name']").val(res.name);
							$("#form-role").find("[name='code']").val(res.code);
							$("#form-role").find("[name='description']").val(res.description);
						}
					}
				});
			}
		},
		bindEvent: function(){
			$("#role-window .close-btn").on("click", app.role.edit.close);
			$("#roleedit-save-btn").on("click", app.role.edit.saveForm);
		},
		saveForm: function(){
			var res = app.dzcheck.formCheck("#form-role");
			if(res){
				var fdata = app.comFun.selfFormSerialize("#form-role");
				app.api.role.update({
					data: fdata,
					success: function(res){
						if(res.msg == "ok"){
							app.alert("编辑成功");
							app.role.edit.close();
							app.role.listPager.refresh();
						}else{
							app.alert(res.msg);
						}
					}
				});
			}
		},
		open: function(){
			$m.page.openPage(app.role.edit.url, 'fade', 'container-wrapper');
		},
		close: function(){
			app.role.edit.dataId = null;
			$m.page.closePage(app.role.edit.url, 'fade', 'container-wrapper');
		}
}
