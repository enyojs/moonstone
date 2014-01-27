/**
	_moon.TextArea_ is a Moonstone-styled TextArea control, derived from
	[enyo.TextArea](#enyo.TextArea). Typically, a _moon.TextArea_ is placed inside
	a [moon.InputDecorator](#moon.InputDecorator), which provides styling, e.g.:

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.TextArea", onchange: "inputChange"}
		]}

	For more information, see the documentation on [Text
	Fields](building-apps/controls/text-fields.html) in the Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.TextArea",
	kind: "enyo.TextArea",
	//* @protected
	classes: "moon-textarea",
	spotlightIgnoredKeys: [13, 16777221],	// 13==Enter, 16777221==KeypadEnter
	handlers: {
		onblur: "blurred"
	},
	focus: function() {
		this.inherited(arguments);
		var node = this.hasNode();
		// We move the cursor to the end, because in 5-way
		// mode there is no way (other than backspacing) for
		// the user to move the caret within the text field
		node.selectionStart = this.value.length;
		node.scrollTop = node.scrollHeight;
	},
	blur: function() {
		if (this.hasNode()) {
			this.node.blur();
		}
	},
	blurred: function() {
		this.hasNode().scrollTop = 0;
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
