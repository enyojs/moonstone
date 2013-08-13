/**
	_moon.CalendarPicker_ is a control that displays a monthly calendar, with the
	month name at the top and a grid of days, grouped into rows by week, below.

	The header buttons are used to navigate to the desired month; the desired day
	is selected by tapping on it.

	{kind: "moon.CalendarPicker", content: "Calendar Title"}
*/
enyo.kind({
	name: "moon.CalendarPickerDate",
	kind: "moon.Button",
	small: true,
	marquee: false,
	classes: "moon-calendar-picker-date enyo-unselectable",
	published: {
		value: null,
		color: 0
	},
	colorChanged: function(inOld) {
		if (this.color) {
			this.addClass("moon-calendar-picker-date-shadow");
		} else {
			this.removeClass("moon-calendar-picker-date-shadow");
		}
	},
	valueChanged: function() {
		this.setContent(this.value.getDate());
	}
});

enyo.kind({
	name: "moon.CalendarPicker",
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
	handlers: {
		ontap: "selectDate",
		//* Handler for _onChange_ events coming from constituent controls
		onChange: "updateSimplePicker"
	},
	published: {
		/**
			Current locale used for formatting. May be set after the control is
			created, in which case the control will be updated to reflect the
			new value.
		*/
		locale: "en_us",
		/**
			The current Date object. When a Date object is passed to _setValue_,
			the control is updated to reflect the new value. _getValue_ returns
			a Date object.
		*/
		value: null,
		/**
			The maximum number of weeks to display in a screen.
			If this value is greater than 9, dates two months in the future may be
			shown. Unexpected input may result in errors.
		*/
		maxWeeks: 6,
		months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
	},
	components: [
		{name: "simplePicker", kind: "moon.SimplePicker", classes: "moon-calendar-picker-simplepicker"},
		{name: "dates", kind: "enyo.Group"}
	],
	create: function() {
		this.inherited(arguments);
		if (enyo.g11n) {
			this.locale = enyo.g11n.currentLocale().getLocale();
		}
		this.setupSimplePicker();
		this.setupCalendar();
		this.initDefaults();
	},
	initDefaults: function() {
		//Attempt to use the g11n lib (assuming that it is loaded)
		if (enyo.g11n) {
			this._tf = new enyo.g11n.Fmts({locale:this.locale});
		}

		this.setValue(this.value || new Date());			
	},
	/**
		Populates SimplePicker with months of the year, from JAN to DEC.
	*/
	setupSimplePicker: function() {
		var months = this.months;
		this.$.simplePicker.addClass("moon-simple-picker-button-bold");
		for (var i = 0; i < 12; i++) {
			this.$.simplePicker.createComponent(
				{content: months[i], classes: "picker-content"}
			);
		}
	},
	/**
		Compose calendar with number of calendarDate
	*/
	setupCalendar: function() {
		if (!this.$.dates.controls.length) {
			for (var i = 1; i <= this.maxWeeks * 7; i++) {
				this.$.dates.createComponent({kind: "moon.CalendarPickerDate"});
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
			dayOfLastDate = dt.getDay(),
			prevMonth = dt.getMonth();
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
		var	monthLength = this.monthLength(thisYear, thisMonth);
		var dates = this.$.dates.getControls();
		for (var i = 0; i < monthLength; i++) {
			dates[datesOfPrevMonth + i].setValue(new Date(thisYear, thisMonth, i + 1));
			dates[datesOfPrevMonth + i].setColor(0);
		}
		this.$.dates.setActive(dates[datesOfPrevMonth - 1 + this.value.getDate()]);
		this.updateNextMonth(datesOfPrevMonth + monthLength);
	},
	setYear: function(newYear) {
		var value = this.value,
			newValue,
			newMonthLength = this.monthLength(newYear, value.getMonth());
		if(newMonthLength < value.getDate()) {
			newValue = new Date(newYear, value.getMonth(), newMonthLength);
		} else {
			newValue = new Date(newYear, value.getMonth(), value.getDate());
		}
		this.setValue(newValue);
	},
	setMonth: function(newMonth) {
		var value = this.value,
			newValue,
			newMonthLength = this.monthLength(value.getFullYear(), newMonth - 1);
		if(newMonthLength < value.getDate()) {
			newValue = new Date(value.getFullYear(), newMonth - 1, newMonthLength);
		} else {
			newValue = new Date(value.getFullYear(), newMonth - 1, value.getDate());
		}
		this.setValue(newValue);
	},
	setDate: function(newDate) {
		var value = this.value,
			newValue,
			monthLength = this.monthLength(value.getFullYear(), value.getMonth());
		if(monthLength < newDate) {
			newValue = new Date(value.getFullYear(), value.getMonth(), monthLength);
		} else {
			newValue = new Date(value.getFullYear(), value.getMonth(), newDate);
		}
		this.setValue(newValue);
	},
	selectDate: function(inSender, inEvent) {
		if (inEvent.originator.owner.kind == "moon.CalendarPickerDate") {
			var newValue = inEvent.originator.owner.value;
			this.setValue(newValue);
		}		
		return true;
	},
	/**
		Returns number of days in a particular month/year.
	*/
	monthLength: function(inYear, inMonth) {
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	/**
		Updates calendar when value of DatePicker changes.
	*/
	updateSimplePicker: function(inSender, inEvent) {
		//* Avoid onChange events coming from itself
		if (inEvent && inEvent.originator == this || inEvent.originator.kind == "Selection") {
			return;
		}
		var value = this.value,
			month = this.$.simplePicker.getSelectedIndex();
		//* Determine whether calender need to redraw or not
		if (month != this.value.getMonth()) {
			this.setValue(new Date(value.getFullYear(), month, value.getDate()));
		} else {
			this.value.setYear(value.getFullYear());
			this.value.setMonth(month);
			this.value.setDate(value.getDate());
		}
		return true;
	},
	valueChanged: function(inOld) {
		if (this.$.simplePicker.getSelectedIndex() != this.value.getMonth()) {
			this.$.simplePicker.setSelectedIndex(this.value.getMonth());
		}
		this.updateDates();
		if (this.value) {
			this.doChange({value: this.value});
		}
	},	
	localeChanged: function() {
		this.refresh();
	},
	refresh: function(){
		this.destroyClientControls();
		this.initDefaults();
		this.render();
	}
});