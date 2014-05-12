/**
	_moon.DatePicker_ is a control that can be used to display--or allow the
	selection of--a day, month, and year.

		{
			kind: "moon.DatePicker",
			noneText: "Pick a Date",
			content: "Date",
			onChange: "changed"
		}

	Set the _value_ property to a standard JavaScript Date object to initialize
	the picker, or to change it programmatically at runtime.
*/
enyo.kind({
	name: "moon.DatePicker",
	kind: "moon.DateTimePickerBase",
	//* @public
	published: {
		/**
			Optional minimum year value. Must be specified using the Gregorian
			calendar, regardless of the calendar type used by the specified locale.
		*/
		minYear: 1900,
		/*
			Optional maximum year value. Must be specified using the Gregorian
			calendar, regardless of the calendar type used by the specified locale.
		*/
		maxYear: 2099,
		//* Optional label for day
		dayText: moon.$L("day"),		// i18n "DAY" label in moon.DatePicker widget
		//* Optional label for month
		monthText: moon.$L("month"),	// i18n "MONTH" label in moon.DatePicker widget
		//* Optional label for year
		yearText: moon.$L("year")		// i18n "YEAR" label in moon.DatePicker widget
	},
	//*@protected
	iLibFormatType: "date",
	defaultOrdering: "Mdy",
	yearOffset: 0,
	initILib: function() {
		this.inherited(arguments);
		var time = this.value.getTime();
		var gregYear = new ilib.Date.newInstance({type: "gregorian", unixtime: time, timezone:"UTC"}).getYears();
		var localeYear = new ilib.Date.newInstance({type: this._tf.getCalendar(), unixtime: time, timezone:"UTC"}).getYears();
		this.yearOffset = gregYear - localeYear;
	},
	setupPickers: function(ordering) {
		var orderingArr = ordering.split("");
		var doneArr = [];
		var o, f, l, digits;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			if (doneArr.indexOf(o) < 0) {
				doneArr.push(o);
			}
		}

		for(f = 0, l = doneArr.length; f < l; f++) {
			o = doneArr[f];

			switch (o) {
			case 'd':
				digits = (ordering.indexOf("dd") > -1) ? 2 : null;
				this.createComponent(
					{classes: "moon-date-picker-wrap", components:[
						{kind:"moon.IntegerPicker", name:"day", classes:"moon-date-picker-field", wrap:true, digits:digits, min:1,
						max:this.monthLength(this.value.getFullYear(), this.value.getMonth()), value:this.value.getDate()},
						{name: "dayLabel", content: this.dayText, classes: "moon-date-picker-label moon-divider-text"}
					]});
				break;
			case 'M':
				digits = (ordering.indexOf("MM") > -1) ? 2 : null;
				this.createComponent(
					{classes: "moon-date-picker-wrap", components:[
						{kind:"moon.IntegerPicker", name:"month", classes:"moon-date-picker-field", wrap:true, min:1, max:12, value:this.value.getMonth()+1},
						{name: "monthLabel", content: this.monthText, classes: "moon-date-picker-label moon-divider-text"}
					]});
				break;
			case 'y':
				this.createComponent(
					{classes: "moon-date-picker-wrap year", components:[
						{kind:"moon.IntegerPicker", name:"year", classes:"moon-date-picker-field year", value:this.value.getFullYear()-this.yearOffset, min:this.minYear-this.yearOffset, max:this.maxYear-this.yearOffset},
						{name: "yearLabel", content: this.yearText, classes: "moon-date-picker-label moon-divider-text"}
					]});
				break;
			default:
				break;
			}
		}
		this.inherited(arguments);
	},
	formatValue: function() {
		if (this._tf) {
			switch (this._tf.getCalendar()) {
			case "gregorian":
				return this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
			case "thaisolar":
				return this._tf.format(new ilib.Date.ThaiSolarDate({unixtime: this.value.getTime(), timezone:"UTC"}));
			}
		} else {
			return this.getMonthName()[this.value.getMonth()] + " " + this.value.getDate() + ", " + this.value.getFullYear();
		}
	},
	updateValue: function(inSender, inEvent) {
		var day = this.$.day.getValue(),
			month = this.$.month.getValue()-1,
			year = this.$.year.getValue() + this.yearOffset;

		var maxDays = this.monthLength(year, month);
		this.setValue(new Date(year, month, (day <= maxDays) ? day : maxDays, 
			this.value.getHours(),
			this.value.getMinutes(),
			this.value.getSeconds(),
			this.value.getMilliseconds()));
	},
	getPickerDate: function() {
		var minDate = new Date(this.minYear, 0, 1);
		var maxDate = new Date(this.maxYear, 11, 31);
		var presentDate = new Date();
		if((minDate > presentDate) || (maxDate < presentDate)) {
			return minDate;
		}
		return presentDate;
	},
	setChildPickers: function(inOld) {
		var updateDays = inOld &&
			(inOld.getFullYear() != this.value.getFullYear() ||
			inOld.getMonth() != this.value.getMonth());
		this.$.year.setValue(this.value.getFullYear() - this.yearOffset);
		this.$.month.setValue(this.value.getMonth()+1);

		if (updateDays) {
			this.$.day.setMax(this.monthLength(this.value.getFullYear(), this.value.getMonth()));
			this.$.day.updateScrollBounds();
		}
		this.$.day.setValue(this.value.getDate());
		if (updateDays) {
			this.$.day.updateOverlays();
		}

		this.$.currentValue.setContent(this.formatValue());
	},
	getMonthName: function() {
		// Only used when ilib is not loaded
		return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	},
	//* Returns number of days in a particular month/year.
	monthLength: function(inYear, inMonth) {
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	yearTextChanged: function (inOldvalue, inNewValue) {
		this.$.yearLabel.setContent(inNewValue);
	},
	monthTextChanged: function (inOldvalue, inNewValue) {
		this.$.monthLabel.setContent(inNewValue);
	},
	dayTextChanged: function (inOldvalue, inNewValue) {
		this.$.dayLabel.setContent(inNewValue);
	}
});
