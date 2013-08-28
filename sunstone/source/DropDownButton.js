/**
	_sun.DropDownButton_ is a <a href="#sun.Button">sun.Button</a> with
	additional styling applied.

	For more information, see the documentation on
	<a href='https://github.com/enyojs/enyo/wiki/Buttons'>Buttons</a> in the
	Enyo Developer Guide.
*/

enyo.kind({
	name: "sun.DropDownButton",
	kind: "sun.Button",
	classes: "sun-drop-down-button",
	//* @protected
	//* A flag used by _moon.ContextualPopupDecorator_ to determine what action to take if  
	//* spotlight navigation is attempted outside of _moon.ContextualPopup_
	keepOpen: true,
	published: {
		//* open or not
		open: false,
		active: false
	},
	rendered: function() {
		this.openChanged();
	},
	openChanged: function() {
		this.setArrow(this.open);
		//this.inherited(arguments);
	},
	setArrow: function(open) {
		this.addRemoveClass('up', open);
		this.addRemoveClass('down', !open);
	},
	activeChanged: function() {
		this.bubble("onActivate");
		this.setOpen(this.active);
	},
});
