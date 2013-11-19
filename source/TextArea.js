/**
	_moon.TextArea_ is a Moonstone-styled TextArea control, derived from
	[enyo.TextArea](#enyo.TextArea). Typically, a _moon.TextArea_ is placed inside
	a [moon.InputDecorator](#moon.InputDecorator), which provides styling, e.g.:

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.TextArea", onchange: "inputChange"}
		]}

	For more information, see the documentation on
	[Text Fields](https://github.com/enyojs/enyo/wiki/Text-Fields) in the Enyo
	Developer Guide.
*/
enyo.kind({
	name: "moon.TextArea",
	kind: "enyo.TextArea",
	//* @protected
	classes: "moon-textarea",
	blur: function() {
		if (this.hasNode()) {
			this.node.blur();
		}
	},
	left: function(inEvent) {
		if (!this.hasNode() || this.node.selectionStart === 0) {
			return false;
		}
		return true;
	},
	right: function(inEvent) {
		if (!this.hasNode() || this.node.selectionStart == this.node.value.length) {
			return false;
		}
		return true;
	},
	up: function(inEvent) {
		return this.left(inEvent);
	},
	down: function(inEvent) {
		return this.right(inEvent);
	}
});
