enyo.kind({
	name: "moon.DatePickerComponent",
	kind: "enyo.Control",
	classes: "moon-date-picker-component",
	events: {
		onValueChange: ""
	},	
	handlers: {
		onSpotlightUp:"previous", 
		onSpotlightDown:"next"
	},
	spotlight: true,
	published: {
		value: undefined,
		min: 0,
		max: 9
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		if (this.value){
			this.valueChanged();	
		} else {
			this.setValue(this.min);
		}
	},
	minChanged: function() {
		this.valueChanged();
	},
	maxChanged: function() {
		this.valueChanged();		
	},
	valueChanged: function(inOld) {
		// Validate our value
		this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
		this.setContent(this.value);
	},
	previous: function() {
		if (this.value > this.min) {
			this.setValue(this.value-1);
			this.doValueChange();
		}
		return true;
	},
	next: function() {
		if (this.value < this.max) {
			this.setValue(this.value+1);
			this.doValueChange();
		}
		return true;		
	}
})


enyo.kind({
	name: "moon.DayPicker",
	kind: "moon.DatePickerComponent",
	classes:"day",
	min:1,
	value: new Date(),
	published: {
		days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]		
	},
	components:[
		{name:"date"},
		{name:"dateName", classes:"dateName"}
	],
	valueChanged: function() {
		if (this.value) {
			this.$.date.setContent(this.value.getDate());
			this.$.dateName.setContent(this.days[this.value.getDay()]);
			this.setMax(this.monthLength(this.value.getFullYear(),this.value.getMonth()));
		}
	},
	daysChanged: function() {
		this.$.dateName.setContent(this.days[this.value.getDay()]);		
	},
	monthLength: function(inYear, inMonth) {
		// determine number of days in a particular month/year
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	previous: function() {
		if (this.value.getDate()-1 >= this.min) {
			this.value.setDate(this.value.getDate()-1);
			this.valueChanged();
			this.doValueChange();
		}
		return true;
	},
	next: function() {
		if (this.value.getDate()+1 <= this.max) {
			this.value.setDate(this.value.getDate()+1);
			this.valueChanged();
			this.doValueChange();			
		}
		return true;		
	}
})

enyo.kind({
	name: "moon.MonthPicker",
	kind: "moon.DatePickerComponent",
	classes:"month",	
	published: {
		abbrMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	},
	max:11,
	components:[
		{name:"month"},
		{name:"monthName", classes:"monthName"}
	],
	valueChanged: function(inOld) {
		this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
		this.$.month.setContent(this.value+1);
		this.$.monthName.setContent(this.months[this.value]);
	},
	monthsChanged: function() {
		this.$.monthName.setContent(this.months[this.value]);		
	}
})

		
enyo.kind({
	name: "moon.DatePicker",
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
		onValueChange: "updateDate"
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
		//* Optional minimum year value
		minYear: 1900,
		//* Optional maximum year value
		maxYear: 2099,
		/**
			The current Date object. When a Date object is passed to _setValue_,
			the control is updated to reflect the new value. _getValue_ returns
			a Date object.
		*/
		value: null
	},
				// {kind:"moon.IntegerPicker", name:"day",classes: "moon-date-picker-day",
				// spotlight: true, onSpotlightUp:"previous", onSpotlightDown:"next"},
				// {kind:"moon.IntegerPicker", name:"month",classes: "moon-date-picker-day",
				// spotlight: true},
				// {kind:"moon.IntegerPicker", min:"1900", max:"2100", value:"2013", style:"width:100px", name:"year", classes: "moon-date-picker-day",
				// spotlight: true}
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

		this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : 'mdy');
		this.value = this.value || new Date();
		this.valueChanged();
	},
	setupPickers: function(ordering) {
		var orderingArr = ordering.split("");
		var o,f,l;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			switch (o){
				case 'd': {
					this.createComponent({kind:"moon.DayPicker", name:"day"});
					this._tf ? this.$.day.setDays(this.getDayFields()) : enyo.noop;					
				}
				break;
				case 'm': {
					this.createComponent({kind:"moon.MonthPicker", name:"month"});
					this._tf ? this.$.month.setAbbrMonths(this._tf.getMonthFields()) : enyo.noop;
					this._tf ? this.$.month.setMonths(this.getLongMonthFields()) : enyo.noop;				
				}
				break;
				case 'y': {
					this.createComponent({kind:"moon.DatePickerComponent", name:"year", classes:"year", min:this.minYear, max:this.maxYear});
				}
				break;
				default: break;
			}
		}
	},
	parseDate: function(ordering) {
		var orderingArr = ordering.split(""),
			dateStr = "";
		var o,f,l;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			switch (o){
				case 'd': {
					dateStr += this.value.getDate() + " ";
				}
				break;
				case 'm': {
					dateStr += this.$.month.getAbbrMonths()[this.value.getMonth()] + " ";
				}
				break;
				case 'y': {
					dateStr += this.value.getFullYear() + " ";
				}
				break;
				default: break;
			}
		}
		return dateStr;
	},
	updateDate: function() {
		var day = this.$.day.getValue(),
		    month = this.$.month.getValue(),
		    year = this.$.year.getValue();
		
		var maxDays = this.$.day.monthLength(year, month);
		
		this.setValue(new Date(year, 
						   month, 
						   (day.getDate() <= maxDays) ? day.getDate() : maxDays));
		return true;
	},
	valueChanged: function() {
		this.$.month.setValue(this.value.getMonth());
		this.$.year.setValue(this.value.getFullYear());
		this.$.day.setValue(this.value);
		this.$.currentValue.setContent(this.parseDate(this._tf ? this._tf.getDateFieldOrder() : 'mdy'));
		this.doChange({name:this.name, value:this.value});		
	},
	//* If no selected item, use _this.noneText_ for current value
	noneTextChanged: function() {
		if(this.value == null) {
			this.$.currentValue.setContent(this.getNoneText());
		} else { 
			this.$.currentValue.setContent(this.parseDate(this._tf ? this._tf.getDateFieldOrder() : 'mdy'));
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
			this.updateDate();
			this.expandContract();
			this.noneTextChanged();
			return true;
		}
	},
	getLongMonthFields: function() {
		if (this._tf && this._tf.dateTimeHash){
			return this._tf.dateTimeHash.long.month;
		}else{
			return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		}
	},
	getDayFields: function() {
		if (this._tf && this._tf.dateTimeHash){
			return this._tf.dateTimeHash.long.day;
		}else{
			return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
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