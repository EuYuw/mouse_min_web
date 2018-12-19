/**
 * main  
 */
app.main = {
		url: "pages/home/home.html",
		open: function(){
			$m.page.loadPage(app.main.url, 'fade', 'container-wrapper');
		}
};
