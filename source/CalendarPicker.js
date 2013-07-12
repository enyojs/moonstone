/**
	_moon.CalendarPicker_ is a control that displays a monthly calendar, with the
	month name at the top and a grid of days, grouped into rows by week, below.
	
	The header buttons are used to navigate to the desired month; the desired day
	is selected by tapping on it.

	{kind: "moon.CalendarPicker", content: "Calendar Title"}
*/
enyo.kind({
	name: "moon.CalendarPickerDate",
	kind: "enyo.Button",
	classes: "moon-calendar-picker-date enyo-unselectable",
	spotlight: true,
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
	name: "moon.CalendarPickerWeek",
	classes: "moon-calendar-picker-week",
	days: [],
	colors: [],
	create: function() {
		this.inherited(arguments);
		this.setupLayout();
	},
	setupLayout: function() {
		for (var i = 0; i < 7; i++) {
			this.createComponent({kind: "moon.CalendarPickerDate"});
		}
	},
	fillDate: function(days, colors) {
		this.days = days;
		this.colors = colors;

		for (var i = 0; i < this.days.length; i++) {
			var value = this.days[i],
				color = this.colors[i];
			this.controls[i].setValue(new Date(value.getFullYear(), value.getMonth(), value.getDate()));
			this.controls[i].setColor(color);
		}
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
		onChange: "updateCalendar"
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
		months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
		dateArray: [],
		colorArray: []
	},
	components: [
		{name: "simplePicker", kind: "moon.SimplePicker", classes: "moon-calendar-picker-simplepicker"},
		{name: "dates", kind: "enyo.Group", classes: "moon-calendar-picker-dates"}
	],
	create: function() {
		this.inherited(arguments);
		if (enyo.g11n) {
			this.locale = enyo.g11n.currentLocale().getLocale();
		}
		this.initDefaults();
	},
	initDefaults: function() {
		//Attempt to use the g11n lib (assuming that it is loaded)
		if (enyo.g11n) {
			this._tf = new enyo.g11n.Fmts({locale:this.locale});
		}

		this.value = this.value || new Date();
		this.setupSimplePicker();
		this.$.simplePicker.setSelectedIndex(this.value.getMonth());
		this.setupLayout();
		this.valueChanged();
	},
	/**
		Populates SimplePicker with months of the year, from JAN to DEC.
	*/
	setupSimplePicker: function() {
		var months = this.months;
		this.$.simplePicker.addClass("moon-calendar-picker-button");
		for (var i = 0; i < 12; i++) {
			this.$.simplePicker.createComponent(
				{content: months[i], classes: "picker-content"}
			);
		}
	},
	/**
		Sets up the layout for a calendar.
		The content of the calendar is not prepared at this time.
	*/
	setupLayout: function() {
		for (var i = 0; i < this.maxWeeks; i++) {
			var days = [];
			this.$.dates.createComponent(
				{kind: "moon.CalendarPickerWeek", days: days}
			);
		}
	},
	/**
		Sets up the first week of this month.
		Before the first day of this month, days from the previous month will be
		used to fill the calendar.
	*/
	setupPrevMonth: function() {
		var value = this.value;
		var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		dt.setDate(0);
		var thisYear = dt.getFullYear(),
			daysOfPrevMonth = dt.getDate(),
			dayOfLastDate = dt.getDay(),
			prevMonth = dt.getMonth();
		var firstDateOfWeek = daysOfPrevMonth - dayOfLastDate;
		if (dayOfLastDate !== 0) {
			for (var i = firstDateOfWeek; i <= daysOfPrevMonth; i++) {
				this.dateArray.push(new Date(thisYear, prevMonth, i));
				this.colorArray.push(1);
			}
		}
	},
	/**
		Sets up the last week of this month.
		After the last day of this month, days from the next month will be used to
		fill the calendar.
	*/
	setupNextMonth: function(monthLength) {
		var value = this.value;
		var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		dt.setMonth(dt.getMonth() + 1);

		var thisYear = dt.getFullYear(),
			nextMonth = dt.getMonth();
		var offset = this.maxWeeks * 7 - this.dateArray.length + 1;
		for (var i = 1; i < offset; i++) {
			this.dateArray.push(new Date(thisYear, nextMonth, i));
			this.colorArray.push(1);
		}
	},
	setupCalendar: function(ordering) {
		//* Make empty
		this.dateArray = [];
		this.colorArray = [];

		this.setupPrevMonth();

		var thisYear = this.value.getFullYear(),
			thisMonth = this.value.getMonth();
		var	monthLength = this.monthLength(thisYear, thisMonth);
		for (var i = 1; i <= monthLength; i++) {
			this.dateArray.push(new Date(thisYear, thisMonth, i));
			this.colorArray.push(0);
		}

		this.setupNextMonth(monthLength);
	},
	fillDate: function() {
		var calendarWeeks =this.$.dates.getControls();
		for (var i = 0; i < this.dateArray.length / 7; i++) {
			var days = [],
				colors = [];
			for (var j = 0; j < 7; j++) {
				days.push(this.dateArray[i * 7 + j]);
				colors.push(this.colorArray[i * 7 + j]);
			}
			calendarWeeks[i].fillDate(days, colors);
		}
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
			newMonthLength = this.monthLength(value.getFullYear(), newMonth);
		if(newMonthLength < value.getDate()) {
			newValue = new Date(value.getFullYear(), newMonth, newMonthLength);
		} else {
			newValue = new Date(value.getFullYear(), newMonth, value.getDate());
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
		if (inEvent.originator.kind == "moon.CalendarPickerDate") {
			var newValue = inEvent.originator.value;
			this.setValue(newValue);
		}		
		return true;
	},
	// Returns number of days in a particular month/year.
	monthLength: function(inYear, inMonth) {
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	/**
		Updates calendar when value of DatePicker changes.
	*/
	updateCalendar: function(inSender, inEvent) {
		//* Avoid onChange events coming from itself
		if (inEvent && inEvent.originator == this || inEvent.originator.kind == "Selection") {
			return;
		}
		var value = this.value;
		var year = value.getFullYear(),
			month = this.$.simplePicker.getSelectedIndex();
		//* Determine whether calender need to redraw or not
		if (month != this.value.getMonth()) {
			this.setValue(new Date(value.getFullYear(), month, value.getDate()));
		} else {
			this.value.setYear(year);
			this.value.setMonth(month);
			this.value.setDate(value.getDate());
		}
		return true;
	},
	updatePicker: function(value) {
		this.$.simplePicker.setSelectedIndex(value);
	},
	valueChanged: function(inOld) {
		if(inOld) {
			this.updatePicker(this.value.getMonth());
		}
		this.setupCalendar();
		this.fillDate();
		this.$.dates.render();
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