/**
 * func add
 */

app.func.add = {
		url: "pages/system/func/addFunc.html",
		init: function(){
			this.bindEvent();
		},
		bindEvent: function(){
			$("#func-window .close-btn").on("click", app.func.add.close);
			$("#funcadd-save-btn").on("click", app.func.add.saveForm);
		},
		saveForm: function(){
			var res = app.dzcheck.formCheck("#form-func");
			if(res){
				var fcode = $("#form-func").find("[name='code']").val();
				app.api.func.findCode({
					data: {
						code: fcode
					},
					success: function(res){//res boolean true false
						if(res){
							var fdata = app.comFun.selfFormSerialize("#form-func");
							app.api.func.add({
								data: fdata,
								success: function(res){
									if(res.msg == "ok"){
										app.alert("新增成功");
										app.func.add.close();
										app.func.listPager.refresh();
									}else{
										app.alert(res.msg);
									}
								}
							});
						}else{
							app.alert("当前编码已存在");
							$("#form-func").find("[name='code']").val("");
						}
					}
				});
			}
		},
		open: function(){
			$m.page.openPage(app.func.add.url, 'fade', 'container-wrapper');
		},
		close: function(){
			$m.page.closePage(app.func.add.url, 'fade', 'container-wrapper');
		}
}
