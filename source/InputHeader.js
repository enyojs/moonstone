/**
	_moon.InputHeader_ extends <a href="#moon.Header">moon.Header</a> using an input for the title.

	The _title_ property will be used as the input placeholder, while the contents of the input
	can be set/read from the _value_ property.

	Users may catch _oninput_ and _onchange_ events from the embedded input in order to react to usre input.

	Example:

			{
				kind: "moon.InputHeader",
				title:"Input Header",
				titleAbove: "02",
				titleBelow: "Sub Header",
				subTitleBelow: "Sub-sub Header",
				classes:"moon-10h",
				oninput:"handleInput",
				onchange:"handleChange",
				components: [
					{kind: "moon.IconButton", src: "assets/icon-like.png"},
					{kind: "moon.IconButton", src: "assets/icon-next.png"}
				]
			}

*/
enyo.kind({
	//* @public
	name: "moon.InputHeader",
	kind: "moon.Header",
	published: {
		//* The value of the input
		value:""
	},
	events: {
		//* Fired on each keypress
		oninput:"",
		//* Fired when the user presses enter or blurs the input
		onchange:""
	},
	//* @protected
	bindings: [
		{from: ".value", to:".$.title.value", twoWay:true}
	],
	classes: "moon-header moon-input-header",
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "titleAbove", classes: "moon-header-font moon-header-title-above"},
			{kind: "moon.InputDecorator", noStretch: true, layoutKind: "FittableColumnsLayout", classes: 'moon-input-header-input-decorator', components: [
				{name: "title", kind: "moon.Input", fit: true, classes: "moon-header-font moon-header-title"},
				{kind: "Image", src: "$lib/moonstone/images/InAppSearch_SearchIcon.png"}
			]},
			{name: "titleBelow", classes: "moon-header-title-below"},
			{name: "subTitleBelow", classes: "moon-header-sub-title-below"}
		]},
		{name: "client", classes: "moon-header-client"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	//* If _this.title_ or _this.content_ changed, the placeHolder value of a moon.Input will be updated
	contentChanged: function() {
		this.$.title.setPlaceholder(this.title || this.content);
	}
});
