enyo.kind({
	name: "moon.CalendarDate",
	kind: "moon.Button",
	classes: "moon-calendar-date",
	events: {
		ontap: ""
	},
	published: {
		value: null,
		color: 0,
	},
	create: function() {
		this.inherited(arguments);
	},
	colorChanged: function(inOld) {
		if (this.color) {
			this.addClass("moon-calendar-date-shadow");
		} else {
			this.removeClass("moon-calendar-date-shadow");
		}
	},
	valueChanged: function() {
		this.setContent(this.value.getDate());
	},
});

enyo.kind({
	name: "moon.CalendarWeek",
	published: {
		days: [],
		colors: [],
	},
	handlers: {
		ontap: "doTap"
	},
	components: [
		{name:"repeater", kind: "enyo.FlyweightRepeater", clientClasses: "moon-calendar-week", onSetupItem: "setupItem", count: 7, components: [
			{name: "item", kind: "moon.CalendarDate"}
		]},
	],
	/**	
		Usually when we select same item, setupItem() is not called
		because setupItem() is called when changing selection is occured in repeater.
	*/
	doTap: function(inSender, inEvent) {
		if (this.$.repeater.isSelected(inEvent.index)) {
			this.setupItem(inSender, inEvent);
		}
	},
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		var value = this.days[index],
			color = this.colors[index];
		this.$.item.setValue(new Date(value.getFullYear(), value.getMonth(), value.getDate()));
		this.$.item.setColor(color);
	},
	fillDate: function(days, colors) {
		this.days = days;
		this.colors = colors;
		this.$.repeater.setCount(7);
	}
});

enyo.kind({
	name: "moon.Calendar",
	classes: "moon-calendar",
	events: {
		/**
			Fires when the date changes.

			_inEvent.name_ contains the name of this control.
			_inEvent.value_ contains the current Date object (standard JS Date object).
		*/
		onChange: ""
	},
	handlers: {
		ontap: "doTap", //*onChange events coming from consituent controls (hour)
		onChange: "updateCalendar"
	},
	published: {
		//* Text to be displayed in the _currentValue_ control if no item is currently selected.
		noneText: "",
		/**
			Current locale used for formatting. Can be set after control
			creation, in which case the control will be updated to reflect the
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
			If this value over 9, it may show dates of 2 month later.
			(it is unexpected input, makes err)
		*/
		maxWeeks: 6,
		months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
		//days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
		dateArray: [],
		colorArray: []
	},
	components: [
		{name: "simplePicker", kind: "moon.SimplePicker", classes: "moon-calendar-month"},
		/*{kind: 'enyo.Spotlight'},
		{name:"repeater", kind: "enyo.FlyweightRepeater", clientClasses: "moon-calendar-week", onSetupItem: "setupDays", count: 7, components: [
			{name: "day", classes: "moon-calendar-date"}
		]},*/
		{name: "dates"}
	],
	create: function() {
		this.inherited(arguments);
		if (enyo.g11n) {
			this.locale = enyo.g11n.currentLocale().getLocale();
		}
		this.initDefaults();
	//	this.noneTextChanged();
	},
	initDefaults: function() {
		//Attempt to use the g11n lib (ie assume it is loaded)
		if (enyo.g11n) {
			this._tf = new enyo.g11n.Fmts({locale:this.locale});
		}

		this.value = this.value || new Date();
		this.setupSimplePicker();
		this.$.simplePicker.setSelectedIndex(this.value.getMonth());
		this.setupLayout();
//		this.setupCalendar(this._tf ? this._tf.getTimeFieldOrder() : 'hma');
		this.valueChanged();
	},
	/**
		Set days from the first day to the last day.
		Initially, SUN is the first day and SAT is the last day.
	*/
/*	setupDays: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.day.setContent(this.days[index]);
	},	*/
	/**
		Set simplePicker with months
		The contents will be filled with from JAN to DEC
	*/
	setupSimplePicker: function() {
		var months = this.months;
		this.$.simplePicker.$.client.addClass("content");
		for (var i = 0; i < 12; i++) {
			this.$.simplePicker.createComponent(
				{content: months[i]}
			)
		}
	},
	/**
		Set a layout of calendar.
		The content of it is not prepared at this time.
	*/
	setupLayout: function() {
		for (var i = 0; i < this.maxWeeks; i++) {
			var days = [];
			this.$.dates.createComponent(
				{kind: "moon.CalendarWeek", days: days}
			)
		}
	},
	/**
		Set the first week of this month.
		Before the first day of this month, some days from previous month will fill calendar
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
		if (dayOfLastDate != 0) {
			//var dateArray = [];
			for (var i = firstDateOfWeek; i <= daysOfPrevMonth; i++) {
				this.dateArray.push(new Date(thisYear, prevMonth, i));
				this.colorArray.push(1);
			}
		}
	},
	/**
		Set the last week of this month.
		After the last day of this month, some days from next month will fill calendar
	*/
	setupNextMonth: function(monthLength) {
		var value = this.value;
		var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
		dt.setMonth(dt.getMonth() + 1);

		var thisYear = dt.getFullYear(),
			nextMonth = dt.getMonth(),
			thisDate = dt.getDate();
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
	parseDate: function(ordering) {
	},
	/**
		When value of DatePicker is changed, it will update Calendar
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
	monthLength: function(inYear, inMonth) {
		// determine number of days in a particular month/year
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	/**
		Change value of simplePicker with selected CalendarDate.
	*/
	doTap: function(inSender, inEvent) {
		if (inEvent.originator.kind == "moon.CalendarDate") {
			var newValue = inEvent.originator.value,
				oldValue = this.getValue();
			
			if (newValue.getFullYear() > oldValue.getFullYear()) {
				this.$.simplePicker.setSelectedIndex(0);
			} else if (newValue.getFullYear() < oldValue.getFullYear()) {
				this.$.simplePicker.setSelectedIndex(11);
			} else if (newValue.getMonth() > oldValue.getMonth()) {
				this.$.simplePicker.next();
			} else if (newValue.getMonth() < oldValue.getMonth()) {
				this.$.simplePicker.previous();
			}								
		} 
		return true;
	},
	valueChanged: function(inOld) {
		this.setupCalendar();
		this.fillDate();
		this.$.dates.render();
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