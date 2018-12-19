/**
 * 验证类
 */

app.dzcheck = {
		formCheck: function(obj){
			var res = true;
			$(obj).find("[data-dzck]").each(function(i,e){
				$(e).removeClass("chk-error");
				if(!$(e).is(":hidden")){
					var cType = $(e).attr("data-dzck");
					var msg = $(e).attr("data-emsg");
					if(cType.indexOf(",") != -1 && msg.indexOf(",") != -1){
						var ctArr = cType.split(",");
						var msgArr = msg.split(",");
						for(var o = 0; o < ctArr.length; o++){
							res = app.dzcheck.mainCheckMethod(ctArr[o], $(e), msgArr[o]);
							if(!res){
								return false;
							}
						}
					}else{
						res = app.dzcheck.mainCheckMethod(cType, $(e), msg);
					}
					if(!res){
						return false;
					}
				}
			});
			return res;
		},
		mainCheckMethod: function(cType, obj, msg){
			var checked = true;
			var val = obj.val();
			if(cType == "notnull" && !app.dzcheck.notNullCheck(val)){
				checked = false;
				msg = "undefined" == typeof msg ? "此项为必填项" : msg;
			}else if(cType == "email"  && !app.dzcheck.emailCheck(val)){
				checked = false;
				msg = "undefined" == typeof msg ? "邮箱格式错误" : msg;
			}else if(cType == "phone"  && !app.dzcheck.phoneCheck(val)){
				checked = false;
				msg = "undefined" == typeof msg ? "手机号码格式错误" : msg;
			}else if(cType == "tel"  && !app.dzcheck.telCheck(val)){
				checked = false;
				msg = "undefined" == typeof msg ? "电话号码格式错误" : msg;
			}
			if(!checked){
				app.dzcheck.chkErrorStyle(obj, msg);
			}
			return checked;
		},
		notNullCheck: function(param){//空校验
			var checkResult = true;
			if("object" == typeof param){
				param = $(param).val();
			}
			if(param == "" || param == null || param.length == 0){
				checkResult = false;
			}
			return checkResult;
		},
		phoneCheck: function(param){//手机号码校验
			var checkResult = true;
			if("object" == typeof param){
				param = $(param).val();
			}
			if(!/^\d{11}$/g.test(param) && param){
				checkResult = false;
			}
			return checkResult;
		},
		telCheck: function(param){//电话号码校验
			var checkResult = true;
			if("object" == typeof param){
				param = $(param).val();
			}
			if(!/((\d{3,4}-\d{8,16})|(\d{11}))/g.test(param) && param){
				checkResult = false;
			}
			return checkResult;
		},
		emailCheck: function(param){//邮箱校验
			var checkResult = true;
			if("object" == typeof param){
				param = $(param).val();
			}
			if(!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{1,})$/g.test(param) && param){
				checkResult = false;
			}
			return checkResult;
		},
		chkErrorStyle: function(obj, errorMsg){
			if(errorMsg){
				app.alert(errorMsg);
			}
			$(obj).addClass("chk-error");
			setTimeout(function(){
				$(obj).removeClass("chk-error");
			}, 3500);
		}
};
