/**
	_moon.ToggleText_, which extends <a href="#moon.Checkbox">moon.Checkbox</a>,
	is a control that looks like a switch with labels for two states, an "on"
	state and an "off" state.  When the ToggleText is tapped, it switches its
	state and fires an _onChange_ event.
*/

enyo.kind({
	name: "moon.ToggleText",
	kind: "moon.Checkbox",
	published: {
		//* Label for toggle text's "on" state
		onContent: $L("on"),
		//* Label for toggle text's "off" state
		offContent: $L("off")
	},
	//* @protected
	classes: "moon-toggle-text",
	components: [
		{name: "label", classes: "moon-toggle-text-text"}
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
