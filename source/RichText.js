/**
	_moon.RichText_ is a Moonraker-styled RichText control, derived from
	<a href="#enyo.RichText">enyo.RichText</a>. Typically, a _moon.RichText_ is
	placed inside a _moon.InputDecorator_, which provides styling, e.g.:

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
	blur: function() {
		if (this.hasNode()) {
			this.node.blur();
		}
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
