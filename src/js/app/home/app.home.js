/**
 * home
 */

app.home = {
		init: function(){
			this.loadNav(); 
			this.bindEvent();
		},
		loadNav: function(){
			$m.page.loadPage("pages/home/nav.html", "fade", "nav-wrap");
		},
		bindEvent: function(){
			$("#l-oper-bar").on("mouseover", function(e){
				e.stopPropagation();
				$(".l-oper-ul").stop().slideDown(250);
			}).on("mouseleave", function(e){
				e.stopPropagation();
				$(".l-oper-ul").stop().slideUp(250);
			});
			$("#l-oper-bar").on("click", "li[data-oper]", function(){
				var oper = $(this).attr("data-oper");
				if(oper == "lgout"){
					app.user.login.out();
				}
			});
		},
		open: function(){//open main
			$m.page.loadPage({
				url: "pages/home/home.html",
				container: "container-wrapper"
			});
		}
}
