/**
	_moon.CheckboxItem_ is a control that combines a
	[moon.Checkbox](#moon.Checkbox) with a text label. The label text may be set
	via the _content_ property. The state of the checkbox may be retrieved by
	querying the _checked_ property.

		{kind: "moon.CheckboxItem", content: "San Francisco",
			onchange: "checkedChanged"},

		...

		checkedChanged: function(inSender, inEvent) {
			var checked = inSender.get("checked");
		}

	You may place _moon.CheckboxItem_ objects inside an [enyo.Group](#enyo.Group)
	to create a group of checkboxes in which only one may be checked at any given
	time (similar to how a [RadioItemGroup](#moon.RadioItemGroup)	works):

		{kind: "Group", components: [
			{kind: "moon.CheckboxItem", content: "New York"},
			{kind: "moon.CheckboxItem", content: "London"},
			{kind: "moon.CheckboxItem", content: "San Francisco"},
			{kind: "moon.CheckboxItem", content: "Beijing"}
		]}
*/
enyo.kind({
	name: "moon.CheckboxItem",
	//* @protected
	mixins: ["moon.MarqueeSupport"],
	//* @public
	published: {
		//* Boolean value indicating whether checkbox is currently checked
		checked: false,
		//* If true, checkbox will be displayed on the right side of the checkbox item
		checkboxOnRight: false,
		//* When true, button is shown as disabled and does not generate tap
		//* events
		disabled: false
	},
	events: {
	/**
		Fires when the control is either checked or unchecked.

		_inEvent.checked_ indicates whether the checkbox is currently checked.

		_inEvent.toggledControl_ contains a reference to the CheckboxItem whose
		state toggled. (Note that the originator of this event is actually the
		_moon.Checkbox_ contained within the CheckboxItem, so use this property to
		reference the CheckboxItem.)
	*/
		onActivate: ""
	},
	//* @protected
	classes: "moon-item moon-checkbox-item",
	spotlight: true,
	handlers: {
		ontap: "tap",
		onActivate: "decorateActivateEvent",
		onSpotlightFocused: "spotlightFocused"
	},
	components: [
		{name: "client", mixins: ["moon.MarqueeItem"], classes: "moon-checkbox-item-label-wrapper"},
		{name: "input", kind: "moon.Checkbox", spotlight: false}
	],
	bindings: [
		{from: ".allowHtml", to: ".$.client.allowHtml"}
	],
	create: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.disabledChanged();
			this.checkboxOnRightChanged();
		};
	}),
	rendered: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			this.checkedChanged();
		};
	}),
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
		this.$.input.setDisabled(this.disabled);
	},
	checkedChanged: function() {
		this.$.input.setChecked(this.getChecked());
	},
	checkboxOnRightChanged: function() {
		this.addRemoveClass("left-handed", !this.getCheckboxOnRight());
	},
	tap: function(inSender, inEvent) {
		if (inSender != this.$.input) {
			this.waterfallDown("ontap", inEvent, inSender);
		}
	},
	decorateActivateEvent: function(inSender, inEvent) {
		inEvent.toggledControl = this;
		this.setChecked(this.$.input.getChecked());
		inEvent.checked = this.checked;
	},
	spotlightFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView");
		}
	},
	contentChanged: function() {
		this.$.client.setContent(this.getContent());
	}
});