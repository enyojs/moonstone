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
	classes: "moon-input-header",
	inputMode: true,
	events: {
		//* Custom input event to allow apps to differentiate between inputs and header inputs
		onInputHeaderInput: "",
		//* Custom input change event to allow apps to differentiate between input changes and header input changes
		onInputHeaderChange: ""
	},
	titleChanged: function() {
		// For backward-compatibility with original API
		this.$.titleInput.set("placeholder", this.placeholder || this.title || this.content);
	}
});
