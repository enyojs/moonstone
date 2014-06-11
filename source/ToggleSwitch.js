/**
	_moon.ToggleSwitch_, which extends [moon.Checkbox](#moon.Checkbox), is a control
	that looks like a switch with an "on" state and an "off" state. When the
	ToggleSwitch is tapped, it switches its state and fires an _onChange_ event.
*/

enyo.kind({
	name: "moon.ToggleSwitch",
	kind: "moon.Checkbox",
	//* @protected
	classes: "moon-toggle-switch",
	rendered: enyo.inherit(function (sup) {
		return function() {
			sup.apply(this, arguments);
			// wait until after we're rendered to allow animation.
			enyo.asyncMethod(this, function() {
				this.addClass("animated");
			});
		};
	})
});
