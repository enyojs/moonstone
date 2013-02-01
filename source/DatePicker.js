/**
	_moon.DatePicker_ is a drop-down picker that contains a group of 
	<a href="#moon.IntegerPicker">moon.IntegerPicker</a>
	controls displaying the current date. The user may change the _day_,
	_month_, and _year_ values.

	By default, _DatePicker_ tries to determine the current locale and use its
	rules to format the date (including the month name). In order to do this
	successfully, the _g11n_ library must be loaded; if it is not loaded, the
	control defaults to using standard U.S. date format.

	The _day_ field is automatically populated with the proper number of days
	for the selected month and year.
*/
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
		onChange: "updateDate" //*onChange events coming from consituent controls (day & month)
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
	},
	initDefaults: function() {
		//Attempt to use the g11n lib (ie assume it is loaded)
		if (enyo.g11n) {
			this._tf = new enyo.g11n.Fmts({locale:this.locale});
		}

		this.value = this.value || new Date();
		this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : 'mdy');
		this.noneTextChanged();		
	},
	setupPickers: function(ordering) {
		var orderingArr = ordering.split("");
		var o,f,l;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			switch (o){
				case 'd': {
					this.createComponent({kind:"moon.DayPicker", name:"day", value:this.value});
					this._tf ? this.$.day.setDays(this.getDayFields()) : enyo.noop;					
				}
				break;
				case 'm': {
					this.createComponent({kind:"moon.MonthPicker", name:"month", value:this.value.getMonth()});
					this._tf ? this.$.month.setAbbrMonths(this._tf.getMonthFields()) : enyo.noop;
					this._tf ? this.$.month.setMonths(this.getLongMonthFields()) : enyo.noop;				
				}
				break;
				case 'y': {
					this.createComponent({kind:"moon.IntegerScrollPicker", name:"year", classes:"moon-date-picker-year", value:this.value.getFullYear(), min:this.minYear, max:this.maxYear});
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
	updateDate: function(inSender, inEvent) {
		//* Avoid onChange events coming from itself
		if (inEvent && inEvent.originator == this) {
			return;
		}
		
		var day = this.$.day.getValue(),
		    month = this.$.month.getValue(),
		    year = this.$.year.getValue();

		var maxDays = this.$.day.monthLength(year, month);
		
		this.setValue(new Date(year, month, (day.getDate() <= maxDays) ? day.getDate() : maxDays));
		return true;
	},
	valueChanged: function(inOld) {
		this.$.year.setValue(this.value.getFullYear());
		this.$.month.setValue(this.value.getMonth());
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
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.$.drawer.getOpen());
		//Force the pickers to update their scroll positions (they don't update while the drawer is closed)
		if (this.$.drawer.getOpen()) {
			this.$.day.render();			
			this.$.month.render();			
			this.$.year.render();
		}
	},
	closePicker: function(inSender, inEvent) {
		// If select/enter is pressed on any date picker item or the left key is pressed on the first item, close the drawer
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

enyo.kind({
	name: "moon.DayPicker",
	kind: "moon.IntegerScrollPicker",
	classes:"moon-date-picker-day",
	min:1,
	value: new Date(),
	components: [
		{name:"repeater", kind:"enyo.FlyweightRepeater", ondragstart: "dragstart", onSetupItem: "setupItem", components: [
			{name:"date", classes:"moon-date-picker-date"},
			{name:"dateName", classes:"dateName"}
		]}
	],
	published: {
		days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]		
	},
	create: function() {
		this.inherited(arguments);
		this.rangeChanged();
		if (!this.value){
			this.value = new Date();
		}				
	},
	rangeChanged: function() {
		this.max = this.monthLength(this.value.getFullYear(), this.value.getMonth());
		this.inherited(arguments);
	},
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.date.setContent(index+1);
		this.$.dateName.setContent(this.days[new Date(this.value.getFullYear(), 
									this.value.getMonth(), 
									index+1).getDay()]);
	},
	rendered: function(){
		this.rendered._inherited._inherited.call(this, arguments);		
		this.scrollToNode(this.$.repeater.fetchRowNode(this.value.getDate()-1));
	},
	valueChanged: function(inOld) {
		//if month or year changed, reset range
		if (this.value && inOld &&
			(this.value.getFullYear() != inOld.getFullYear() || 
			this.value.getMonth() != inOld.getMonth())) {
			this.rangeChanged();
		} else {
			this.animateToNode(this.$.repeater.fetchRowNode(this.value.getDate() - this.min));
		}
	},
	daysChanged: function() {
		this.rangeChanged();
	},
	monthLength: function(inYear, inMonth) {
		// determine number of days in a particular month/year
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	previous: function() {
		if (this.value.getDate() > this.min) {
			this.value.setDate(this.value.getDate()-1);
			this.animateToNode(this.$.repeater.fetchRowNode(this.value.getDate() - this.min));
		}
		return true;
	},
	next: function() {
		if (this.value.getDate() < this.max) {
			this.value.setDate(this.value.getDate()+1);	
			this.animateToNode(this.$.repeater.fetchRowNode(this.value.getDate() - this.min));
		}
		return true;		
	}
})

enyo.kind({
	name: "moon.MonthPicker",
	kind: "moon.IntegerScrollPicker",
	classes:"moon-date-picker-month",	
	published: {
		abbrMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	},
	components: [
		{name:"repeater", kind:"enyo.FlyweightRepeater", ondragstart: "dragstart", onSetupItem: "setupItem", components: [
			{name:"month", classes:"moon-date-picker-month"},
			{name:"monthName", classes:"monthName"}
		]}
	],
	value:0,
	min:0,
	max:11,
	setupItem: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.month.setContent(index+1);
		this.$.monthName.setContent(this.months[index]);
	},	
	monthsChanged: function() {
		this.rangeChanged();
	}
})