/**
	_moon.SearchPanel is the default kind for controls.

	The built-in features of _moon.SearchPanel include a search header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	//* @public
	name: "moon.SearchPanel",
	kind: "moon.Panel",
	handlers: {
		"onSearch": "search"
	},
	//* @protected
	panelTools : [
		{name: "header", kind: "moon.SearchHeader"},
		{name: "panelBody", kind: "FittableRows", fit: true, classes: "moon-panel-body"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],

	//* @public

	search: function(inSender, inEvent) {
		// console.log("[moon.SearchPanel] onSearch Event - search keyword : " + inEvent.keyword);
	}
});