enyo.kind({
	name: "moon.Toggle",
	kind: "moon.Checkbox",
	published: {
		//* Label for toggle button's "on" state
		onContent: $L("on"),
		//* Label for toggle button's "off" state
		offContent: $L("off"),
	},
	//* @protected
	classes: "moon-toggle",
	components: [
		{name: "label", classes: "moon-toggle-text"}
	],
	create: function() {
		this.inherited(arguments);
		this.checkedChanged();
	},
	checkedChanged: function() {
		this.inherited(arguments);
		this.$.label.setContent(this.getChecked() ? this.onContent : this.offContent);
	},
	shouldDoTransition: function(inChecked) {
		return true;
	},
	createOverlayComponent: function() {
		var content = this.getChecked() ? this.getOnContent() : this.getOffContent();
		return this.createComponent({name: "overlay", classes: "moon-overlay", content: content});
	}
});
