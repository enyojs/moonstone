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
		for (var i=this.min; i<=this.max; i++) {
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
	value: new Date().getHours()-1,
	rangeChanged: function() {
		this.$.client.destroyClientControls();	
		for (var i=k=this.min; i<=this.max; i++, k++) {
			this.createComponent({content:k.toString()});
			if(i == 12) {	//current hour reached meridiem(noon) 
				k = this.min-1;
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
	name: "moon.TimePicker",
	kind: "moon.ExpandableListItem",
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
		onChange: "updateTime" //*onChange events coming from consituent controls (hour)
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
		/**
			When meridiem is true, current time picker will display from 1 to 12 hour
			with moon.MeridienPicker
		*/
		meridiem: true
	},
	components: [
		{name: "header", kind: "moon.Item", classes: "moon-date-picker-header", spotlight: true,
			onSpotlightFocus: "headerFocus", ontap: "expandContract", onSpotlightSelect: "expandContract"
		},
		{name: "drawer", kind: "moon.Drawer", onStep: "drawerAnimationStep", components: [
			{name: "client", classes: "enyo-tool-decorator", onSpotlightLeft:"closePicker", onSpotlightSelect: "closePicker"}
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
		this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : 'hma');
		this.valueChanged();
	},
	setupPickers: function(ordering) {
		var orderingArr = ordering.split("");
		var o,f,l;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			switch (o){
				case 'h': {
					if (this.meridiem == true) {
						this.createComponent({kind:"moon.HourPicker", name:"hour"});	
					} else {
						this.createComponent({kind:"moon.IntegerPicker", name:"hour", min:1,max:24});	
					}					
				}
				break;
				case 'm': {
					this.createComponent({kind:"moon.IntegerPicker", name:"minute", min:0,max:59});
				}
				break;
				case 'a': {
					if (this.meridiem == true) {
						this.createComponent({kind:"moon.MeridiemPicker", name:"meridiem", classes:"moon-date-picker-year"});
					}
				}
				break;
				default: break;
			}
		}
	},
	parseTime: function(ordering) {
		var orderingArr = ordering.split(""),
			dateStr = "";
		var o,f,l;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			switch (o){
				case 'h': {
					if (this.meridiem == true && this.value.getHours() > 12) {
						dateStr += this.value.getHours() - 12 + " ";	
					} else {
						dateStr += this.value.getHours() + " ";	
					}
				}
				break;
				case 'm': {
					dateStr += this.value.getMinutes() + " ";
				}
				break;
				case 'a': {
					if (this.meridiem == true) {
						dateStr += this.$.meridiem.getMeridiems()[this.$.meridiem.getValue()] + " ";	
					}					
				}
				break;
				default: break;
			}
		}
		return dateStr;
	},
	updateTime: function(inSender, inEvent) {
		//* Avoid onChange events coming from itself
		if (inEvent && inEvent.originator == this) {
			return;
		}
		var hour = this.$.hour.getSelectedIndex() + 1,
		    minute = this.$.minute.getValue();
		this.setValue(new Date(this.value.getFullYear(),
							this.value.getMonth(),
							this.value.getDate(),
							hour, minute,
							this.value.getSeconds(),
							this.value.getMilliseconds()));
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
		this.$.hour.setValue(hour);	
		this.$.minute.setValue(this.value.getMinutes());
		if (this.meridiem == true) {
			hour > 11 ? this.$.meridiem.setValue(1) : this.$.meridiem.setValue(0);	
		}
		this.$.currentValue.setContent(this.parseTime(this._tf ? this._tf.getTimeFieldOrder() : 'hma'));
		this.doChange({name:this.name, value:this.value});		
	},
	//* If no selected item, use _this.noneText_ for current value
	noneTextChanged: function() {
		if(this.value == null) {
			this.$.currentValue.setContent(this.getNoneText());
		} else { 
			this.$.currentValue.setContent(this.parseTime(this._tf ? this._tf.getTimeFieldOrder() : 'hma'));
		}
	},
	//* When _this.open_ changes, show/hide _this.$.currentValue_
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.$.drawer.getOpen());
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
		this.initDefaults();
		this.render();
	}
});