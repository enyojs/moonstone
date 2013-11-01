/**
	_moon.Calendar_ is a control that displays a monthly calendar, with the
	month name at the top and a grid of days, grouped into rows by week, below.

	The header buttons are used to navigate to the desired month; the desired day
	is selected by tapping on it.

	{kind: "moon.Calendar", content: "Calendar Title"}
*/
enyo.kind({
	name: "moon.CalendarDate",
	kind: "moon.Button",
	small: true,
	marquee: false,
	minWidth: false,
	classes: "moon-calendar-picker-date enyo-unselectable",
	published: {
		value: null,
		color: 0
	},
	events: {
		onDateSelected:""
	},
	create: function() {
		this.inherited(arguments);
		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({
				type: "date",	//only format the date component, not the time
				date: "d",		//'d' is the date of month
				length: "short"	//it uses 2 chars to abbreviate properly
			});
		}
	},
	colorChanged: function(inOld) {
		this.addRemoveClass("moon-calendar-picker-date-shadow", this.color);
	},
	valueChanged: function() {
		if (typeof ilib !== "undefined") {
			var date = ilib.Date.newInstance({unixtime: (this.value.getDate() - 1) * (24*60*60*1000)});
			this.setContent(this._tf.format(date));
		} else {
			this.setContent(this.value.getDate());
		}
	},
	tap: function() {
		this.doDateSelected();
	}
});

enyo.kind({
	name: "moon.Calendar",
	classes: "moon-calendar-picker",
	events: {
		/**
			Fires when the date changes.

			_inEvent.name_ contains the name of this control.

			_inEvent.value_ contains a standard JavaScript Date object representing
			the current date.
		*/
		onChange: ""
	},
	published: {
		/**
			ilib locale info instance. It gives information about the paarticular locale.
		*/
		ilibLocaleInfo: null,
		/**
			Current locale used for formatting. May be set after the control is
			created, in which case the control will be updated to reflect the
			new value.  Only valid if ilib is loaded.
		*/
		locale: "",
		/**
			The current Date object. When a Date object is passed to _setValue_,
			the control is updated to reflect the new value. _getValue_ returns
			a Date object.
		*/
		value: null,
		/**
			The day of week that starts weeks in current locale.
			Valid values are Sumday (0) through Saturday (6).
			As a default, Sunday is the first day of week.
		*/
		firstDayOfWeek: 0,
		/**
			The maximum number of weeks to display in a screen.
			If this value is greater than 9, dates two months in the future may be
			shown. Unexpected input may result in errors.
		*/
		maxWeeks: 6,
		/**
			The range of yearPicker to be displayed.
			Initial value is from 1900 to 2200
		*/
		startYear: 1900,
		endYear: 2200,
		/**
			The class which will decorate day lebels (e.g. moon-divider)
		*/
		dayOfWeekClasses: "",
		/**
			The length of character to abbreviate property
			If we use "short", "medium", long" and "full" to represent it.
			Only valid if ilib is loaded.
		*/
		dayOfWeekLength: "short"
	},
	//*@protected
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	days: ["S","M","T","W","T","F","S"],
	components: [
		{name: "monthPicker", kind: "moon.SimplePicker", classes: "moon-calendar-picker-month", onChange: "selectMonthPicker"},
		{name: "yearPicker", kind: "moon.SimplePicker", classes: "moon-calendar-picker-year", onChange: "selectYearPicker"},
		{name: "days", classes: "moon-calendar-picker-days moon-neutral", kind: "enyo.Group"},
		{name: "dates", kind: "enyo.Group"}
	],
	create: function() {
		this.inherited(arguments);
		this.initYearPicker(this.startYear, this.endYear);
		this.initMonthPicker();
		this.initDays();
		this.initCalendar();

		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({
				type: "date",	//only format the date component, not the time
				date: "w",		//'w' is the day of the week
				length: this.dayOfWeekLength
			});

			this.ilibLocaleInfo = new ilib.LocaleInfo();
			this.setLocale(this.ilibLocaleInfo.locale);
		} else {
			this.initDefaults();
		}
	},
	initDefaults: function() {
		this.setValue(this.value || new Date());
		//Attempt to use the ilib lib (assuming that it is loaded)
		if (typeof ilib !== "undefined") {
			this.firstDayOfWeek = this.ilibLocaleInfo.getFirstDayOfWeek();
		}
		this.firstDayOfWeekChanged();
	},
	/**
		Populates SimplePicker with years.
	*/
	initYearPicker: function(startYear, endYear) {
		for (var i = startYear; i <= endYear; i++) {
			this.$.yearPicker.createComponent(
				{content: i, classes: "picker-content"}
			);
		}
	},
	/**
		Populates SimplePicker with months of the year, from JAN to DEC.
	*/
	initMonthPicker: function() {
		var months = this.months;
		for (var i = 0; i < 12; i++) {
			this.$.monthPicker.createComponent(
				{content: months[i], classes: "picker-content"}
			);
		}
	},
	/**
		Initiate days of the week from first day to last day.
		Initially, SUN is the first day and SAT is the last day of week.
	*/
	initDays: function() {
		for(var i = 0; i < 7; i++) {
			this.$.days.createComponent({
				classes: "moon-calendar-picker-day-base " + (this.dayOfWeekClasses || "moon-calendar-picker-day"),
				disabled: true
			});
		}
	},
	/**
		Compose calendar with number of calendarDate
	*/
	initCalendar: function() {
		if (!this.$.dates.controls.length) {
			for (var i = 1; i <= this.maxWeeks * 7; i++) {
				this.$.dates.createComponent({kind: "moon.CalendarDate", onDateSelected:"selectDate"}, {owner:this});
			}
		}
	},
	parseDate: function() {
		if (this._tf) {
			return this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
		} else {
			return this.months[this.value.getMonth()] + " " + this.value.getDate() + ", " + this.value.getFullYear();
		}
	},
	/**
		Month name could be various depends on its locale
	*/
	updateMonthPicker: function() {
		if (typeof ilib !== "undefined") {
			var fmt = new ilib.DateFmt({
				locale: this.locale,
				type: "date",	//only format the date component, not the time
				date: "m",		//'m' is the month of year
				length: "long"
			});
			var monthPickerControls = this.$.monthPicker.getClientControls();
			for (var i = 0; i < 12; i++) {
				var date = ilib.Date.newInstance({unixtime: i * 31 * (24*60*60*1000)});
				monthPickerControls[i].setContent(fmt.format(date));
			}
		}
	},
	/**
		Update days of the week from first day to last day.
	*/
	updateDays: function() {
		var daysControls = this.$.days.getClientControls();
		for(var i = 0; i < 7; i++) {
			if (typeof ilib !== "undefined") {
				var date = ilib.Date.newInstance({unixtime: i*(24*60*60*1000) + this._firstTime});
				var day = this._tf.format(date);
				daysControls[i].setContent(day);
			} else {
				daysControls[i].setContent(this.days[(this.firstDayOfWeek + i) % 7]);
			}
		}
	},
	/**
		Sets up the first week of this month.
		Before the first day of this month, days from the previous month will be
		used to fill the calendar.
	*/
	updatePrevMonth: function() {
		var value = this.value;
		var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		dt.setDate(0);
		var thisYear = dt.getFullYear(),
			datesOfPrevMonth = dt.getDate(),
			dayOfLastDate = dt.getDay() - this.firstDayOfWeek,
			prevMonth = dt.getMonth();
		if (dayOfLastDate < 0) {
			dayOfLastDate += 7;
		}
		if (dayOfLastDate !== 6) {
			var dates = this.$.dates.getControls();
			for (var i = 0; i <= dayOfLastDate; i++) {
				dates[i].setValue(new Date(thisYear, prevMonth, datesOfPrevMonth - dayOfLastDate + i));
				dates[i].setColor(1);
			}
			return i;
		}
		return 0;
	},
	/**
		Sets up the last week of this month.
		After the last day of this month, days from the next month will be used to
		fill the calendar.
	*/
	updateNextMonth: function(startIndex) {
		var value = this.value;
		var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		dt.setMonth(dt.getMonth() + 1);
		var thisYear = dt.getFullYear(),
			nextMonth = dt.getMonth();
		var dates = this.$.dates.getControls();
		for (var i = 0; i < this.$.dates.controls.length - startIndex; i++) {
			dates[startIndex + i].setValue(new Date(thisYear, nextMonth, i + 1));
			dates[startIndex + i].setColor(1);
		}
	},
	updateDates: function() {
		var datesOfPrevMonth = this.updatePrevMonth();

		var thisYear = this.value.getFullYear(),
			thisMonth = this.value.getMonth();
		var	monthLength = this.getMonthLength(thisYear, thisMonth);
		var dates = this.$.dates.getControls();
		for (var i = 0; i < monthLength; i++) {
			dates[datesOfPrevMonth + i].setValue(new Date(thisYear, thisMonth, i + 1));
			dates[datesOfPrevMonth + i].setColor(0);
		}
		this.$.dates.setActive(dates[datesOfPrevMonth - 1 + this.value.getDate()]);
		this.updateNextMonth(datesOfPrevMonth + monthLength);
	},
	setYear: function(newYear) {
		if (this.value.getYear() != newYear) {
			var value = this.value,
				newValue,
				newMonthLength = this.getMonthLength(newYear, value.getMonth());
			if(newMonthLength < value.getDate()) {
				newValue = new Date(newYear, value.getMonth(), newMonthLength);
			} else {
				newValue = new Date(newYear, value.getMonth(), value.getDate());
			}
			this.setValue(newValue);
		}
	},
	setMonth: function(newMonth) {
		if (this.value.getMonth() != newMonth) {
			var value = this.value,
				newValue,
				newMonthLength = this.getMonthLength(value.getFullYear(), newMonth);
			if(newMonthLength < value.getDate()) {
				newValue = new Date(value.getFullYear(), newMonth, newMonthLength);
			} else {
				newValue = new Date(value.getFullYear(), newMonth, value.getDate());
			}
			this.setValue(newValue);
		}
	},
	setDate: function(newDate) {
		var value = this.value,
			newValue,
			monthLength = this.getMonthLength(value.getFullYear(), value.getMonth());
		if(monthLength < newDate) {
			newValue = new Date(value.getFullYear(), value.getMonth(), monthLength);
		} else {
			newValue = new Date(value.getFullYear(), value.getMonth(), newDate);
		}
		this.setValue(newValue);
	},
	/**
		Select a control in calendar with tapping a date button in calendar
	*/
	selectDate: function(inSender, inEvent) {
		var newValue = inEvent.originator.value;
		this.setValue(newValue);
		return true;
	},
	/**
		Select a control in yearPicker using left and right arrow button
	*/
	selectYearPicker: function(inSender, inEvent) {
		var year = this.$.yearPicker.getSelected().getContent();
		this.setYear(year);
	},
	/**
		Select a control in monthPicker using left and right arrow button
	*/
	selectMonthPicker: function(inSender, inEvent) {
		var month = this.$.monthPicker.getSelectedIndex();
		this.setMonth(month);
	},
	/**
		Returns number of days in a particular month/year.
		@param inYear
		@param inMonth
		@return Number of dates in given year and month
	*/
	getMonthLength: function(inYear, inMonth) {
		if (typeof ilib !== "undefined") {
			var d = ilib.Date.newInstance({unixtime: this.value.getTime()});
			var cal = ilib.Cal.newInstance({name: d.getCalendar()});
			return cal.getMonLength(inMonth + 1, inYear);
		} else {
			return 32 - new Date(inYear, inMonth, 32).getDate();
		}
	},
	localeChanged: function() {
		if (typeof ilib !== "undefined") {
			this.ilibLocaleInfo = new ilib.LocaleInfo(this.locale);
			this._tf = new ilib.DateFmt({
				locale: this.locale,
				type: "date",	//only format the date component, not the time
				date: "w",		//'w' is the day of the week
				length: this.dayOfWeekLength
			});
		}
		this.updateMonthPicker();
		this.initDefaults();
		this.doChange({value: this.value});
	},
	valueChanged: function(inOld) {
		if (!this.generated || this.$.monthPicker.getSelectedIndex() != this.value.getMonth()) {
			this.$.monthPicker.setSelectedIndex(this.value.getMonth());
		}
		if (!this.generated || this.$.yearPicker.getSelected().getContent() != this.value.getFullYear()) {
			this.$.yearPicker.setSelectedIndex(this.value.getFullYear() - this.startYear);
		}
		this.updateDates();
		if (this.value) {
			this.doChange({value: this.value});
		}
	},
	/**
		When user(or developer) want change style of day label dynamically,
		it will replace css classes for them.
	*/
	dayOfWeekClassesChanged: function(inOld) {
		var dayControls = this.$.days.getClientControls();
		for (var i = 0; i < dayControls.length; i++) {
			dayControls[i].removeClass(inOld || "moon-calendar-picker-day");
			dayControls[i].addClass(this.dayOfWeekClasses || "moon-calendar-picker-day");
		}
	},
	dayOfWeekLengthChanged: function() {
		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({
				locale: this.locale,
				type: "date",	//only format the date component, not the time
				date: "w",		//'w' is the day of the week
				length: this.dayOfWeekLength
			});
			this.updateDays();
		}
	},
	/**
		Sometimes first day of week is channged based on locale changing.
		In this case, destroy day label and reconsturct it.
		Create new ilib.Date instance with time of given day, and get Gregorian
		date instance that represents the first date of the week.

	*/
	firstDayOfWeekChanged: function() {
		if (typeof ilib !== "undefined") {
			var d = ilib.Date.newInstance({unixtime: this.value.getTime()});
			var firstDate = d.onOrBefore(this.firstDayOfWeek);
			this._firstTime = firstDate.getTime();	//get unix time
		}
		this.updateDays();
		this.updateDates();
	}
});