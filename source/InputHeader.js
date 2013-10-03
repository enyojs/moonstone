/**
	_moon.InputHeader_ extends <a href="#moon.Header">moon.Header</a> using an input for the title.

	The _title_ property will be used as the input placeholder, while the contents of the input
	can be set/read from the _value_ property.

	Users may catch _onInputHeaderInput_ and _onInputHeaderChange_ events from the embedded input in order to react to changes.

	Example:

			{
				kind: "moon.InputHeader",
				title:"Input Header",
				titleAbove: "02",
				titleBelow: "Sub Header",
				subTitleBelow: "Sub-sub Header",
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
		value: ""
	},
	handlers: {
		oninput: "handleInput",
		onchange: "handleChange"
	},
	events: {
		//* Custom input event to allow apps to differentiate between inputs and header inputs
		onInputHeaderInput: "",
		//* Custom input change event to allow apps to differentiate between input changes and header input changes
		onInputHeaderChange: ""
	},
	//* @protected
	bindings: [
		{from: ".value", to: ".$.titleInput.value", oneWay: false}
	],
	classes: "moon-input-header",
	componentOverrides: {
		titleWrapper: {kind: "moon.InputDecorator", classes: 'moon-input-header-input-decorator', components: [
			{name: "titleInput", kind: "moon.Input", classes: "moon-header-text moon-header-title"}
		]}
	},
	titleChanged: function() {
		this.$.titleInput.set("placeholder", this.title || this.content);
	},
	//* Overload allowHtmlChanged because we have a _moon.Input_ rather than a _moon.MarqueeText_ for _title_
	allowHtmlChanged: function() {
		this.$.titleBelow.setAllowHtmlText(this.allowHtml);
		this.$.subTitleBelow.setAllowHtmlText(this.allowHtml);
	},
	//* Create custom event for _input_ events
	handleInput: function(inSender, inEvent) {
		this.doInputHeaderInput(inEvent);
	},
	//* Create custom event for _change_ events
	handleChange: function(inSender, inEvent) {
		this.doInputHeaderChange(inEvent);
	}
});
