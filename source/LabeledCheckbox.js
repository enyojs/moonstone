/**
	A control that facades a <a href="#moon.Checkbox">moon.Checkbox</a>
	and adds a label. The label text can be set by setting the
	_content_ property. The state of the Checkbox can be retreived
	by interrogating the checked property.

		{kind: "moon.LabeledCheckbox", content: "San Francisco", onchange: "checkedChanged"}
		
		checkedChanged: function(inSender, inEvent) {
			var checked = inSender.getChecked();
		}
	
	_moon.LabeledCheckbox_ can be used with a _Group_ to create a group of
	checkboxes that only allows one checkbox to be chosen at a time (similar
	to the behavior of a radio button).
	
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
			{name: "label", classes: "moon-labeled-checkbox-label"},
		]},
		{name: "input", kind: "moon.Checkbox", spotlight: false}
	],
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