/**
	_moon.Popup_ is an [enyo.Popup](http://enyojs.com/api/#enyo.Popup)
	which is positioned at the bottom, full size width.

	Todo:
		- Spotlight support
*/
enyo.kind({
	name: "moon.Popup",
	kind: enyo.Popup,
	classes: "moon-dark-gray moon-popup",
	modal: true,
	floating: true
});