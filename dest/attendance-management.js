(() => {
	kintone.events.on('app.record.create.show', (event) => {
		var record = event.record;
		if (event.reuse) {
			return event;
		}

		const weekChars = ['日', '月', '火', '水', '木', '金', '土'];
		// Luxon オブジェクトを生成
		var date = luxon.DateTime.local();
		//年月
		record.year_month.value = date.toFormat('yyyyMM');
		// 月末
		var endOfMonth = date.endOf('month');
		var endDay = endOfMonth.day;
		for (var i = 1; i <= endDay; i++) {
			if (i == 1) {
				var getDate = new Date(date.year, date.month - 1, 1);
				var getDay = getDate.getDay();
				record.table.value[0].value.date.value = date
					.startOf('month')
					.toFormat('yyyy-MM-dd');
				record.table.value[0].value.dayOfWeek.value = weekChars[getDay];
				record.table.value[0].value.work_kbn.value =
					getDay == 0 || getDay == 6 ? '休日' : '通常勤務';
				record.table.value[0].value.attendance_time.value = '00:00';
				record.table.value[0].value.leave_time.value = '00:00';
				record.table.value[0].value.break_time.value = '00:00';
				record.table.value[0].value.actual_work_time.value = '00:00';
			} else {
				var dt = luxon.DateTime.fromObject({
					year: date.year,
					month: date.month,
					day: i,
				});
				var getDate = new Date(dt.year, dt.month - 1, dt.day);
				var getDay = getDate.getDay();
				record.table.value.push({
					value: {
						date: {
							value: dt.toFormat('yyyy-MM-dd'),
							type: 'DATE',
						},
						dayOfWeek: {
							value: weekChars[getDay],
							type: 'DROP_DOWN',
						},
						work_kbn: {
							value:
								getDay == 0 || getDay == 6
									? '休日'
									: '通常勤務',
							type: 'DROP_DOWN',
						},
						attendance_time: {
							value: '00:00',
							type: 'TIME',
						},
						leave_time: {
							value: '00:00',
							type: 'TIME',
						},
						break_time: {
							value: '00:00',
							type: 'TIME',
						},
						actual_work_time: {
							value: '00:00',
							type: 'CALC',
						},
						remarks: {
							value: '',
							type: 'SINGLE_LINE_TEXT',
						},
					},
				});
			}
		}
		return event;
	});
})();
