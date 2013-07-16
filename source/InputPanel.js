/**
	_moon.InputPanel_ extends <a href="#moon.Panel">moon.Panel</a>, providing a
	convenient, ready-made panel for use in input scenarios. Its features include
	a input header.
*/

enyo.kind({
	//* @public
	name: "moon.InputPanel",
	kind: "moon.Panel",
	//* @protected
	panelTools : [
		{name: "header", kind: "moon.InputHeader"},
		{name: "panelBody", fit: true, classes: "moon-panel-body"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	]
});