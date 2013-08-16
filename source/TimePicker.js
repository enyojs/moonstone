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

enyo.kind({
	name: "moon.HourPicker",
	kind: "moon.IntegerScrollPicker",
	classes:"moon-date-picker-month",
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
	kind: "moon.ExpandableListItem",
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
		//* Text to be displayed in the _currentValue_ control if no item is
		//* currently selected
		noneText: "",
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
		{name: "header", kind: "moon.Item", classes: "moon-date-picker-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", classes: "enyo-tool-decorator moon-date-picker-client", onSpotlightLeft:"closePicker", onSpotlightSelect: "closePicker"}
		]},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-date-picker-current-value", ontap: "expandContract", content: ""}
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
		this.noneTextChanged();
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
		this.pickersAreSetUp = true;
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

		this.$.currentValue.setContent(this.parseTime());
		this.doChange({name:this.name, value:this.value});
	},
	//* If no item is selected, uses _this.noneText_ as current value.
	noneTextChanged: function() {
		if(this.value == null) {
			this.$.currentValue.setContent(this.getNoneText());
		} else {
			this.$.currentValue.setContent(this.parseTime());
		}
	},
	//* When _this.open_ changes, shows or hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		var open = this.$.drawer.get("open");
		this.$.currentValue.setShowing(!open);
		if (this.pickersAreSetUp) {
			//Force the pickers to update their scroll positions (they don't update while the drawer is closed)
			if (open) {
				this.$.hour.refreshScrollState();
				this.$.minute.refreshScrollState();
				if (this.$.meridiem) {
					this.$.meridiem.refreshScrollState();
				}
			} else {
				// If one of the pickers is animating when the drawer closes, it won't display properly
				// when the drawer reopens, unless we stabilize here
				this.$.hour.stabilize();
				this.$.minute.stabilize();
				if (this.$.meridiem) {
					this.$.meridiem.stabilize();
				}
			}
		}
	},
	closePicker: function(inSender, inEvent) {
		//* If select/enter is pressed on any date picker item or the left key is pressed on the first item, close the drawer
		if (inEvent.type == "onSpotlightSelect" ||
			this.$.client.children[0].id == inEvent.originator.id) {
			this.updateTime();
			this.expandContract();
			this.noneTextChanged();
			return true;
		}
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
