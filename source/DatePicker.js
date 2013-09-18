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
	published: {
		//* Optional minimum year value
		minYear: 1900,
		//* Optional maximum year value		
		maxYear: 2099,
		//* Optional label for day
		dayText: moon.$L("day"),		// i18n "DAY" label in moon.DatePicker widget
		//* Optional label for month
		monthText: moon.$L("month"),	// i18n "MONTH" label in moon.DatePicker widget
		//* Optional label for year
		yearText: moon.$("year")		// i18n "YEAR" label in moon.DatePicker widget
	},
	//*@protected
	iLibFormatType: "date",
	defaultOrdering: "mdy",
	setupPickers: function(ordering) {
		var orderingArr = ordering.toLowerCase().split("");
		var doneArr = [];
		var o,f,l;
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
				this.createComponent(
					{classes: "moon-date-picker-wrap", components:[
						{kind:"moon.IntegerScrollPicker", name:"day", classes:"moon-date-picker-field", min:1,
						max:this.monthLength(this.value.getFullYear(), this.value.getMonth()), value:this.value.getDate()},
						{name: "dayLabel", content: this.dayText, classes: "moon-date-picker-label moon-divider-text"}
					]});
				break;
			case 'm':
				this.createComponent(
					{classes: "moon-date-picker-wrap", components:[
						{kind:"moon.IntegerScrollPicker", name:"month", classes:"moon-date-picker-field", min:1, max:12, value:this.value.getMonth()+1},
						{name: "monthLabel", content: this.monthText, classes: "moon-date-picker-label moon-divider-text"}
					]});
				break;
			case 'y':
				this.createComponent(
					{classes: "moon-date-picker-wrap year", components:[
						{kind:"moon.IntegerScrollPicker", name:"year", classes:"moon-date-picker-field year", value:this.value.getFullYear(), min:this.minYear, max:this.maxYear},
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
			return this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
		} else {
			return this.getMonthName()[this.value.getMonth()] + " " + this.value.getDate() + ", " + this.value.getFullYear();
		}
	},
	updateValue: function(inSender, inEvent) {
		var day = this.$.day.getValue(),
			month = this.$.month.getValue()-1,
			year = this.$.year.getValue();

		var maxDays = this.monthLength(year, month);
		this.setValue(new Date(year, month, (day <= maxDays) ? day : maxDays));
	},
	setChildPickers: function(inOld) {
		this.$.year.setValue(this.value.getFullYear());
		this.$.month.setValue(this.value.getMonth()+1);

		if (inOld &&
			(inOld.getFullYear() != this.value.getFullYear() ||
			inOld.getMonth() != this.value.getMonth())) {
			this.$.day.setMax(this.monthLength(this.value.getFullYear(), this.value.getMonth()));
		}
		this.$.day.setValue(this.value.getDate());

		this.$.currentValue.setContent(this.formatValue());
		if (this.value) {
			this.doChange({name:this.name, value:this.value});
		}
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
