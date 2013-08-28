/**
	_sun.InputHeader_ extends <a href="#sun.Header">sun.Header</a> using an input for the title.

	The _title_ property will be used as the input placeholder, while the contents of the input
	can be set/read from the _value_ property.

	Users may catch _oninput_ and _onchange_ events from the embedded input in order to react to usre input.

	Example:

			{
				kind: "sun.InputHeader",
				title:"Input Header",
				titleAbove: "02",
				titleBelow: "Sub Header",
				subTitleBelow: "Sub-sub Header",
				classes:"sun-10h",
				oninput:"handleInput",
				onchange:"handleChange",
				components: [
					{kind: "sun.IconButton", src: "assets/icon-like.png"},
					{kind: "sun.IconButton", src: "assets/icon-next.png"}
				]
			}

*/
enyo.kind({
	//* @public
	name: "sun.InputHeader",
	kind: "sun.Header",
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
	// classes: "moon-header moon-input-header",
	componentOverrides: {
		title: {kind: "FittableColumns", components: [
			{kind: "moon.InputDecorator", fit: true, classes: "moon-input-header-input-decorator", components: [
				{name: "titleInput", kind: "moon.Input", onfocus: "onfocus", onblur: "onblur", classes: "sun-header-font sun-header-title"}
			]},
			{name: "done", kind: "sun.Button", content: "Done", classes: "sun-input-header-done-hide"}
		]}
	},
	//* If _this.title_ or _this.content_ changed, the placeHolder value of a moon.Input will be updated
	contentChanged: function() {
		this.$.titleInput.setPlaceholder(this.title || this.content);
	},
	allowHtmlChanged: function() {
		this.$.titleBelow.setAllowHtmlText(this.allowHtml);
		this.$.subTitleBelow.setAllowHtmlText(this.allowHtml);
	},
	onfocus: function() {
		this.$.done.removeClass("sun-input-header-done-hide");
	},
	onblur: function() {
		this.$.done.addClass("sun-input-header-done-hide");
	}
});
