/**
	_moon.Checkbox_ is a box that, when clicked, shows or hides a checkmark and
	fires an _onchange_ event. It derives from
	<a href="#enyo.Checkbox">enyo.Checkbox</a> and is designed to be used with
	<a href="#moon.CheckboxItem">moon.CheckboxItem</a>.
*/
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
		} else {
			return true;
		}
	},
	dragstart: function() {
		// Override enyo.Input dragstart handler, to allow drags to propagate for Checkbox
	}
});
