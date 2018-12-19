/**
 * user addRole
 */

app.user.addRole = {
		url: "pages/system/user/userAddRole.html",
		userId: null,
		userRoleArr: [],//user role array
		init: function(){
			this.initListPager();//list table
			this.serachUserRole();//user link role
			this.bindEvent();
		},
		initListPager: function(){
			app.user.addRole.listPager = $m.listPager({
					pageSize: 10,
					varName: 'app.user.addRole.listPager',
					itemId: 'dialog-list-role',
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
							label: '角色名称'
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
						app.api.role.search({
							data: query,
							success: function(result) {
								app.loading.hide();
								callback(result.totalNum, result.datas);
								app.user.addRole.checkRoleBox();//判断role勾选
							}
						});
					}
				});
		},
		serachUserRole: function(){
			if(app.user.addRole.userId){
				app.api.user.urSearch({
					data: {
						pageSize: 100,
						pageNum: 0,
						userId: app.user.addRole.userId
					},
					success: function(res){
						app.user.addRole.listPager.refresh();
						var resDatas = res.datas;
						for(var q = 0; q < resDatas.length; q++){
							app.user.addRole.userRoleArr.push(resDatas[q]["roleCode"]);//push roleCode into array
						}
					}
				});
			}
		},
		checkRoleBox: function(){
			var urArr = app.user.addRole.userRoleArr;
			for(var p = 0; p < urArr.length; p++){
				$("#dialog-list-role").find("[name='tr-ckb'][value='"+urArr[p]+"']").prop("checked", true);
			}
			app.user.addRole.thCkbNeedCkbed();
		},
		thCkbNeedCkbed: function(){//judge thead checkbox need checked
			var cklen = $("#dialog-list-role").find("[name='tr-ckb']").length;
			var ckedlen = $("#dialog-list-role").find("[name='tr-ckb']:checked").length;
			if(cklen > 0 && ckedlen == cklen){
				$("#dialog-list-role").find("[name='th-ckb']").prop("checked", true);
			}else{
				$("#dialog-list-role").find("[name='th-ckb']").prop("checked", false);
			}
		},
		handUserRoleArr: function(){//checkbox click handle user role array
			var urArr = app.user.addRole.userRoleArr;
			$("#dialog-list-role").find("[name='tr-ckb']").each(function(){
				var isCkbed = $(this).is(":checked");
				var rcode = $(this).val();
				var rcodeIndex = urArr.indexOf(rcode);
				if(isCkbed){
					if(rcodeIndex == -1){
						urArr.push(rcode);
					}
				}else{
					if(rcodeIndex != -1){
						urArr.splice(rcodeIndex, 1);
					}
				}
			});
		},
		bindEvent: function(){//bind event
			$("#dialog-role-window .close-btn").on("click", app.user.addRole.close);
			$("#save-userrole-btn").on("click", app.user.addRole.saveForm);
			app.comFun.checkedAllBox("#dialog-list-role", "[name='th-ckb']", "[name='tr-ckb']");
			$("#dialog-list-role").on("click", "[name='th-ckb'], [name='tr-ckb']", app.user.addRole.handUserRoleArr);
			
			$("#dialog-form-role").on("click", ".srh-icon", function(){
				var data = $m("#dialog-form-role").serializeObject();
				var listPager = app.user.addRole.listPager;
				listPager.query = data;
				listPager.pageNum = 0;
				listPager.refresh();
			});
			$m('#dialog-form-role').validate({//search form
				submitHandler : function(form) {
					var data = $m(form).serializeObject();
					var listPager = app.user.addRole.listPager;
					listPager.query = data;
					listPager.pageNum = 0;
					listPager.refresh();
				}
			});
		},
		saveForm: function(){
			$("#save-userrole-btn").attr("disabled", true);
			setTimeout(function(){
				$("#save-userrole-btn").removeAttr("disabled");
			}, 2500);
			app.api.user.urDel({
				data: {
					userId: app.user.addRole.userId
				},
				success: function(res){
					if(res.msg == "ok"){
						var parr = [];
						var urArr = app.user.addRole.userRoleArr;
						for(var r = 0; r < urArr.length; r++){
							parr.push({
								userId: app.user.addRole.userId,
								roleCode: urArr[r]
							});
						}
						app.api.user.urAdd({
							data: parr,
							success: function(ret){
								if(ret.msg == "ok"){
									app.alert("保存成功");
									app.user.addRole.close();
									app.user.listPager.refresh();
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
			$m.page.openPage(app.user.addRole.url, 'fade', 'container-wrapper');
		},
		close: function(){
			app.user.addRole.userRoleArr = [];
			app.user.addRole.userId = null;
			$m.page.closePage(app.user.addRole.url, 'fade', 'container-wrapper');
		}
}
