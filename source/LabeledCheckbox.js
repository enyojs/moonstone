enyo.kind({
	name: "moon.LabeledCheckbox",
	kind: "moon.Item",
	published: {
		checked: false,
		value: false
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
		this.log(this.getClientControls());
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