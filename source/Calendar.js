enyo.kind({
	name: "moon.MeridiemPicker",
	kind: "moon.IntegerPicker",
	min: 0,
	max: 1,
	value: 0,
	published: {
		meridiems: ["AM","PM"]		
	},
	rangeChanged: function() {
		this.$.client.destroyClientControls();	
		for (var i = this.min; i <= this.max; i++) {
			this.createComponent({
				components:[
					{content:this.meridiems[i]}
				]}).render();
		}
		this.value = new Date().getHours() > 12 ? 1 : 0;
		this.setSelectedIndex(this.value);
		this.reflow();
	},
	valueChanged: function(inOld) {
		//if hour is changed, adjust meridiem
		this.setSelectedIndex(this.value);
	},
	selectedChanged: function(inOld) {
		this.inherited(arguments);
		this.value = this.selected.content;
	}
});

enyo.kind({
	name: "moon.HourPicker",
	kind: "moon.IntegerPicker",
	min: 1,
	max: 24,
	value: new Date().getHours() - 1,
	rangeChanged: function() {
		this.$.client.destroyClientControls();	
		for (var i = k = this.min; i <= this.max; i++, k++) {
			this.createComponent({content:k.toString()});
			if(i == 12) {	//current hour reached meridiem(noon) 
				k = this.min - 1;
			}
		}
		this.setSelectedIndex(this.value);
		this.reflow();
	},
	valueChanged: function(inOld) {
		//if hour is changed, adjust meridiem
		this.setSelectedIndex(this.getSelectedIndex());
	},

});
		
enyo.kind({
	name: "moon.Calendar",
	classes: "moon-date-picker",
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
		value: null,
	},
	components: [
		{name:"repeater", kind:"enyo.FlyweightRepeater", ondragstart: "dragstart", onSetupItem: "setupItem", count: 30, components: [
			{name: "item", kind: "enyo.Button", classes:"moon-calendar-item"}
		]},
		{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-date-picker-current-value", ontap: "expandContract", content: ""}
	],
	create: function() {
		this.inherited(arguments);
		if (enyo.g11n) {
			this.locale = enyo.g11n.currentLocale().getLocale();
		}
		this.initDefaults();
		this.noneTextChanged();
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
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.item.setContent(index);
	},
	setupCalendar: function(ordering) {
	
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
	valueChanged: function(inOld) {
		//if it's the same date (month,day,year), get out of here
		// if (inOld && inOld.getDate() == this.value.getDate() &&
		// 	inOld.getMonth() == this.value.getMonth() &&
		// 	inOld.getFullYear() == this.value.getFullYear()) {
		// 	return;
		// }
		var hour = this.value.getHours();
		this.$.currentValue.setContent(this.parseDate(this._tf ? this._tf.getTimeFieldOrder() : 'hma'));
		this.doChange({name:this.name, value:this.value});		
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