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
	meridiems: true,	//indicate AM/PM enable or disable
	rangeChanged: function() {
		if (this.meridiems == false) {
			this.inherited(arguments);
		} else {		
			this.$.client.destroyClientControls();	
			for (var i=k=this.min; i<=this.max; i++, k++) {
				this.createComponent({content:k.toString()});
				if(i == 12) {	//current hour reached meridiem(noon) 
					k = this.min-1;
				}
			}
			this.setSelectedIndex(this.value);
			this.reflow();
		}
	}
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
		value: null
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
					this.createComponent({kind:"moon.HourPicker", name:"hour", meridiems:false});
//					this._tf ? this.$.day.setDays(this.getDayFields()) : enyo.noop;					
				}
				break;
				case 'm': {
					this.createComponent({kind:"moon.IntegerPicker", name:"minute", min:0,max:59});
//					this._tf ? this.$.month.setAbbrMonths(this._tf.getMonthFields()) : enyo.noop;
//					this._tf ? this.$.month.setMonths(this.getLongMonthFields()) : enyo.noop;				
				}
				break;
				case 'a': {
					this.createComponent({kind:"moon.MeridiemPicker", name:"meridiem", classes:"moon-date-picker-year"});
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
					dateStr += this.value.getHours() + " ";
				}
				break;
				case 'm': {
					dateStr += this.value.getMinutes() + " ";
				}
				break;
				case 'a': {
					dateStr += this.$.meridiem.getMeridiems()[this.$.meridiem.getValue()] + " ";
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
		
		var hour = (this.meridiem == true) && (this.$.meridiem.getValue() == 1) ? this.$.hour.getValue() + 12 : this.$.hour.getValue(),
		    minute = this.$.minute.getValue(),
		    meridiem = hour > 12 ? 1 : 0;
		this.$.meridiem.setValue(meridiem);
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
		
		this.$.hour.setValue(this.value.getHours());
		this.$.minute.setValue(this.value.getMinutes());

		var hour = this.$.hour.getValue();
		hour > 12 ? this.$.meridiem.setValue(1) : this.$.meridiem.setValue(0);	

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
	// getLongMonthFields: function() {
	// 	if (this._tf && this._tf.dateTimeHash){
	// 		return this._tf.dateTimeHash.long.month;
	// 	}else{
	// 		return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	// 	}
	// },
	// getDayFields: function() {
	// 	if (this._tf && this._tf.dateTimeHash){
	// 		return this._tf.dateTimeHash.long.day;
	// 	}else{
	// 		return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	// 	}
	// },
	localeChanged: function() {
		this.refresh();
	},
	refresh: function(){
		this.destroyClientControls();
		this.initDefaults();
		this.render();
	}
});