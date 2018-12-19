/**
 * func edit
 */

app.func.edit = {
		url: "pages/system/func/editFunc.html",
		dataId: null,
		init: function(){
			this.fillBackData();
			this.bindEvent();
		},
		fillBackData: function(){
			if(app.func.edit.dataId){
				app.api.func.find({
					data: {
						id: app.func.edit.dataId
					},
					success: function(res){
						if(res){
							$("#form-func").find("[name='id']").val(res.id);
							$("#form-func").find("[name='name']").val(res.name);
							$("#form-func").find("[name='code']").val(res.code);
							$("#form-func").find("[name='description']").val(res.description);
						}
					}
				});
			}
		},
		bindEvent: function(){
			$("#func-window .close-btn").on("click", app.func.edit.close);
			$("#funcedit-save-btn").on("click", app.func.edit.saveForm);
		},
		saveForm: function(){
			var res = app.dzcheck.formCheck("#form-func");
			if(res){
				var fdata = app.comFun.selfFormSerialize("#form-func");
				app.api.func.update({
					data: fdata,
					success: function(res){
						if(res.msg == "ok"){
							app.alert("编辑成功");
							app.func.edit.close();
							app.func.listPager.refresh();
						}else{
							app.alert(res.msg);
						}
					}
				});
			}
		},
		open: function(){
			$m.page.openPage(app.func.edit.url, 'fade', 'container-wrapper');
		},
		close: function(){
			app.func.edit.dataId = null;
			$m.page.closePage(app.func.edit.url, 'fade', 'container-wrapper');
		}
}
