/**
	_moon.InputHeader_ extends <a href="#moon.Header">moon.Header</a>
	using moon.Input instead of enyo.Control for a title.
*/
enyo.kind({
	//* @public
	name: "moon.InputHeader",
	kind: "moon.Header",
	//* @protected
	classes: "moon-header moon-input-header",
	components: [
		{name: "titleAbove", classes: "moon-header-font moon-header-title-above"},
		{kind: "moon.InputDecorator", layoutKind: "FittableColumnsLayout", classes: 'moon-input-header-input-decorator', components: [
			{name: "title", kind: "moon.Input", fit: true, classes: "moon-header-font moon-header-title"},
			{kind: "Image", src: "$lib/moonstone/images/InAppSearch_SearchIcon.png"}
		]},
		{name: "titleBelow", classes: "moon-header-title-below"},
		{name: "subTitleBelow", classes: "moon-header-sub-title-below"},
		{name: "client", classes: "moon-header-client"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],

	//* @public
	
	//* If _this.tiitle_ changed, the placeHolder value of a moon.Input will be updated
	titleChanged: function() {
		var placeHolder = this.title || this.content;
		if(placeHolder != "") {
			this.$.title.setPlaceholder(placeHolder);
		}
	},
	//* To override contentChanged function in Header.js because input don't need a content property
	contentChanged: function() {
	}
});
