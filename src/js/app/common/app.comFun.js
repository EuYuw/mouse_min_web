/**
 * 公共方法
 */

app.comFun = {
	/**
	 * 绑定勾选框事件
	 * @param parObj 外层对象 选择器string
	 * @param checkAllBox 全选框 选择器string
	 * @param checkBox 单个选择框 选择器string
	 */
	checkedAllBox : function(parObj, checkAllBox, checkBox) {
		$(parObj).on("click", checkAllBox, function() {
			if ($(this).is(":checked")) {
				$(parObj).find(checkBox).prop("checked", true);
			} else {
				$(parObj).find(checkBox).prop("checked", false);
			}
		});
		$(parObj).on("click", checkBox, function() {
			var ckbLen = $(parObj).find(checkBox).length;
			var ckbEdLen = $(parObj).find(checkBox + ":checked").length;
			if (ckbLen != 0 && ckbLen == ckbEdLen) {
				$(parObj).find(checkAllBox).prop("checked", true);
			} else {
				$(parObj).find(checkAllBox).prop("checked", false);
			}
		});
	},
	selfFormSerialize : function(obj) {// 自定义的表单序列化,暂时未考虑radio，checkbox
		var jsonData = {};
		if ($(obj)) {
			$(obj).find("input[type='text'][name],input[type='password'][name],input[type='hidden'][name],select[name],textarea[name]").each(function(i, e) {
						var tname = $(e).attr("name");
						var tval = $(e).val();
						tval = tval == null ? "" : tval;
						if (tname.indexOf(".") == -1) {
							jsonData[tname] = tval;
						} else {
							var pkey = tname.split(".")[0];
							var skey = tname.split(".")[1];
							if (!jsonData.hasOwnProperty(pkey)) {
								jsonData[pkey] = {};
								jsonData[pkey][skey] = tval;
							} else {
								jsonData[pkey][skey] = tval;
							}
						}
					});
		}
		return jsonData;
	},
	uuid: function(len, radix){//生成随机数
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 
		var uuid = [], i; 
		radix = radix || chars.length; 
		
		if (len) { 
		  // Compact form 
		  for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix]; 
		} else { 
		  // rfc4122, version 4 form 
		  var r; 
		
		  // rfc4122 requires these characters 
		  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; 
		  uuid[14] = '4'; 
		
		  // Fill in random data.  At i==19 set the high bits of clock sequence as 
		  // per rfc4122, sec. 4.1.5 
		  for (i = 0; i < 36; i++) { 
			if (!uuid[i]) { 
			  r = 0 | Math.random()*16; 
			  uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; 
			} 
		  } 
		} 
		return uuid.join(''); 
	}
	
}