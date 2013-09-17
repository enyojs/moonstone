/**
	_moon.MeridiemPicker is a helper kind used by _moon.TimePicker_.
*/
enyo.kind({
	name: "moon.MeridiemPicker",
	kind: "moon.IntegerScrollPicker",
	classes:"moon-date-picker-month",
	min: 0,
	max: 1,
	value: null,
	published: {
		meridiems: ["AM","PM"]
	},
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.item.setContent(this.meridiems[index]);
	}
});

/**
	_moon.HourPicker is a helper kind used by _moon.TimePicker_.
*/
enyo.kind({
	name: "moon.HourPicker",
	kind: "moon.IntegerScrollPicker",
	classes:"moon-date-picker-field",
	min: 1,
	max: 24,
	value: null,
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		if(index > 11) {	//current hour reached meridiem(noon)
			index -= 12;
		}
		this.$.item.setContent(index + this.min);
	}
});

/**
	_moon.TimePicker_ is a control that can display--or allow the selection of--a
	time expressed in hours and minutes, with an optional meridiem indicator
	("am" or "pm").

		{kind: "moon.TimePicker", content: "Time", meridiemEnable: true, onChange: "changed"}

	Set the _value_ property to a standard JavaScript Date object to initialize
	the picker, or to change it programmatically at runtime.
*/
enyo.kind({
	name: "moon.TimePicker",
	kind: "moon.DateTimePickerBase",
	published: {
		/**
			When true, the picker uses a 12-hour clock. (This value is ignored when
			_ilib_ is loaded, since the meridiem will be set by the current locale.)
		*/
		meridiemEnable: false,
		//* Optional label for hour
		hourText: "hour",
		//* Optional label for minute
		minuteText: "minute",
		//* Optional label for meridian
		meridianText: "meridian"
	},
	//*@protected
	iLibFormatType: "time",
	defaultOrdering: "hma",
	initILib: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.meridiemEnable = this._tf.getTemplate().indexOf("a") >= 0;
		};
	}),
	setupPickers: enyo.inherit(function(sup) {
		return function(ordering) {
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

				switch (o){
				case 'h': {
						if (this.meridiemEnable === true) {
							this.createComponent(
								{classes: "moon-date-picker-wrap", components:[
									{kind: "moon.HourPicker", name:"hour", min:1, max:24, value: (this.value.getHours() || 24)},
									{name: "hourLabel", content: this.hourText || "hour", classes: "moon-date-picker-label moon-divider-text"}
								]}
							);
						} else {
							this.createComponent(
								{classes: "moon-date-picker-wrap", components:[
									{kind: "moon.IntegerScrollPicker", name:"hour", classes:"moon-date-picker-field", min:0, max:23, value: this.value.getHours()},
									{name: "hourLabel", content: this.hourText || "hour", classes: "moon-date-picker-label moon-divider-text"}
								]}
							);
						}
					}
					break;
				case 'm': {
						this.createComponent(
							{classes: "moon-date-picker-wrap", components:[
								{kind: "moon.IntegerScrollPicker", name:"minute", classes:"moon-date-picker-field", min:0,max:59, digits: 2, value: this.value.getMinutes()},
								{name: "minuteLabel", content: this.minuteText || "min", classes: "moon-date-picker-label moon-divider-text"}
							]}
						);
					}
					break;
				case 'a': {
						if (this.meridiemEnable === true) {
							this.createComponent(
								{classes: "moon-date-picker-wrap", components:[
									{kind:"moon.MeridiemPicker", name:"meridiem", classes:"moon-date-picker-field", value: this.value.getHours() > 12 ? 1 : 0 },
									{name: "meridianLabel", content: this.meridianText || "meridian", classes: "moon-date-picker-label moon-divider-text"}
								]}
							);
						}
					}
					break;
				default:
					break;
				}
			}

			sup.apply(this, arguments);
		};
	}),
	formatValue: function() {
		var dateStr = "";
		if (this._tf) {
			dateStr = this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
		}
		else {
			if (this.meridiemEnable === true && this.value.getHours() > 12) {
				dateStr += this.value.getHours() - 12;
			} else {
				dateStr += this.value.getHours();
			}
			dateStr += ":" + ("00" + this.value.getMinutes()).slice(-2) + " ";
			dateStr += this.meridiemEnable ? this.$.meridiem.getMeridiems()[this.$.meridiem.getValue()] : "";
		}
		return dateStr;
	},
	updateValue: function(inSender, inEvent) {
		var hour = this.$.hour.getValue();
		var minute = this.$.minute.getValue();

		if (inEvent.originator.kind == "moon.MeridiemPicker") {
			if (hour < 12 && inEvent.originator.value == 1 ) {
				hour += 12;
			} else if ( hour > 12 && hour != 24 && inEvent.originator.value === 0) {
				hour -= 12;
			} else if (hour == 24 && inEvent.originator.value === 1) {
				hour -= 12;
			} else if (hour == 12 && inEvent.originator.value === 0) {
				hour += 12;
			}
			this.$.hour.setScrollTop(inEvent.originator.scrollBounds.clientHeight * (hour-1));
			this.$.hour.setValue(hour);
		}

		this.setValue(new Date(this.value.getFullYear(),
							this.value.getMonth(),
							this.value.getDate(),
							hour, minute,
							this.value.getSeconds(),
							this.value.getMilliseconds()));
	},
	setChildPickers: function(inOld) {
		var hour = this.value.getHours();
		if (this.meridiemEnable === true) {
			this.$.meridiem.setValue(hour > 11 ? 1 : 0);
		}
		if (!hour) {
			hour = 24;
		}
		this.$.hour.setValue(hour);
		this.$.minute.setValue(this.value.getMinutes());

		this.$.currentValue.setContent(this.formatValue());
		this.doChange({name:this.name, value:this.value});
	},
	hourTextChanged: function (inOldvalue, inNewValue) {
		this.$.hourLabel.setContent(inNewValue);
	},
	minuteTextChanged: function (inOldvalue, inNewValue) {
		this.$.minuteLabel.setContent(inNewValue);
	},
	meridianTextChanged: function (inOldvalue, inNewValue) {
		this.$.meridianLabel.setContent(inNewValue);
	}
});
