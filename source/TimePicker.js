/**
	_moon.MeridiemPicker_ is a helper kind used by
	[moon.TimePicker](#moon.TimePicker).  It is not intended for use in other
	contexts.
*/
enyo.kind({
	name: "moon.MeridiemPicker",
	kind: "moon.IntegerPicker",
	//* @protected
	classes:"moon-date-picker-month",
	min: 0,
	max: 1,
	value: null,
	//* @public
	published: {
		/**
			If _TimePicker.meridiemEnable_ is false, this value has not yet been
			initialized; if true, this value will be _"PM"_ if the _hour_ is greater
			than 11, or _"AM"_ otherwise.
		*/
		meridiems: ["AM","PM"]
	},
	valueChanged: function() {
		this.inherited(arguments);
		this.updateOverlays();
	},
	//* @protected
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.item.setContent(this.meridiems[index]);
	}
});

//*	@public

/**
	_moon.HourPicker_ is a helper kind used by [moon.TimePicker](#moon.TimePicker).
	It is not intended for use in other contexts.
*/
enyo.kind({
	name: "moon.HourPicker",
	kind: "moon.IntegerPicker",
	//* @protected
	classes:"moon-date-picker-field",
	min: 1,
	max: 24,
	zeroToEleven: false,
	value: null,
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index,
			hour;

		if (index > 11) {	//current hour reached meridiem(noon)
			index -= 12;
		}

		hour = index + this.min;

		if (this.zeroToEleven) {
			hour = ('0' + (hour-1)).slice(-2);  // zero padded 0-11 value
		}
		this.$.item.setContent(hour);
	}
});

//* @public

/**
	_moon.TimePicker_ is a control that can display--or allow the selection of--a
	time expressed in hours and minutes, with an optional meridiem indicator
	("am" or "pm").


		{kind: "moon.TimePicker", content: "Time", meridiemEnable: true, onChange: "changed"}

	Set the _value_ property to a standard JavaScript Date object
	to initialize the picker, or to change it programmatically at runtime.
*/
enyo.kind({
	name: "moon.TimePicker",
	kind: "moon.DateTimePickerBase",
	//* @public
	published: {
		/**
			When true, the picker uses a 12-hour clock. (This value is ignored when
			_ilib_ is loaded, since the meridiem will be set by the current locale.)
		*/
		meridiemEnable: false,
		//* Optional label for hour
		hourText: moon.$L("hour"),			// i18n "HOUR" label in moon.TimePicker widget
		//* Optional label for minute
		minuteText: moon.$L("minute"),		// i18n "MINUTE" label in moon.TimePicker widget
		//* Optional label for meridiem
		meridiemText: moon.$L("meridiem")	// i18n "MERIDIAN" label in moon.TimePicker widget
	},
	//* @protected
	iLibFormatType  : "time",
	defaultOrdering : "hma",
	/** Whether hour has 0-11 or 1-12 with meridiem picker.
		Without meridiem picker, 0-23 or 1-24.
		If true, hour has 0-11 (0-23)
	*/
	zeroToEleven    : false,
	/** Decide whether hour has 2 digits or not
		If true, 0 padded to make 2 digits.
	*/
	twoDigits		: false,

	initILib: function() {
		this.inherited(arguments);

		// Set picker format 12 vs 24 hour clock
		var li = new ilib.LocaleInfo(this.locale || undefined);
		var clockPref = li.getClock();
		this.meridiemEnable = (clockPref == '12');

		var fmtParams = {
			type: "time",
			time: "h",
			clock: clockPref !== "locale" ? clockPref : undefined,
			timezone: "local"
		};
		if (this.locale) {
			fmtParams.locale = this.locale;
		}
		var hourFormatter = new ilib.DateFmt(fmtParams);

		// If length is 2, 0 padded to 2 digits. 
		this.twoDigits = (hourFormatter.template.length - 1) ? true : false;
		// 'h', 'hh', 'k', 'kk' means 1-12 or 1-24
		this.zeroToEleven = (hourFormatter.template === hourFormatter.template.toUpperCase());

		// Get localized meridiem values
		if (this.meridiemEnable) {
			fmtParams = {
				template: "a",
				clock: clockPref !== "locale" ? clockPref : undefined,
				timezone: "local"
			};
			if (this.locale) {
				fmtParams.locale = this.locale;
			}
			var merFormatter = new ilib.DateFmt(fmtParams);
			var am = new ilib.Date.GregDate({hour:1});
			var pm = new ilib.Date.GregDate({hour:13});
			this.meridiems = [merFormatter.format(am), merFormatter.format(pm)];
		}
	},
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

			switch (o){
			case 'h': {
					if (this.meridiemEnable === true) {
						this.createComponent(
							{classes: "moon-date-picker-wrap", components:[
								{kind: "moon.HourPicker", name:"hour", zeroToEleven: this.zeroToEleven, min:1, max:24, value: (this.value.getHours() || 24)},
								{name: "hourLabel", content: this.hourText, classes: "moon-date-picker-label moon-divider-text"}
							]}
						);
					} else {
						this.createComponent(
							{classes: "moon-date-picker-wrap", components:[
								{kind: "moon.IntegerPicker", name:"hour", classes:"moon-date-picker-field", min:0, max:23, value: this.value.getHours()},
								{name: "hourLabel", content: this.hourText, classes: "moon-date-picker-label moon-divider-text"}
							]}
						);
					}
				}
				break;
			case 'm': {
					this.createComponent(
						{classes: "moon-date-picker-wrap", components:[
							{kind: "moon.IntegerPicker", name:"minute", classes:"moon-date-picker-field", min:0,max:59, digits: 2, value: this.value.getMinutes()},
							{name: "minuteLabel", content: this.minuteText, classes: "moon-date-picker-label moon-divider-text"}
						]}
					);
				}
				break;
			case 'a': {
					if (this.meridiemEnable === true) {
						this.createComponent(
							{classes: "moon-date-picker-wrap", components:[
								{kind:"moon.MeridiemPicker", name:"meridiem", classes:"moon-date-picker-field", value: this.value.getHours() > 12 ? 1 : 0, meridiems: this.meridiems || ["am","pm"] },
								{name: "meridiemLabel", content: this.meridiemText, classes: "moon-date-picker-label moon-divider-text"}
							]}
						);
					}
				}
				break;
			default:
				break;
			}

		}

		this.inherited(arguments);
	},
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
			hour = (this.meridiemEnable) ? 24 : 0;
		}
		this.$.hour.setValue(hour);
		this.$.minute.setValue(this.value.getMinutes());

		this.$.currentValue.setContent(this.formatValue());
	},
	hourTextChanged: function (inOldvalue, inNewValue) {
		this.$.hourLabel.setContent(inNewValue);
	},
	minuteTextChanged: function (inOldvalue, inNewValue) {
		this.$.minuteLabel.setContent(inNewValue);
	},
	meridiemTextChanged: function (inOldvalue, inNewValue) {
		this.$.meridiemLabel.setContent(inNewValue);
	}
});
