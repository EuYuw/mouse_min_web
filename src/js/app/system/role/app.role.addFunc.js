/**
 * role addFunc
 */

app.role.addFunc = {
		url: "pages/system/role/roleAddFunc.html",
		roleCode: null,
		funcCodeArr: [],
		init: function(){
			this.initListPager();//list table
			this.serachRoleFunc();//role link function
			this.bindEvent();
		},
		initListPager: function(){
			app.role.addFunc.listPager = $m.listPager({
				pageSize: 10,
				varName: 'app.role.addFunc.listPager',
				itemId: 'dialog-list-func',
				columns: [
					{
						label: '<input type="checkbox" name="th-ckb" />',
						headStyle: 'width: 50px;',
						dataRender: function(data){
							return '<td class="txt-cn"><input type="checkbox" name="tr-ckb" value="'+data.code+'" /></td>';
						}
					},
					{
						name: 'name',
						label: '功能名称'
					}
				],
				dataProvider: function(listPager, callback) {
					app.loading.show();
					var query = listPager.query || {};
					query.pageSize = listPager.pageSize;
					query.pageNum = listPager.pageNum;
					if(listPager.orderBy) {
						query.orderBy = listPager.orderBy;
						query.sort = listPager.asc ? 'asc' : 'desc';
					}
					app.api.func.search({
						data: query,
						success: function(result) {
							app.loading.hide();
							callback(result.totalNum, result.datas);
							app.role.addFunc.checkFuncBox();//判断funccode勾选
						}
					});
				}
			});
		},
		serachRoleFunc: function(){
			if(app.role.addFunc.roleCode){
				app.api.role.rfSearch({
					data: {
						pageSize: 100,
						pageNum: 0,
						roleCode: app.role.addFunc.roleCode
					},
					success: function(res){
						app.role.addFunc.listPager.refresh();
						var resDatas = res.datas;
						for(var q = 0; q < resDatas.length; q++){
							app.role.addFunc.funcCodeArr.push(resDatas[q]["functionCode"]);//push functionCode into array
						}
					}
				});
			}
		},
		checkFuncBox: function(){
			var fcArr = app.role.addFunc.funcCodeArr;
			for(var p = 0; p < fcArr.length; p++){
				$("#dialog-list-func").find("[name='tr-ckb'][value='"+fcArr[p]+"']").prop("checked", true);
			}
			app.role.addFunc.thCkbNeedCkbed();
		},
		thCkbNeedCkbed: function(){//judge thead checkbox need checked
			var cklen = $("#dialog-list-func").find("[name='tr-ckb']").length;
			var ckedlen = $("#dialog-list-func").find("[name='tr-ckb']:checked").length;
			if(cklen > 0 && ckedlen == cklen){
				$("#dialog-list-func").find("[name='th-ckb']").prop("checked", true);
			}else{
				$("#dialog-list-func").find("[name='th-ckb']").prop("checked", false);
			}
		},
		handRoleFuncArr: function(){//checkbox click handle role function array
			var fcArr = app.role.addFunc.funcCodeArr;
			$("#dialog-list-func").find("[name='tr-ckb']").each(function(){
				var isCkbed = $(this).is(":checked");
				var rcode = $(this).val();
				var rcodeIndex = fcArr.indexOf(rcode);
				if(isCkbed){
					if(rcodeIndex == -1){
						fcArr.push(rcode);
					}
				}else{
					if(rcodeIndex != -1){
						fcArr.splice(rcodeIndex, 1);
					}
				}
			});
		},
		bindEvent: function(){//bind event
			$("#dialog-func-window .close-btn").on("click", app.role.addFunc.close);
			$("#save-rolefunc-btn").on("click", app.role.addFunc.saveForm);
			app.comFun.checkedAllBox("#dialog-list-func", "[name='th-ckb']", "[name='tr-ckb']");
			$("#dialog-list-func").on("click", "[name='th-ckb'], [name='tr-ckb']", app.role.addFunc.handRoleFuncArr);
			
			$("#dialog-form-func").on("click", ".srh-icon", function(){
				var data = $m("#dialog-form-func").serializeObject();
				var listPager = app.role.addFunc.listPager;
				listPager.query = data;
				listPager.pageNum = 0;
				listPager.refresh();
			});
			$m('#dialog-form-func').validate({//search form
				submitHandler : function(form) {
					var data = $m(form).serializeObject();
					var listPager = app.role.addFunc.listPager;
					listPager.query = data;
					listPager.pageNum = 0;
					listPager.refresh();
				}
			});
		},
		saveForm: function(){
			$("#save-rolefunc-btn").attr("disabled", true);
			setTimeout(function(){
				$("#save-rolefunc-btn").removeAttr("disabled");
			}, 2500);
			app.api.role.rfDel({
				data: {
					roleCode: app.role.addFunc.roleCode
				},
				success: function(res){
					if(res.msg == "ok"){
						var parr = [];
						var fcArr = app.role.addFunc.funcCodeArr;
						for(var r = 0; r < fcArr.length; r++){
							parr.push({
								roleCode: app.role.addFunc.roleCode,
								functionCode: fcArr[r]
							});
						}
						app.api.role.rfAdd({
							data: parr,
							success: function(ret){
								if(ret.msg == "ok"){
									app.alert("保存成功");
									app.role.addFunc.close();
									app.role.listPager.refresh();
								}else{
									app.alert(ret.msg);
								}
							}
						});
					}else{
						app.alert(res.msg);
					}
				}
			});
		},
		open: function(){
			$m.page.openPage(app.role.addFunc.url, 'fade', 'container-wrapper');
		},
		close: function(){
			app.role.addFunc.roleCode = null;
			app.role.addFunc.funcCodeArr = [];
			$m.page.closePage(app.role.addFunc.url, 'fade', 'container-wrapper');
		}
}
