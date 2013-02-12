/**
	_moon.InputDecorator_ is a control that provides input styling. Any controls
	in the InputDecorator will appear to be inside an area styled as an	input.
	Usually, an InputDecorator surrounds an	<a href="#moon.Input">moon.Input</a>.

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.Input"}
		]}

	Other controls, such as buttons, may be placed to the right or left of the
	input control, e.g.:

		{kind: "moon.InputDecorator", components: [
			{kind: "moon.IconButton", src: "search.png"},
			{kind: "moon.Input"},
			{kind: "moon.IconButton", src: "cancel.png"}
		]}

	Note that the InputDecorator fits around the content inside it. If the
	decorator is sized, then its contents will likely need to be sized as well.

		{kind: "moon.InputDecorator", style: "width: 500px;", components: [
			{kind: "moon.Input", style: "width: 100%;"}
		]}
*/
enyo.kind({
	name: "moon.InputDecorator",
	kind: "enyo.ToolDecorator",
	tag: "label",
	classes: "moon-input-decorator",
	//* @protected
	handlers: {
		onDisabledChange: "disabledChange",
		onfocus: "receiveFocus",
		onblur: "receiveBlur",
		onSpotlightSelect: "spotSelect",
	},
	spotlight: true,
	create:function() {
		this.inherited(arguments);
		this.updateFocus(false);
	},
	updateFocus:function(focus) {
		this.focused = focus;
		this.addRemoveClass("moon-focused", this.alwaysLooksFocused || this.focused);
	},
	receiveFocus: function() {
		this.updateFocus(true);
	},
	receiveBlur: function() {
		this.updateFocus(false);
	},
	disabledChange: function(inSender, inEvent) {
		this.addRemoveClass("moon-disabled", inEvent.originator.disabled);
	},
	spotSelect: function(inSender, inEvent) {
		var c = inSender.children[0];
		if (c) {		
			if (c.kind == "moon.RichText") {
				if (c.hasFocus()) {
					c.insertLineBreak();
				}
				else {
					c.focus();
					c.moveCursorToEnd();
				}
			}
			else {
				if (!c.hasFocus()) {
					c.focus();
				}
			}
		}
	}
});