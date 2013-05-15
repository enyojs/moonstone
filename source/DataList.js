enyo.kind({
	name     : "moon.DataList",
	kind     : "enyo.DataList",
	scroller : null,
	published: {
		horizontal : "default",
		vertical   : "default"
	},
	handlers: {
		onRequestScrollIntoView: "onItemFocused",
		onSpotlightDown : 'onMoveDown',
		onSpotlightUp	: 'onMoveUp'
	},
	create: function() {
		this.inherited(arguments);
		this.scroller = this.children[0];
		this.scroller.setVertical(this.vertical);
		this.scroller.setHorizontal(this.horizontal);
	},
	onItemFocused: function(inSender, inEvent) {
		var absoluteBounds = this.scroller.getAbsoluteBounds(),
			controlBounds = inEvent.originator.getAbsoluteBounds(),
			controlOffset = parseInt(inEvent.originator.getComputedStyleValue("margin-bottom"))
							+ parseInt(inEvent.originator.getComputedStyleValue("padding-bottom"))
							+ parseInt(inEvent.originator.getComputedStyleValue("border-bottom-width"));

		if (absoluteBounds.top >= controlBounds.top) {
			this.scroller.scrollIntoView(inEvent.originator, true);
		}
		if (absoluteBounds.top + absoluteBounds.height <= 
			controlBounds.top + controlBounds.height + controlOffset) {
			this.scroller.scrollIntoView(inEvent.originator);
		}
		return true;
	}
});