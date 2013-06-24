/**
	_moon.InputPanel_ extends <a href="#moon.Panel">moon.Panel</a>, providing a
	convenient, ready-made panel for use in search scenarios. Its features include
	a search header and a FittableRows layout for the main body content.
*/

enyo.kind({
	//* @public
	name: "moon.InputPanel",
	kind: "moon.Panel",
	//* @protected
	panelTools: [
		{name: "header", kind: "moon.InputHeader"},
		{name: "panelBody", kind: "FittableRows", fit: true, classes: "moon-panel-body"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	]
});