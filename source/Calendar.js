enyo.kind({
	name: "moon.Week",
	classes: "moon-calendar-week",
	published: {
		days: [],
	},
	components: [
		{name:"repeater", kind:"enyo.FlyweightRepeater", onSetupItem: "setupItem", count: 7, components: [
			{name: "item", kind: "enyo.Button", classes: "moon-calendar-date"}
		]},
	],
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.item.setContent(this.days[index]);
	},

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
		onChange: "updateCalendar" //*onChange events coming from consituent controls (hour)
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
		value: new Date(),
		days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
		dateArray: []
	},
	components: [
		{name:"day", kind: "moon.Week", days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},
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
		this.setupCalendar(this._tf ? this._tf.getTimeFieldOrder() : 'hma');
		this.valueChanged();
	},
	/**
		set first week of this month.
		before first day of this month, some days from previous month will fill calendar
	*/
	setupFirstWeek: function() {
		var dt = new Date();
		dt.setDate(0);
		var daysOfPrevMonth = dt.getDate(),
			dayOfLastDate = dt.getDay();
		var firstDateOfWeek = daysOfPrevMonth - dayOfLastDate;
		if (dayOfLastDate != 0) {
			//var dateArray = [];
			for (var i = firstDateOfWeek; i <= daysOfPrevMonth; i++) {
				this.dateArray.push(i);
			}
			for (i = 1; i < 7 - dayOfLastDate; i++) {
				this.dateArray.push(i);	
			}
/*			this.createComponent(
				{kind: "moon.Week", days: dateArray}
			)
*/		}
	},
	/**
		set last week of this month.
		after last day of this month, some days from next month will fill calendar
	*/
	setupLastWeek: function(monthLength) {
		var dayForLastWeek = (monthLength - this.value.getDate()) % 7;
		for (var i = 1; i < 7 - dayForLastWeek; i++) {
			this.dateArray.push(i);
		}		
	},
	setupCalendar: function(ordering) {
		this.setupFirstWeek();

		var	monthLength = this.monthLength(this.value.getFullYear(), this.value.getMonth());
		for (var i = this.value.getDate(); i <= monthLength; i++) {
			this.dateArray.push(i);
		}

		this.setupLastWeek(monthLength);
//		this.fillDate();
	},
	parseDate: function(ordering) {
	},
	updateCalendar: function(inSender, inEvent) {
		//* Avoid onChange events coming from itself
		if (inEvent && inEvent.originator == this) {
			return;
		}
		var days = this.value.getDate();
		this.$.repeater.setCount(days);
		    
		this.setValue(new Date(this.value.getFullYear(),
							this.value.getMonth(),
							this.value.getDate()));
		return true;
	},
	monthLength: function(inYear, inMonth) {
		// determine number of days in a particular month/year
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	valueChanged: function(inOld) {

	},
	//* If no selected item, use _this.noneText_ for current value
	noneTextChanged: function() {
		if(this.value == null) {
			this.$.currentValue.setContent(this.getNoneText());
		} else { 
			this.$.currentValue.setContent(this.parseDate(this._tf ? this._tf.getTimeFieldOrder() : 'hma'));
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