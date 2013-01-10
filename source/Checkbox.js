enyo.kind({
	name: "moon.Checkbox",
	classes: "moon-checkbox",
	//* @protected
	kind: enyo.Checkbox,
	tag: "div",
	spotlight: true,
	handlers: {
		// prevent double onchange bubble in IE
		onclick: ""
	},
	tap: function(inSender, e) {
		if (!this.disabled) {
			this.setChecked(!this.getChecked());
			this.bubble("onchange");
		}
		return !this.disabled;
	},
	dragstart: function() {
		// Override enyo.Input dragstart handler, to allow drags to propagate for Checkbox
	}
});
