/**
	_moon.ToggleButton_, which extends <a href="#moon.Button">moon.Button</a>,
	is a control that looks like a switch with labels for two states, an "on"
	state and an "off" state.  When the ToggleButton is tapped, it switches its
	state and fires an _onChange_ event.
*/

enyo.kind({
	name: "moon.ToggleButton",
	kind: "moon.Button",
	published: {
		//* to indicate that this is the active button of the group, false otherwise.
		active: false,
		//* Boolean indicating whether toggle button is currently in the "on"
		//* state
		value: false,
		//* Label for toggle button's "on" state
		onContent: $L("On"),
		//* Label for toggle button's "off" state
		offContent: $L("Off"),
		//* Label for seperator
		labelSeperator: $L(":"), 
		//* If true, toggle button cannot be tapped and thus will not generate
		//* any events
		disabled: false
	},
	events: {
		/**
			Fires when the user changes the value of the toggle button,	but not
			when the value is changed programmatically.

			_inEvent.value_ contains the value of the toggle button.
		*/
		onChange: ""
	},
	//* @protected
	classes: "moon-toggle-button",
	handlers: {
		ondragstart: "dragstart",
		ondrag: "drag",
		ondragfinish: "dragfinish"
	},
	components: [
		{name: "contentOn", classes: "moon-toggle-button-text"},
		{name: "contentOff", classes: "moon-toggle-button-text"}
	],
	create: function() {
		this.inherited(arguments);
		this.value = Boolean(this.value || this.active);
		this.onContentChanged();
		this.offContentChanged();
		this.disabledChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.updateVisualState();
	},
	updateVisualState: function() {
		this.addRemoveClass("moon-overlay", this.value);
		this.$.contentOn.setShowing(this.value);
		this.$.contentOff.setShowing(!this.value);
		this.setActive(this.value);
	},
	valueChanged: function() {
		this.updateVisualState();
		this.doChange({value: this.value});
	},
	activeChanged: function() {
		this.setValue(this.active);
		this.bubble("onActivate");
	},
	labelSeperatorChanged: function() {
		this.onContentChanged();
		this.offContentChanged();	
		this.updateVisualState();
	},
	onContentChanged: function() {
		this.$.contentOn.setContent((this.content || "") + (this.labelSeperator || " ") + (this.onContent || ""));
	}, 
	offContentChanged: function() {
		this.$.contentOff.setContent((this.content || "") + (this.labelSeperator || " ") + (this.offContent || ""));
	},
	disabledChanged: function() {
		this.setAttribute("disabled", this.disabled);
	},
	updateValue: function(inValue) {
		if (!this.disabled) {
			this.setValue(inValue);
		}
	},
	tap: function() {
		this.updateValue(!this.value);
	},
	dragstart: function(inSenser, inEvent) {
		if (inEvent.horizontal) {
			inEvent.preventDefault();
			this.dragging = true;
			this.dragged = false;
			return true;
		}
	},
	drag: function(inSender, inEvnet) {
		if (this.dragging) {
			var d = inEvent.dx;
			if (Math.abs(d) > 10) {
				this.updateValue(d > 0);
				this.dragged = true;
			}
			return true;
		}
	},
	dragfinish: function(inSender, inEvent) {
		this.dragging = false;
		if (this.dragged) {
			inEvent.preventTap();
		}
	}
});
