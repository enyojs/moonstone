/**
	_sunTimePicker_ is an <a href="#enyo.TimePicker">enyo.TimePicker</a> that appears at the
	bottom of the screen and takes up the full screen width.
*/
enyo.kind({
	name: "sun.TimePicker",
	classes: "moon-date-picker",
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
		/**
			Handler for _onChange_ events coming from constituent controls (e.g.,
			_hour_)
		*/
		onChange: "updateTime"
	},
	published: {
		/**
			Current locale used for formatting (only valid when _ilib_ is loaded). 
			May be set after control creation, in which case the control will be 
			updated to reflect the new value.
		*/
		locale: "en-US",
		/**
			The current date as a standard JavaScript Date object. When a Date object
			is passed to _set("value")_, the control is updated to reflect the new
			value. _get("value")_ returns a Date object.
		*/
		value: null,
		/**
			When true, the picker uses a 12-hour clock. (This value is ignored when
			_ilib_ is loaded, since the meridiem will be set by the current locale.)
		*/
		meridiemEnable: false
	},
	components: [
		// {kind:"moon.IntegerScrollPicker", name:"minute", classes:"moon-date-picker-month", min:0,max:59, digits: 2, value: 11}
	],
	create: function() {
		this.inherited(arguments);
		if (typeof ilib !== "undefined") {
			this.locale = ilib.getLocale();
		}
		this.initDefaults("local");
	},
	initDefaults: function(tz) {
		//Attempt to use the ilib lib (assuming that it is loaded)
		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({locale:this.locale, type: "time", timezone: tz.id || "local"});
			this.meridiemEnable = this._tf.getTemplate().indexOf("a") >= 0;
		}

		this.value = this.value || new Date();
		this.setupPickers(this._tf ? this._tf.getTemplate() : 'hma');
		//Initial state for meridiemEnable is false
	},
	setupPickers: function(ordering) {
		var orderingArr = ordering.toLowerCase().split("");
		var doneArr = [];
		var o,f,l;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			if (doneArr.indexOf(o) < 0) {
				switch (o){
				case 'h': {
						if (this.meridiemEnable === true) {
							this.createComponent({kind:"moon.HourPicker", name:"hour", min:1, max:24, value: (this.value.getHours() || 24)});
						} else {
							this.createComponent({kind:"moon.IntegerScrollPicker", name:"hour", classes:"moon-date-picker-month", min:0, max:23, value: this.value.getHours()});
						}
					}
					break;
				case 'm': {
						this.createComponent({kind:"moon.IntegerScrollPicker", name:"minute", classes:"moon-date-picker-month", min:0,max:59, digits: 2, value: this.value.getMinutes()});
					}
					break;
				case 'a': {
						if (this.meridiemEnable === true) {
							this.createComponent({kind:"moon.MeridiemPicker", name:"meridiem", classes:"moon-date-picker-year", value: this.value.getHours() > 12 ? 1 : 0 });
						}
					}
					break;
				default:
					break;
				}
			}
			doneArr.push(o);
		}
	},
	parseTime: function() {
		if (this._tf) {
			return this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
		}
		else {
			var dateStr = "";
			if (this.meridiemEnable === true && this.value.getHours() > 12) {
				dateStr += this.value.getHours() - 12;
			} else {
				dateStr += this.value.getHours();
			}
			dateStr += ":" + ("00" + this.value.getMinutes()).slice(-2) + " ";
			dateStr += this.meridiemEnable ? this.$.meridiem.getMeridiems()[this.$.meridiem.getValue()] : "";
			return dateStr;
		}
	},
	updateTime: function(inSender, inEvent) {
		if (inEvent) {
			//* Avoid onChange events coming from itself
			if (inEvent.originator == this) {
				return;
			}
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
		}
		return true;
	},
	valueChanged: function(inOld) {
		var hour = this.value.getHours();
		if (this.meridiemEnable === true) {
			this.$.meridiem.setValue(hour > 11 ? 1 : 0);
		}
		if (!hour) {
			hour = 24;
		}
		this.$.hour.setValue(hour);
		this.$.minute.setValue(this.value.getMinutes());

		// this.$.currentValue.setContent(this.parseTime());
		this.doChange({name:this.name, value:this.value});
	},
	localeChanged: function() {
		this.refresh();
	},
	refresh: function(){
		this.destroyClientControls();
		this.initDefaults(new ilib.TimeZone({locale: this.locale}));
		this.render();
	}
});