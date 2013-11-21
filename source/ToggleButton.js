/**
	_moon.ToggleButton_, which extends <a href="#moon.Button">moon.Button</a>,
	is a button with two states, "on" and "off".  When the ToggleButton is tapped,
	it switches its state and fires an _onChange_ event.
*/
enyo.kind({
	name: "moon.ToggleButton",
	kind: "moon.Button",
	published: {
		//* If true, indicates that this is the active button of the group;
		//* otherwise, false
		active: false,
		//* Boolean indicating whether toggle button is currently in the "on"
		//* state
		value: false,
		//* Label for toggle button's "on" state
		onContent: moon.$L("On"),  // i18n "ON" label in moon.ToggleButton widget
		//* Label for toggle button's "off" state
		offContent: moon.$L("Off"),  // i18n "OFF" label in moon.ToggleButton widget
		//* Label for separator
		labelSeparator: moon.$L(": "),   // i18n Separater between moon.ToggleButton text label and ON/OFF indicator
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
	components: [
		{name:"offToggleButtonWrapper", kind:"FittableColumns", classes:"wrapper", components: [
			{name:"offToggleLabel", classes:"label", kind: "moon.MarqueeText", fit:true},
			{name: "offLabelSeparate", style: "white-space: pre"},
			{name:"offContent"}
		]},
		{tag:"br"},
		{name:"onToggleButtonWrapper", kind:"FittableColumns", classes:"wrapper toggle-bottom", components: [
			{name:"onToggleLabel", classes:"label", kind:"moon.MarqueeText", fit:true},
			{name: "onLabelSeparate", style: "white-space: pre"},
			{name:"onContent"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.value = Boolean(this.value || this.active);
		this.updateVisualState();
		this.valueChanged();
	},
	rendered: function() {
		this.correctWidth();
	},
	updateVisualState: function() {
		this.addRemoveClass("moon-overlay", this.value);
		this.setActive(this.value);
	},
	activeChanged: function() {
		this.setValue(this.active);
		this.bubble("onActivate");
	},
	valueChanged: function() {
		this.doChange({value: this.value});
		this.$.onToggleButtonWrapper.addRemoveClass("hidden", !this.value);
		this.$.onToggleLabel.setDisabled(!this.value);
		this.$.offToggleButtonWrapper.addRemoveClass("hidden", this.value);
		this.$.offToggleLabel.setDisabled(this.value);
	},
	onContentChanged: function() {
		this.updateContent();
	},
	offContentChanged: function() {
		this.updateContent();
	},
	labelSeparatorChanged: function() {
		this.updateContent();
	},
	contentChanged: function() {
		if(this.$.offToggleLabel) {
			this.updateContent();
		}
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
	updateContent: function() {
		this.$.offToggleLabel.setContent(this.content);
		this.$.offLabelSeparate.setContent(this.labelSeparator);
		this.$.offContent.setContent(this.offContent);
		this.$.onToggleLabel.setContent(this.content);
		this.$.onLabelSeparate.setContent(this.labelSeparator);
		this.$.onContent.setContent(this.onContent);
		this.correctWidth();
	},
	correctWidth: function() {
		var offContentWidth = this.$.offContent.hasNode().clientWidth,
			offLabelSeparateWidth = this.$.offLabelSeparate.hasNode().clientWidth,
			offToggleLabelWidth = this.$.offToggleLabel.hasNode().clientWidth,
			offTotalWidth = offContentWidth + offToggleLabelWidth + offLabelSeparateWidth,
			offMaxWidth = parseInt(enyo.dom.getComputedStyleValue(this.$.offToggleButtonWrapper.hasNode(), "width"),10),
			offToggleLabelHeight = this.$.offToggleLabel.hasNode().clientHeight;

		if(offTotalWidth > offMaxWidth) {
			var offToggleClient = offMaxWidth- (offContentWidth + offLabelSeparateWidth);
			this.$.offToggleLabel.applyStyle("width", offToggleClient + "px");
		}else {
			if(isNaN(offMaxWidth)) {
				this.$.offToggleLabel.applyStyle("width","auto");
			}
		}
		var onContentWidth = this.$.onContent.hasNode().clientWidth,
			onLabelSeparateWidth = this.$.onLabelSeparate.hasNode().clientWidth,
			onToggleLabelWidth = this.$.onToggleLabel.hasNode().clientWidth,
			onTotalWidth = onContentWidth + onToggleLabelWidth + onLabelSeparateWidth,
			onMaxWidth = parseInt(enyo.dom.getComputedStyleValue(this.$.onToggleButtonWrapper.hasNode(), "width"),10);
		this.$.onToggleButtonWrapper.applyStyle("top", -offToggleLabelHeight + "px");
		if(onTotalWidth > onMaxWidth) {
			var onToggleClient = onMaxWidth- (onContentWidth + onLabelSeparateWidth);
			this.$.onToggleLabel.applyStyle("width", onToggleClient + "px");
		}else {
			if(isNaN(onMaxWidth)) {
				this.$.onToggleLabel.applyStyle("width","auto");
			}
		}
	}
});