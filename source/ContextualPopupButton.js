/**
	_moon.ContextualPopupButton_ is a <a href="#moon.Button">moon.Button</a> with
	additional styling applied.

	For more information, see the documentation on
	<a href='https://github.com/enyojs/enyo/wiki/Buttons'>Buttons</a> in the
	Enyo Developer Guide.
*/

enyo.kind({
	name: "moon.ContextualPopupButton",
	kind: "moon.Button",
	classes: "contextual-popup-button",
	//* @protected
	//* A flag used by _moon.ContextualPopupDecorator_ to determine what action to take if
	//* spotlight navigation is attempted outside of _moon.ContextualPopup_
	keepOpen: true
});
