/**
	_moon.InputHeader_ extends <a href="#moon.Header">moon.Header</a>
	using moon.Input instead of enyo.Control for a title.
*/
enyo.kind({
	//* @public
	name: "moon.InputHeader",
	kind: "moon.Header",
	events: {
		/** 
			Fires when pressing a enter key  in a moon.Input for a title

			_inEvent.keyword_ contains the title of moon.InputHeader
			which is the text in a moon.Input
		*/
		onInputChanged: ""
	},
	//* @protected
	classes: "moon-header moon-input-header",
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "titleAbove", classes: "moon-header-font moon-header-title-above"},
			{kind: "moon.InputDecorator", noStretch: true, layoutKind: "FittableColumnsLayout", classes: 'moon-input-header-input-decorator', components: [
				{name: "title", kind: "moon.Input", onchange: "inputChanged", fit: true, classes: "moon-header-font moon-header-title"},
				{kind: "Image", src: "$lib/moonstone/images/InAppSearch_SearchIcon.png"}
			]},
			{name: "titleBelow", classes: "moon-header-title-below"},
			{name: "subTitleBelow", classes: "moon-header-sub-title-below"}
		]},
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
	},
	//* If user press a enter key in moon.Input, "onInputChanged" evnet  will be fired.
	inputChanged: function(inSender, inEvent) {
		this.doInputChanged({"keyword": this.$.title.getValue()});
	}
});
