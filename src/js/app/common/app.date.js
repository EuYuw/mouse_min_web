app.date = {
	shortDate: function(string) {
		var date = $m.date.toDate(string, 'yyyy-MM-dd');
		var now = new Date();

		var pattern = 'yyyy-MM-dd';
		if (date.getFullYear() === now.getFullYear()) {
			pattern = 'MM-dd';
			if (date.getMonth() === now.getMonth()) {
				if (date.getDate() === now.getDate()) {
					pattern = '今天';
				} else if (date.getDate() + 1 === now.getDate()) {
					pattern = '昨天';
				} else if (date.getDate() - 1 === now.getDate()) {
					pattern = '明天';
				}
			}
		}
		return $m.date.toString(date, pattern);
	},
	formatTimeLineDateTime: function(string) {
		var date = $m.date.toDate(string, 'yyyy-MM-dd HH:mm:ss');
		var now = new Date();

		var pattern = 'yyyy-MM-dd<br>HH:mm:ss';
		if (date.getFullYear() === now.getFullYear()) {
			pattern = 'MM-dd<br>HH:mm:ss';
			if (date.getMonth() === now.getMonth()) {
				if (date.getDate() === now.getDate()) {
					pattern = '今天<br>HH:mm:ss';
				} else if (date.getDate() + 1 === now.getDate()) {
					pattern = '昨天<br>HH:mm:ss';
				}
			}
		}
		return $m.date.toString(date, pattern);
	},
	formatTimeLineDateTimeWithoutBr: function(string) {
		var date = $m.date.toDate(string, 'yyyy-MM-dd HH:mm:ss');
		var now = new Date();

		var pattern = 'yyyy-MM-dd HH:mm:ss';
		if (date.getFullYear() === now.getFullYear()) {
			pattern = 'MM-dd HH:mm:ss';
			if (date.getMonth() === now.getMonth()) {
				if (date.getDate() === now.getDate()) {
					pattern = '今天 HH:mm:ss';
				} else if (date.getDate() + 1 === now.getDate()) {
					pattern = '昨天 HH:mm:ss';
				}
			}
		}
		return $m.date.toString(date, pattern);
	},
	formatDateTime: function(dateString) {
		var formatedDate = '';
		if (dateString) {
			var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
			formatedDate = (dateString + '').replace(pattern, '$1-$2-$3 $4:$5:$6');
		}
		return formatedDate;
	},
	formatDateTimeT: function(dateString) {
		var formatedDate = '';
		if (dateString) {
			formatedDate = dateString.substring(0, 19).replace('T', ' ');
		}
		return formatedDate;
	},
	formatBirthday: function(dateString) {
		var formatedDate = '';
		if (dateString.substring(4, 5) == '0' && dateString.substring(6, 7) == '0') {
			formatedDate = dateString.substring(0, 4) + '年' + dateString.substring(5, 6) + '月' + dateString.substring(7, 8) +
				'日';
		} else if (dateString.substring(4, 5) == '0') {
			formatedDate = dateString.substring(0, 4) + '年' + dateString.substring(5, 6) + '月' + dateString.substring(6, 8) +
				'日';
		} else if (dateString.substring(6, 7) == '0') {
			formatedDate = dateString.substring(0, 4) + '年' + dateString.substring(4, 6) + '月' + dateString.substring(7, 8) +
				'日';
		} else {
			formatedDate = dateString.substring(0, 4) + '年' + dateString.substring(4, 6) + '月' + dateString.substring(6, 8) +
				'日';
		}
		return formatedDate;
	},
	// 获取昨天、明天日期
	getDateStr: function(AddDayCount) {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		date.setFullYear(year, month, day + AddDayCount);
		var newYear = date.getFullYear().toString();
		var newMonth = date.getMonth().toString();
		var newDay = date.getDate().toString();
		if (newMonth.length == 1) {
			newMonth = 0 + newMonth;
		}
		if (newDay.length == 1) {
			newDay = 0 + newDay;
		}
		var result = newYear + '-' + newMonth + '-' + newDay;
		return result;
	}
};
