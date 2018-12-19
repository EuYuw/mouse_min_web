/**
 * user add
 */

app.user.add = {
		url: "pages/system/user/addUser.html",
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			$("#user-window .close-btn").on("click", app.user.add.close);
			$("#useradd-save-btn").on("click", app.user.add.saveForm);
		},
		saveForm: function(){
			var res = app.dzcheck.formCheck("#form-user");
			if(res){
				var fdata = app.comFun.selfFormSerialize("#form-user");
				if(fdata.password.length < 6){
					app.alert("密码长度不能少于6位");
					return false;
				}
				app.api.user.add({
					data: fdata,
					success: function(res){
						if(res.msg == "ok"){
							app.alert("新增成功");
							app.user.add.close();
							app.user.listPager.refresh();
						}else{
							app.alert(res.msg);
						}
					}
				});
			}
		},
		open: function(){
			$m.page.openPage(app.user.add.url, 'fade', 'container-wrapper');
		},
		close: function(){
			$m.page.closePage(app.user.add.url, 'fade', 'container-wrapper');
		}
}
