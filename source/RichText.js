/**
	_moon.RichText_ is a Moonstone-styled RichText control, derived from
	[enyo.RichText](#enyo.RichText). Typically, a _moon.RichText_ is placed inside
	a [moon.InputDecorator](#moon.InputDecorator), which provides styling, e.g.:

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.RichText", style: "width: 240px;", onchange: "inputChange"}
		]}

	For more information, see the documentation on [Text
	Fields](building-apps/controls/text-fields.html) in the Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.RichText",
	kind: "enyo.RichText",
	//* @protected
	classes: "moon-richtext",
	handlers: {
		onblur: "blurred"
	},
	create: function() {
		this.inherited(arguments);
		this.disabledChanged();
	},
	focus: function() {
		this.inherited(arguments);
		var node = this.hasNode();
		// We move the cursor to the end, because in 5-way
		// mode there is no way (other than backspacing) for
		// the user to move the caret within the text field
		this.moveCursorToEnd();
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
	disabledChanged: function() {
		this.inherited(arguments);
		if (this.disabled) {
			this.attributes.contenteditable = false;
		}
	},
	left: function() {
		var sel = this.getSelection();
		if (sel.rangeCount) {
			var selRange = sel.getRangeAt(0);
			var testRange = selRange.cloneRange();

			testRange.selectNodeContents(this.node);
			testRange.setEnd(selRange.startContainer, selRange.startOffset);

			if (testRange.toString() === "") {
				return false;
			}
        }
		return true;
	},
	right: function() {
		var sel = this.getSelection();
		if (sel.rangeCount) {
			var selRange = sel.getRangeAt(0);
			var testRange = selRange.cloneRange();

			testRange.selectNodeContents(this.node);
			testRange.setStart(selRange.endContainer, selRange.endOffset);

			if (testRange.toString() === "") {
				return false;
			}
        }
		return true;
	},
	up: function(inEvent) {
		return this.left();
	},
	down: function(inEvent) {
		return this.right();
	}
});
