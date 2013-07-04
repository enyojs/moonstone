/**
	_moon.ExpandableInput_, which extends
	<a href="#moon.ExpandableListItem">moon.ExpandableListItem</a>, is a drop-down
	input that prompts the user to input text.
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
		//* Text to be displayed in the input if no text is input
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
		},
		{	
			name: "bottom", kind: "enyo.Control", onSpotlightFocus: "spotlightFocusBottom", spotlight: true
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
	//* When _this.value_ changes, update the value and content
	valueChanged: function(inOld) {
		this.$.clientInput.setValue(this.value);
		this.updateContent();
	},
	//* If there is no value, uses _this.placeholder_ as current text.
	noneTextChanged: function() {
		this.updateContent();
	},
	//* If there is no value, uses _this.placeholder_ as the placeholder of the input
	placeholderChanged: function() {
		this.$.clientInput.setPlaceholder(this.placeholder);
	},
	//* When _this.open_ changes, shows/hides _this.$.currentValue_.
	openChanged: function() {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.open);
		this.$.bottom.setShowing(this.open);
	},
	//* expand a drawer, focus or blur moon.Input
	expandDrawer: function(inSender, inEvent) {
		var open = null;
		this.updateContent();
		this.expandContract();

		open = this.getOpen();
		if(!open) {
			this.blur();
			this.$.clientInput.blur();
		} else {
			this.$.clientInput.focus();
			enyo.Spotlight.spot(this.$.client);
		}
	},
	//* If closed, opens drawer and highlights first spottable child.
	expandContract: function(inSender, inEvent) {
		if (this.disabled) {
			return true;
		}
		if(!this.getOpen()) {
			this.setActive(true);
			this.$.client.onFocus();
			this.$.client.focus();
			//enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.$.drawer));
		} else {
			this.setActive(false);
		}
		return true;
	},
	//* When closing drawer via keypress with "UP" direction, update value
	headerFocus: function(inSender, inEvent) {
		if(this.getOpen() && inEvent && inEvent.dir && inEvent.dir === "UP") {
			this.updateContent();
			this.inherited(arguments);
			return true;
		} else if(!this.getOpen()) {
			this.inherited(arguments);
		}
	},
	//* focus moon.Input when input decorator gets focus
	inputFocus: function(inSender, inEvent) {
		if(this.getOpen() && inEvent && inEvent.dir && inEvent.dir == "DOWN") {
			this.$.clientInput.focus();
			enyo.Spotlight.spot(this.$.client);
		}
	},
	//* Fires an _onChange_ event.
	fireChangeEvent: function() {
		this.doChange({
			value:this.value,
		});
	}
});
