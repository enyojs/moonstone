enyo.kind({
	name: "moon.DayPicker",
	kind: "moon.IntegerPicker",
	classes:"moon-date-picker-day",
	min:1,
	value: new Date(),
	published: {
		days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]		
	},
	rangeChanged: function() {
		this.max = this.monthLength(this.value.getFullYear(), this.value.getMonth());
		this.$.client.destroyClientControls();	
		for (var i=this.min; i<=this.max; i++) {
			this.createComponent({
				components:[
					{content:i},
					{content:this.days[new Date(this.value.getFullYear(), 
												this.value.getMonth(), 
												i).getDay()], 
					 classes:"dateName"}
				]}).render();
		}
		this.setSelectedIndex(this.value.getDate()-1);
		this.reflow();
	},
	valueChanged: function(inOld) {
		//if it's the same date (month,day,year), get out of here
		if (inOld && inOld.getDate() == this.value.getDate() &&
			inOld.getMonth() == this.value.getMonth() &&
			inOld.getFullYear() == this.value.getFullYear()) {
			return;
		}
			
		//if month or year changed, reset range
		if (this.value && inOld &&
			(this.value.getFullYear() != inOld.getFullYear() || 
			this.value.getMonth() != inOld.getMonth())) {
			this.rangeChanged();
		} else {
			//otherwise just show the new day
			var controls = this.$.client.getClientControls();
			var len = controls.length;
			for (var i=0; i<len; i++) {
				if (this.value.getDate() === parseInt(controls[i].getControls()[0].content)) {
					this.setSelected(controls[i]);
					break;
				}
			}
		}
	},
	daysChanged: function() {
		this.rangeChanged();
	},
	monthLength: function(inYear, inMonth) {
		// determine number of days in a particular month/year
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	selectedChanged: function(inOld) {
		this.value = new Date(this.value.getFullYear(), 
							  this.value.getMonth(), 
							  this.selected.getControls()[0].content);		
		if (this.selected != this.$.client.getActive()) {
			this.$.client.setIndex(this.selected.indexInContainer());
		}
	}
})

enyo.kind({
	name: "moon.MonthPicker",
	kind: "moon.IntegerPicker",
	classes:"moon-date-picker-month",	
	published: {
		abbrMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	},
	max:11,
	value:0,
	rangeChanged: function() {
		this.$.client.destroyClientControls();			
		for (var i=this.min; i<=this.max; i++) {
			this.createComponent({
				components:[
					{content:i+1},
					{content:this.months[i], classes:"monthName"}
				]}).render();
			this.setSelectedIndex(this.value);
		}
		this.reflow();
	},
	valueChanged: function(inOld) {
		//if month or year changed, reset range
		if (this.value != inOld) {
			var controls = this.$.client.getClientControls();
			var len = controls.length;
			// Validate our value
			this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
			for (var i=0; i<len; i++) {
				if (this.value === parseInt(controls[i].getControls()[0].content)-1) {
					this.setSelected(controls[i]);
					break;
				}
			}
		}
	},
	monthsChanged: function() {
		this.rangeChanged();
	},
	selectedChanged: function(inOld) {
		this.value = this.selected.getControls()[0].content-1;
		if (this.selected != this.$.client.getActive()) {
			this.$.client.setIndex(this.selected.indexInContainer());
		}
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
			{name: "client", classes: "enyo-tool-decorator moon-date-picker-client", onSpotlightLeft:"closePicker", onSpotlightSelect: "closePicker"}
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
					this.createComponent(
						{kind:"moon.IntegerScrollPicker", name:"day", classes:"moon-date-picker-day", min:1, 
							max:this.monthLength(this.value.getFullYear(), this.value.getMonth()), value:this.value.getDate()});
				}
				break;
				case 'm': {
					this.createComponent({kind:"moon.IntegerScrollPicker", name:"month", classes:"moon-date-picker-month", min:1, max:12, value:this.value.getMonth()+1});
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
					dateStr += this.getAbbrMonths()[this.value.getMonth()] + " ";
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
		    month = this.$.month.getValue()-1,
		    year = this.$.year.getValue();

		var maxDays = this.monthLength(year, month);
		this.setValue(new Date(year, month, (day <= maxDays) ? day : maxDays));
		return true;
	},
	valueChanged: function(inOld) {
		this.$.year.setValue(this.value.getFullYear());
		this.$.month.setValue(this.value.getMonth()+1);
					
		if (inOld && 
			(inOld.getFullYear() != this.value.getFullYear() || 
			inOld.getMonth() != this.value.getMonth())) {
			this.$.day.setMax(this.monthLength(this.value.getFullYear(), this.value.getMonth()));
		}
		this.$.day.setValue(this.value.getDate());
				
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
		//Force the pickers to update their scroll positions (they don't update while the drawer is closed)
		if (this.$.drawer.getOpen()) {
			this.$.day.render();			
			this.$.month.render();			
			this.$.year.render();
		}
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
	getAbbrMonths: function() {
		if (this._tf && this._tf.dateTimeHash){
			return this._tf.getMonthFields();
		}else{
			return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		}
	},
	monthLength: function(inYear, inMonth) {
		// determine number of days in a particular month/year
		return 32 - new Date(inYear, inMonth, 32).getDate();
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