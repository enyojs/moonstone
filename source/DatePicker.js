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
		maxYear: 2099
	},
	//*@protected
	iLibFormatType: "date",
	defaultOrdering: "mdy",
	setupPickers: enyo.inherit(function(sup) {
		return function(ordering) {
			var orderingArr = ordering.toLowerCase().split("");
			var doneArr = [];
			var o,f,l;
			for(f = 0, l = orderingArr.length; f < l; f++) {
				o = orderingArr[f];
				if (doneArr.indexOf(o) < 0) {
					switch (o) {
					case 'd':
						this.createComponent(
							{kind:"moon.IntegerScrollPicker", name:"day", classes:"moon-date-picker-day", min:1,
								max:this.monthLength(this.value.getFullYear(), this.value.getMonth()), value:this.value.getDate()});
						break;
					case 'm':
						this.createComponent({kind:"moon.IntegerScrollPicker", name:"month", classes:"moon-date-picker-month", min:1, max:12, value:this.value.getMonth()+1});
						break;
					case 'y':
						this.createComponent({kind:"moon.IntegerScrollPicker", name:"year", classes:"moon-date-picker-year", value:this.value.getFullYear(), min:this.minYear, max:this.maxYear});
						break;
					default:
						break;
					}
				}
				sup.apply(this, arguments);
			}
		};
	}),
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
		return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	},
	//* Returns number of days in a particular month/year.
	monthLength: function(inYear, inMonth) {
		return 32 - new Date(inYear, inMonth, 32).getDate();
	}
});
