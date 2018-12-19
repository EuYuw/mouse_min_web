/**
 * home nav
 */

app.home.nav = {
		init: function(){
			this.bindEvent();//事件处理
		},
		bindEvent: function(){
			$("#nav-wrap").on("click", ".toggle-item", function(){//fold spread
				if($(this).hasClass("open")){
					$(this).removeClass("open");
					$(this).next("ul.toggle-menu").removeClass("spread").slideUp(300);
				}else{
					$("#nav-wrap .open").next("ul.toggle-menu").removeClass("spread").slideUp(300);
					$("#nav-wrap .open").removeClass("open");
					$(this).addClass("open");
					$(this).next("ul.toggle-menu").addClass("spread").slideDown(300);
				}
			});
			$("#nav-wrap").on("click", ".toggle-menu>li", function(){//item jump
				$("#nav-wrap").find(".toggle-menu>li.active").removeClass("active")
				$(this).addClass("active");
				var dataMenu = $(this).attr("data-menu");
				if(dataMenu){
					var us = app.home.nav.getNavList(dataMenu);
					$m.page.loadPage(us);
				}
			});
		},
		getNavList: function(menuType){
			var us = {
				url: "", 
				container: "container"
			};
			switch (menuType){
				case "user-manage"://系统管理 用户管理
					us.url = "pages/system/user/index.html";
					break;
				case "user-role"://系统管理 用户管理
					us.url = "pages/system/role/index.html";
					break;
				case "user-func"://系统管理 用户管理
					us.url = "pages/system/func/index.html";
					break;
				default: 
					break;
			}
			return us;
		}
}
