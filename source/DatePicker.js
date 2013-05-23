enyo.kind({
	name: "moon.DatePicker",
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
		//* Handler for _onChange_ events coming from constituent controls (day and month)
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
		locale: "en_us",
		//* Optional minimum year value
		minYear: 1900,
		//* Optional maximum year value
		maxYear: 2099,
		/**
			The current date as a standard JavaScript Date object. When a Date object
			is passed to _setValue()_, the control is updated to reflect the new
			value. _getValue()_ returns a Date object.
		*/
		value: null
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
		if (enyo.g11n) {
			this.locale = enyo.g11n.currentLocale().getLocale();
		}
		this.initDefaults();
	},
	initDefaults: function() {
		//Attempt to use the g11n lib (assuming that it is loaded)
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
			switch (o) {
			case 'd':
				this.createComponent(
					{kind:"moon.IntegerScrollPicker", name:"day", classes:"moon-date-picker-day", min:1,
						max:this.monthLength(this.value.getFullYear(), this.value.getMonth()), value:this.value.getDate()});
				break;
			case 'm':
				this.createComponent({kind:"moon.IntegerScrollPicker", name:"month", classes:"moon-date-picker-month", min:1, max:12, value:this.value.getMonth()+1});
				break;
			case 'y':
				this.createComponent({kind:"moon.IntegerScrollPicker", name:"year", classes:"moon-date-picker-year", value:this.value.getFullYear(), min:this.minYear, max:this.maxYear});
				break;
			default:
				break;
			}
		}
	},
	parseDate: function() {
		if (this._tf) {
			var df = new enyo.g11n.DateFmt({
				date: 'medium',
				locale: new enyo.g11n.Locale(this.locale)
			});
			return df.format(this.value);
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
		this.doChange({name:this.name, value:this.value});
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
	//* Returns number of days in a particular month/year.
	monthLength: function(inYear, inMonth) {
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