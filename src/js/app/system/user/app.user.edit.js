/**
 * user edit
 */

app.user.edit = {
		url: "pages/system/user/editUser.html",
		dataId: null,
		init: function(){
			this.fillBackData();
			this.bindEvent();
		},
		fillBackData: function(){
			app.api.user.find({
				data: {
					id: app.user.edit.dataId
				},
				success: function(res){
					if(res){
						$("#form-user").find("[name='id']").val(res.id);
						$("#form-user").find("[name='userName']").val(res.userName);
						$("#form-user").find("[name='email']").val(res.email);
						$("#form-user").find("[name='tel']").val(res.tel);
					}
				}
			});
		},
		bindEvent: function(){
			$("#user-window .close-btn").on("click", app.user.edit.close);
			$("#useredit-save-btn").on("click", app.user.edit.saveForm);
		},
		saveForm: function(){
			var res = app.dzcheck.formCheck("#form-user");
			if(res){
				var fdata = app.comFun.selfFormSerialize("#form-user");
				app.api.user.update({
					data: fdata,
					success: function(res){
						if(res.msg == "ok"){
							app.alert("编辑成功");
							app.user.edit.close();
							app.user.listPager.refresh();
						}else{
							app.alert(res.msg);
						}
					}
				});
			}
		},
		open: function(){
			$m.page.openPage(app.user.edit.url, 'fade', 'container-wrapper');
		},
		close: function(){
			app.user.edit.dataId = null;
			$m.page.closePage(app.user.edit.url, 'fade', 'container-wrapper');
		}
}
