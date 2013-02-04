/**
	moon.Button_ is an <a href="#enyo.Button">enyo.Button</a> with Moonraker styling
	applied. The color of the button may be customized by specifying a
	background color.

	For more information, see the documentation on
	<a href="https://github.com/enyojs/enyo/wiki/Buttons">Buttons</a> in the
	Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.Button",
	kind: "enyo.Button",
	//* @protected
	classes: "moon-button enyo-unselectable",
	spotlight: true,
	//* Override default enyo.Button tap handler to toggle active state
	tap: function() {
		if (this.disabled) {
			// work around for platforms like Chrome on Android or Opera that send
			// mouseup to disabled form controls
			return true;
		} else {
			this.setActive(!this.getActive());
		}
	},
	//* Add _active_ css class if button is active
	activeChanged: function() {
		this.inherited(arguments);
		this.addRemoveClass("active", this.getActive());
	}
});