/**
	_moon.DatePicker_ is a control that can be used to display--or allow the
	selection of--a day, month, and year.

		{
			kind: "moon.DatePicker",
			noneText: "Pick a Date",
			content: "Date",
			onChange: "changed"
		}

	Set the _value_ property to a standard JavaScript Date object to initialize
	the picker, or to change it programmatically at runtime.
*/
enyo.kind({
	name: "moon.DatePicker",
	kind: "moon.ExpandableListItem",
	classes: "moon-expandable-picker moon-date-picker",
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
		//* Handler for _onChange_ events coming from constituent controls (_day_,
		//* _month_, and _year_)
		onChange: "updateDate"
	},
	published: {
		//* Text to be displayed in the _currentValue_ control if no item is
		//* currently selected
		noneText: "",
		/**
			Current locale used for formatting. May be set after control
			creation, in which case the control will be updated to reflect the
			new value.
		*/
		locale: "en-US",
		//* Optional minimum year value
		minYear: 1900,
		//* Optional maximum year value
		maxYear: 2099,
		//* Optional label for day
		dayText: "day",
		//* Optional label for month
		monthText: "month",
		//* Optional label for year
		yearText: "year",
		/**
			The current date as a standard JavaScript Date object. When a Date object
			is passed to _set("value")_, the control is updated to reflect the new
			value. _get("value")_ returns a Date object.
		*/
		value: null
	},
	componentOverrides: {
		headerWrapper: {components: [
			{name: "header", kind: "moon.Item", spotlight: false, classes: "moon-expandable-list-item-header moon-expandable-picker-header"},
			{name: "currentValue", kind: "moon.Item", spotlight: false, classes: "moon-expandable-picker-current-value"}
		]},
		client: {kind: "enyo.Control", classes: "enyo-tool-decorator moon-date-picker-client", onSpotlightLeft:"closePicker", onSpotlightSelect: "closePicker"}
	},
	create: function() {
		this.inherited(arguments);
		if (typeof ilib !== "undefined") {
			this.locale = ilib.getLocale();
		}
		this.initDefaults();
	},
	initDefaults: function() {
		//Attempt to use the ilib lib (assuming that it is loaded)
		if (typeof ilib !== "undefined") {
			this._tf = new ilib.DateFmt({locale:this.locale});
		}

		this.value = this.value || new Date();
		this.setupPickers(this._tf ? this._tf.getTemplate() : "mdy");
		this.noneTextChanged();
	},
	setupPickers: function(ordering) {
		var orderingArr = ordering.toLowerCase().split("");
		var doneArr = [];
		var o,f,l,c;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			if (doneArr.indexOf(o) < 0) {               
				doneArr.push(o);
			}
		}

		for(f = 0, l = doneArr.length; f < l; f++) {
			o = doneArr[f];
			if (f === 0) {
				c = " first";
			} else if (f == doneArr.length - 1) {
				c = " last";
			} else {
				c = "";  
			}

			switch (o) {
			case 'd':
				this.createComponent(
					{kind:"enyo.Control", name: "dayWrapper", classes: "moon-date-picker-wrap d" + c, components:[
						{kind:"moon.IntegerScrollPicker", name:"day", classes:"moon-date-picker-day", min:1,
						max:this.monthLength(this.value.getFullYear(), this.value.getMonth()), value:this.value.getDate()}
					]});
				break;
			case 'm':
				this.createComponent(
					{kind:"enyo.Control", name: "monthWrapper", classes: "moon-date-picker-wrap m" + c, components:[
						{kind:"moon.IntegerScrollPicker", name:"month", classes:"moon-date-picker-month", min:1, max:12, value:this.value.getMonth()+1}
					]});
				break;
			case 'y':
				this.createComponent(
					{kind:"enyo.Control", name: "yearWrapper", classes: "moon-date-picker-wrap y" + c, components:[
						{kind:"moon.IntegerScrollPicker", name:"year", classes:"moon-date-picker-year", value:this.value.getFullYear(), min:this.minYear, max:this.maxYear}
					]});
				break;
			default:
				break;
			}
		}

		this.$.dayWrapper.createComponent({ kind:"enyo.Control", name: "dayLabel", content : this.dayText ? this.dayText : "day", classes: "moon-date-picker-label"}, {owner: this});
		this.$.monthWrapper.createComponent({ kind:"enyo.Control", name: "monthLabel", content : this.monthText ? this.monthText : "month", style: "display:block;", classes: "moon-date-picker-label"}, {owner: this});
		this.$.yearWrapper.createComponent({ kind:"enyo.Control", name: "yearLabel", content : this.yearText ? this.yearText : "year", style: "display:block;", classes: "moon-date-picker-label"}, {owner: this});
 

		this.pickersAreSetUp = true;
	},
	parseDate: function() {
		if (this._tf) {
			return this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
		} else {
			return this.getAbbrMonths()[this.value.getMonth()] + " " + this.value.getDate() + ", " + this.value.getFullYear();
		}
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

		this.$.currentValue.setContent(this.parseDate());
		if (this.value) {
			this.doChange({name:this.name, value:this.value});
		}
	},
	//* If no item is selected, uses _this.noneText_ as current value.
	noneTextChanged: function() {
		if(this.value == null) {
			this.$.currentValue.setContent(this.getNoneText());
		} else {
			this.$.currentValue.setContent(this.parseDate());
		}
	},
	//* When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		var open = this.$.drawer.get("open");
		this.$.currentValue.setShowing(!open);
		if (this.pickersAreSetUp) {
			//Force the pickers to update their scroll positions (they don't update while the drawer is closed)
			if (open) {
				this.$.day.refreshScrollState();
				this.$.month.refreshScrollState();
				this.$.year.refreshScrollState();
			} else {
				// If one of the pickers is animating when the drawer closes, it won't display properly
				// when the drawer reopens, unless we stabilize here
				this.$.day.stabilize();
				this.$.month.stabilize();
				this.$.year.stabilize();
			}
		}
	},
	toggleActive: function() {
		if (this.getOpen()) {
			this.setActive(false);
			enyo.Spotlight.spot(this.$.headerWrapper);
		} else {
			this.setActive(true);
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
		return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	},
	//* Returns number of days in a particular month/year.
	monthLength: function(inYear, inMonth) {
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	localeChanged: function() {
		this.refresh();
	},
	refresh: function(){
		this.destroyClientControls();
		if (this._tf) {
			delete this._tf;
		}
		this.initDefaults();
		this.render();
	},
	//*@protected
	_marqueeSpotlightFocus: function(inSender, inEvent) {
		if (inSender === this) {
			this.$.header.startMarquee();
			this.$.currentValue.startMarquee();
		}
	},
	_marqueeSpotlightBlur: function(inSender, inEvent) {
		if (inSender === this) {
			this.$.header.stopMarquee();
			this.$.currentValue.stopMarquee();
		}
	},
	yearTextChanged: function (inOldvalue, inNewValue) {
		this.$.yearLabel.setContent(inNewValue);
	},
	monthTextChanged: function (inOldvalue, inNewValue) {
		this.$.monthLabel.setContent(inNewValue);
	},
	dayTextChanged: function (inOldvalue, inNewValue) {
		this.$.dayLabel.setContent(inNewValue);
	}
});
