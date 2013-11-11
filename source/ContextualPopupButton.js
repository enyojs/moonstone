/**
	_moon.ContextualPopupButton_ is a [moon.Button](#moon.Button) with additional
	styling applied.

	For more information, see the documentation on
	[Buttons](https://github.com/enyojs/enyo/wiki/Buttons) in the Enyo Developer
	Guide.
*/

enyo.kind({
	name: "moon.ContextualPopupButton",
	kind: "moon.Button",
	//* @protected
	classes: "contextual-popup-button",
	//* A flag used by _moon.ContextualPopupDecorator_ to determine what action to take if
	//* spotlight navigation is attempted outside of _moon.ContextualPopup_
	keepOpen: true
});
