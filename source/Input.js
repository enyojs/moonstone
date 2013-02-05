/**
	_moon.Input_ is an moon-styled input control, derived from
	<a href="#enyo.Input">enyo.Input</a>. Typically, an _moon.Input_ is placed
	inside an <a href="#moon.InputDecorator">moon.InputDecorator</a>, which
	provides styling, e.g.:

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.Input", placeholder: "Enter some text...", onchange: "inputChange"}
		]}

	For more information, see the documentation on
	[Text Fields](https://github.com/enyojs/enyo/wiki/Text-Fields) in the Enyo
	Developer Guide.
*/
enyo.kind({
	name: "moon.Input",
	kind: "enyo.Input",
	published: {
		fieldType: "numeric" // all, email, only text, text/number (no special chars)
	},
	//* @protected
	classes: "moon-input",
	blur: function() {
		if (this.hasNode()) {
			this.node.blur();
		}
	}
});
