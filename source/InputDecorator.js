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
/*		onSpotlightSelect: "spotSelect",
		onSpotlightLeft: "spotLeft",
		onSpotlightRight: "spotRight",
		onSpotlightUp: "spotUp",
		onSpotlightDown: "spotDown"*/
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
	receiveFocus: function(inSender, inEvent) {
		enyo.Spotlight.spot(this);
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
			if (!c.hasFocus()) {
				c.focus();
				if (c.kind == "moon.RichText") {
					c.moveCursorToEnd();
				}
				return true;
			}
		}
		return false;
	},
	spotLeft: function(inSender, inEvent) {
		var c = inSender.children[0];
		if (c && c.hasFocus() && c.left) {
			return c.left(inEvent);
		}
		return false;
	},
	spotRight: function(inSender, inEvent) {
		var c = inSender.children[0];
		if (c && c.hasFocus() && c.right) {
			return c.right(inEvent);
		}
		return false;
	},
	spotUp: function(inSender, inEvent) {
		var c = inSender.children[0];
		if (c && c.hasFocus() && c.up) {
			return c.up(inEvent);
		}
		return false;
	},
	spotDown: function(inSender, inEvent) {
		var c = inSender.children[0];
		if (c && c.hasFocus() && c.down) {
			return c.down(inEvent);
		}
		return false;
	}
});
