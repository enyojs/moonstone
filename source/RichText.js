/**
	_moon.RichText_ is an moonraker-styled RichText control, derived from
	<a href="#enyo.RichText">enyo.RichText</a>. Typically, an _moon.RichText_
	is placed inside an <a href="#moon.InputDecorator">moon.InputDecorator</a>,
	which provides styling, e.g.:

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.RichText", style: "width: 240px;", onchange: "inputChange"}
		]}

	For more information, see the documentation on
	[Text Fields](https://github.com/enyojs/enyo/wiki/Text-Fields) in the Enyo
	Developer Guide.
*/
enyo.kind({
	name: "moon.RichText",
	kind: "enyo.RichText",
	//* @protected
	classes: "moon-richtext",
	create: function() {
		this.inherited(arguments);
		this.disabledChanged();
	},
	disabledChanged: function() {
		this.inherited(arguments);
		if (this.disabled) {
			this.attributes.contenteditable = false;
		}
	}
});