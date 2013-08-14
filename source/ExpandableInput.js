/**
	_moon.ExpandableInput_, which extends
	<a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>, is a drop-down
	input that prompts the user to enter text.
*/
enyo.kind({
	name: "moon.ExpandableInput",
	kind: "moon.ExpandableListItem",
	classes: "moon-expandable-input",
	events: {
		/**
			Fires when the current text changes.

			_inEvent.value_ contains the value of the input.
		*/
		onChange: ""
	},
	published: {
		//* Text to be displayed in the _currentValue_ control if no item is currently selected
		noneText: "",
		//* Text to be displayed in the input if no text has been entered
		placeholder: "",
		//* Initial value
		value: ""
	},
	//* @protected
	components: [
		{
			name: "header", kind: "moon.Item", spotlight: true,
			onSpotlightFocus: "headerFocus", onSpotlightSelect: "expandDrawer", ontap: "expandDrawer",
			classes: "moon-expandable-input-header"
		},
		{
			name: "drawer", kind: "enyo.Drawer", onStep: "drawerAnimationStep", components: [{
				name: "client",
				kind: "moon.InputDecorator",
				onSpotlightFocus: "inputFocus",
				onSpotlightSelect: "expandDrawer",
				spotlight: true,
				components: [
					{
						name: "clientInput",
						kind: "moon.Input"
					}
				]}
			]
		},
		{
			name: "currentValue", kind: "moon.Item", ontap: "expandDrawer", spotlight: false, content: "",
			classes: "moon-expandable-input-current-value"
		}
	],
	create: function() {
		this.inherited(arguments);
		this.$.clientInput.setValue(this.value);
		this.placeholderChanged();
		this.noneTextChanged();
		this.openChanged();
	},
	initComponents: function() {
		this.controlParentName = "drawer";
		this.discoverControlParent();
		this.inherited(arguments);
	},
	updateContent: function() {
		// text changed
		if(this.value !== this.$.clientInput.value) {
			this.setValue(this.$.clientInput.value);
			this.fireChangeEvent();
		// no input text
		} else if(this.value == "") {
			this.$.currentValue.setContent(this.noneText);
		// update the content of currentValue
		} else if(this.value != this.$.currentValue.content) {
			this.$.currentValue.setContent(this.value);
		}
	},
	//* Updates _value_ and _content_ when _this.value_ changes. 
	valueChanged: function(inOld) {
		this.$.clientInput.setValue(this.value);
		this.updateContent();
	},
	/**
		Uses _this.placeholder_ as placeholder content if none has been specified.
	*/
	noneTextChanged: function() {
		this.updateContent();
	},
	/**
		Uses _this.placeholder_ as placeholder value for the input if no value has
		been specified.
	*/
	placeholderChanged: function() {
		this.$.clientInput.setPlaceholder(this.placeholder);
	},
	//* When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.open && (this.$.currentValue.content !== ""));
	},
	//* Expands a drawer, focusing or blurring the _moon.Input_.
	expandDrawer: function(inSender, inEvent) {
		this.updateContent();
		this.expandContract();

		if(!this.getOpen()) {
			this.blur();
			this.$.clientInput.blur();
		} else {
			this.$.clientInput.focus();
			enyo.Spotlight.spot(this.$.client);
		}
	},
	//* If drawer is closed, opens it and highlights first spottable child.
	expandContract: function(inSender, inEvent) {
		if (this.disabled) {
			return true;
		}
		this.applyStyle("transition", "none");
		if(!this.getOpen()) {
			this.setActive(true);
			this.$.client.onFocus();
			this.$.client.focus();
		} else {
			this.setActive(false);
		}
		this.applyStyle("transition", null);
		return true;
	},
	//* Updates _value_ when drawer is closed via "UP" direction keypress.
	headerFocus: function(inSender, inEvent) {
		if(this.getOpen() && inEvent && inEvent.dir && inEvent.dir === "UP") {
			this.updateContent();
			this.inherited(arguments);
			return true;
		} else if(!this.getOpen()) {
			this.inherited(arguments);
		}
	},
	//* Focuses the _moon.Input_ when the input decorator receives focus.
	inputFocus: function(inSender, inEvent) {
		if(this.getOpen() && inEvent && inEvent.dir && inEvent.dir == "DOWN") {
			this.$.clientInput.focus();
			enyo.Spotlight.spot(this.$.client);
		}
	},
	/**
		Checks for the last item in the client area and prevents 5-way focus
		from moving below it, per UX specs.
	*/
	spotlightDown: function(inSender, inEvent) {
		if (inEvent.originator == this.$.client) {
			return true;
		}
	},
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({
			value:this.value,
		});
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
	}
});
