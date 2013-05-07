/**
	_moon.LabeledCheckbox_ is a control that combines a
	<a href="#moon.Checkbox">moon.Checkbox</a> with a text label. The label text
	may be set via the _content_ property. The state of the Checkbox may be
	retrieved by interrogating the _checked_ property.

		{kind: "moon.LabeledCheckbox", content: "San Francisco", onchange: "checkedChanged"}

		checkedChanged: function(inSender, inEvent) {
			var checked = inSender.get("checked");
		}

	You may place _moon.LabeledCheckbox_ objects inside an
	<a href="#enyo.Group">enyo.Group</a> to create a group of checkboxes in which
	only one checkbox may be chosen at a time (similar to how a radio button group
	behaves):

		{kind: "Group", components: [
			{kind: "moon.LabeledCheckbox", content: "New York"},
			{kind: "moon.LabeledCheckbox", content: "London"},
			{kind: "moon.LabeledCheckbox", content: "San Francisco"},
			{kind: "moon.LabeledCheckbox", content: "Beijing"}
		]}
 */
enyo.kind({
	name: "moon.LabeledCheckbox",
	kind: "moon.Item",
	published: {
		//* The state of the checkbox
		checked: false
	},
	//* @protected
	classes: "moon-labeled-checkbox",
	spotlight: true,
	handlers: {
		ontap: "tap",
		onActivate: "decorateActivateEvent"
	},
	components: [
		{classes: "moon-labeled-checkbox-label-wrapper", components: [
			{name: "label", classes: "moon-labeled-checkbox-label"}
		]},
		{name: "input", kind: "moon.Checkbox", spotlight: false}
	],
	rendered: function() {
		this.inherited(arguments);
		this.checkedChanged();
	},
	disabledChanged: function() {
		this.inherited(arguments);
		this.$.input.setDisabled(this.disabled);
	},
	contentChanged: function() {
		this.$.label.setContent(this.getContent());
	},
	checkedChanged: function() {
		this.$.input.setChecked(this.getChecked());
	},
	tap: function(inSender, inEvent) {
		this.waterfallDown("ontap", inEvent, inSender);
		return true;
	},
	decorateActivateEvent: function(inSender, inEvent) {
		inEvent.toggledControl = this;
		inEvent.checked = this.checked = this.$.input.getChecked();
	}
});