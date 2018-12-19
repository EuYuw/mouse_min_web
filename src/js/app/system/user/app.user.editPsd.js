/**
 * user editPsd
 */

app.user.editPsd = {
		url: "pages/system/user/editPassword.html",
		dataId: null,
		init: function(){
			this.fillBackData();
			this.bindEvent();
		},
		fillBackData: function(){
			app.api.user.find({
				data: {
					id: app.user.editPsd.dataId
				},
				success: function(res){
					$("#form-user").find("[name='id']").val(res.id);
					$("#form-user").find("[name='userName']").val(res.userName);
				}
			});
		},
		bindEvent: function(){
			$("#user-window .close-btn").on("click", app.user.editPsd.close);
			$("#editpsd-save-btn").on("click", app.user.editPsd.saveForm);
		},
		saveForm: function(){
			var res = app.dzcheck.formCheck("#form-user");
			if(res){
				var newPsd = $("#form-user").find("[name='newPsd']").val();
				var surePsd = $("#form-user").find("[name='surePsd']").val();
				if(newPsd.length < 6){
					app.alert("新密码长度不能少于6位");
					return false;
				}
				if(newPsd != surePsd){
					app.alert("确认密码与新密码不一致");
					return false;
				}
				app.api.user.resetPsd({
					data: {
						userId: app.user.editPsd.dataId,
						password: newPsd,
						passwordConfirm: surePsd
					},
					success: function(res){
						if(res.msg == "ok"){
							app.alert("编辑成功");
							app.user.editPsd.close();
							app.user.listPager.refresh();
						}else{
							app.alert(res.msg);
						}
					}
				});
			}
		},
		open: function(){
			$m.page.openPage(app.user.editPsd.url, 'fade', 'container-wrapper');
		},
		close: function(){
			app.user.editPsd.dataId = null;
			$m.page.closePage(app.user.editPsd.url, 'fade', 'container-wrapper');
		}
}
