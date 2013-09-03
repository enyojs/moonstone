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
	classes:"moon-date-picker-month",
	min: 1,
	max: 24,
	value: null,
	tf: null,
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		if(index > 11) {	//current hour reached meridiem(noon)
			index -= 12;
		}
		this.$.item.setContent(index + this.getHourRange().min);
	},
	getValue: function () {
		// Note that in a 24-hour clock, it should return the value 0 for hour labeled "24"
		return (!this.isMeridianEnable() && this.value === 24) ? 0 : this.value;
	},
	//*@protected
	/**
		Hours values returned from the picker should go from 0 to 23, but the labels on the picker items should go either from 0 to 23 or 1 to 24, depending on the locale. 
		Locales that use the hours format as "k" or "kk" should have labels that go from 1 to 24, and locales that use "H" or "HH" should go from 0 to 23. 
		Similarly, when the locale uses the format "h" or "hh", the hours go from 1 to 12, and when it uses "K" or "KK", it goes from 0 to 11. 
		The max and min should be set accordingly.
	*/
	getHourRange: function () {
		if (!this.tf) {
			return {
				min : 1,
				max : 24
			};
		} else {
			if (this.isMeridianEnable()) {
				return {
					min : (this.tf.getTimeComponents().indexOf("K") > -1) ? 0 : 1,
					max : (this.tf.getTimeComponents().indexOf("K") > -1) ? 11 : 12
				};
			} else {
				return {
					min : (this.tf.getTimeComponents().indexOf("H") > -1) ? 0 : 1,
					max : (this.tf.getTimeComponents().indexOf("H") > -1) ? 23 : 24
				};
			}
		}
	},
	isMeridianEnable: function () {
		return this.tf && this.tf.getClock() === "12";
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
	initILib: function() {
		this.inherited(arguments);
		this.meridiemEnable = this.isMeridianEnable();
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
			case 'h': 
				this.createComponent(
					{kind:"enyo.Control", name: "hourWrapper", classes: "moon-date-picker-wrap", components:[
						{kind:"moon.HourPicker", name:"hour", value: (this.value.getHours() || 24), tf: this._tf}
					]}
				);
				break;
			case 'm':
				this.createComponent(
					{kind:"enyo.Control", name: "minuteWrapper", classes: "moon-date-picker-wrap", components:[
						{kind:"moon.IntegerScrollPicker", name:"minute", classes:"moon-date-picker-month", min:0,max:59, digits: 2, value: this.value.getMinutes()}
					]}
				);			
				break;
			case 'a':
				if (this.meridiemEnable === true) {
					this.createComponent(
						{kind:"enyo.Control", name: "meridianWrapper", classes: "moon-date-picker-wrap", components:[
							{kind:"moon.MeridiemPicker", name:"meridiem", classes:"moon-date-picker-year", value: this.value.getHours() > 12 ? 1 : 0 }
						]}
					);
				}
				break;
			default:
				break;
			}
		}

		this.$.hourWrapper.createComponent({ kind:"enyo.Control", name: "hourLabel", content : this.hourText ? this.hourText : "hour", classes: "moon-date-picker-label"}, {owner: this});
		this.$.minuteWrapper.createComponent({ kind:"enyo.Control", name: "minuteLabel", content : this.minuteText ? this.minuteText : "min", style: "display:block;", classes: "moon-date-picker-label"}, {owner: this});
		
		if (this.isMeridianEnable()) {
			this.$.meridianWrapper.createComponent({ kind:"enyo.Control", name: "meridianLabel", content : this.meridianText ? this.meridianText : "meridian", style: "display:block;", classes: "moon-date-picker-label"}, {owner: this});
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
			hour = 24;
		}
		this.$.hour.setValue(hour);
		this.$.minute.setValue(this.value.getMinutes());

		this.$.currentValue.setContent(this.formatValue());
		this.doChange({name:this.name, value:this.value});
	},
	//*@protected
	isMeridianEnable: function () {
		return this._tf && this._tf.getClock() === "12";
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
