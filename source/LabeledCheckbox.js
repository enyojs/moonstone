enyo.kind({
	name: "moon.LabeledCheckbox",
	classes: "moon-labeled-checkbox",
	//* @protected
	spotlight: true,
	handlers: {
		ontap: "tap"
	},
	components: [
		{name: "label", classes: "moon-labeled-checkbox-label"},
		{name: "checkbox", spotlight: false, kind: "moon.Checkbox"}
	],
	contentChanged: function() {
		this.$.label.setContent(this.getContent());
	},
	tap: function(inSender, inEvent) {
		this.waterfallDown("ontap", inEvent, inSender);
		return true;
	}
});