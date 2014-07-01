/**
	_moon.Checkbox_ is a box that, when clicked, shows or hides a checkmark and
	fires an _onchange_ event. It derives from [enyo.Checkbox](#enyo.Checkbox) and
	is designed to be used with [moon.CheckboxItem](#moon.CheckboxItem).
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
	//@protected
	checkboxIcon: "check",
	locked: false,
	create: function() {
		this.inherited(arguments);
		this.addClass("moon-icon-" + this.checkboxIcon);
	},
	tap: function(inSender, e) {
		if (!this.disabled && !this.locked) {
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
