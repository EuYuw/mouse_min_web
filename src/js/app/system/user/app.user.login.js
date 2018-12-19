/**
 * login module
 */

app.user.login = {
		url : "pages/login.html",
		init : function() {
			$(document).off("keyup");
			$(document).on("keyup", function(e){
				if(e.keyCode == 13){
					e.preventDefault();
					e.stopPropagation();
					app.user.login.checkForm();
				}
			});
			$("#l-btn").on("click", app.user.login.checkForm);
		},
		checkForm : function() {
			var res = app.dzcheck.formCheck("#lg-fm");
			if(res){
				$("#l-btn").attr("disabled", true);
				setTimeout(function(){
					$("#l-btn").removeAttr("disabled");
				}, 2500);
				app.user.login.subForm();
			}
		},
		subForm: function(){
			var fdata = app.comFun.selfFormSerialize("#lg-fm");
			app.api.user.login({
				data: fdata,
				success: function(res){
					if(res){
						$(document).off("keyup");
						app.user.login.saveUm(res);
						app.main.open();
					}
				}
			});
		},
		saveUm : function(user) {
			var dt = new Date().getTime();
			var userJson = {
					un: user.userName,
					dt: dt,
					client_id: user.userApp == null ? "" : user.userApp.appId,
					client_secret: user.userApp == null ? "" :  user.userApp.appSecret
			}
			localStorage.setItem("u",JSON.stringify(userJson));
		},
		checkStatus : function() {
			var lcUser = localStorage.getItem("u");
			if (lcUser) {
				lcUser = JSON.parse(lcUser);
				var ct = new Date().getTime();
				var ot = lcUser.dt;
				var mt = ct - ot;
				if (mt < 0 || mt > 1800000) {
					app.user.login.open();
				} else {
					lcUser.dt = ct;
					app.api.user.getLgUser({
						success : function(data) {
							if (data) {
								lcUser.un = data.userName;
								localStorage.setItem("u", JSON.stringify(lcUser));
								app.main.open();
							} else {
								app.user.login.open();
							}
						}
					});
				}
			} else {
				app.user.login.open();
			}
		},
		out : function() {
			app.api.user.loginOut({});
			app.user.login.open();
		},
		open : function() {
			localStorage.clear();
			sessionStorage.clear();
			$m.page.container.clearContainer("container-wrapper");
			$m.page.loadPage(app.user.login.url, 'fade', 'container-wrapper');
		}
}
