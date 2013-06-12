/**
	_moon.ToggleText_, which extends <a href="#moon.Checkbox">moon.Checkbox</a>,
	is a control that looks like a switch with labels for an "on" state and an
	"off" state.  When the ToggleText is tapped, it switches its state and fires
	an _onChange_ event.
*/

enyo.kind({
	name: "moon.ToggleText",
	kind: "moon.Checkbox",
	published: {
		//* Text label for the "on" state
		onContent: $L("on"),
		//* Text label for the "off" state
		offContent: $L("off")
	},
	//* @protected
	classes: "moon-toggle-button",
	components: [
		{name: "label", classes: "moon-toggle-button-text"}
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
