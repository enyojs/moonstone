/**
	_moon.Input_ is a Moonraker-styled input control, derived from
	<a href='#enyo.Input'>enyo.Input</a>. Typically, a _moon.Input_ is placed
	inside a _moon.InputDecorator_, which provides styling, e.g.:

		{kind: 'moon.InputDecorator', components: [
			{kind: 'moon.Input', placeholder: 'Enter some text...', onchange: 'inputChange'}
		]}

	For more information, see the documentation on
	[Text Fields](https://github.com/enyojs/enyo/wiki/Text-Fields) in the Enyo
	Developer Guide.
*/

enyo.kind({
	name	: 'moon.Input',
	kind	: 'enyo.Input',
	classes	: 'moon-input',

	published: {
		fieldType: 'numeric' // all, email, only text, text/number (no special chars)
	},

	//* @protected
	/**********************************************/

	blur: function() {
		if (this.hasNode()) {
			this.node.blur();
		}
	},

	left: function() {
		if (!this.hasNode() || this.node.selectionStart === 0) {
			return false;
		}
		return true;
	},

	right: function() {
		if (!this.hasNode() || this.node.selectionStart == this.node.value.length) {
			return false;
		}
		return true;
	}

});
