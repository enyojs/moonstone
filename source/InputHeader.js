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
			Fires when typing a text in a moon.Input for a title

			_inEvent.keyword_ contains the title of moon.InputHeader
			which is the text in a moon.Input
		*/
		"onSearch": ""
	},
	//* @protected
	classes: "moon-header moon-input-header",
	components: [
		{name: "titleAbove", classes: "moon-header-title-above"},
		{kind: "moon.InputDecorator", classes: 'moon-input-header-input-decorator', components: [
			{name: "title", kind: "moon.Input", oninput: "search", placeholder: "Search", classes: "moon-header-title"}
		]},
		{name: "titleBelow", kind: "moon.Item", spotlight: false, classes: "moon-header-title-below"},
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
	//* If user type a text in moon.Input, "onSearch" evnet  will be fired.
	search: function() {
		this.doSearch({"keyword": this.$.title.getValue()});
	}
});
