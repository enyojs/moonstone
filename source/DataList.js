enyo.kind({
	name: "moon.DataList",
	kind: "enyo.DataList",
	handlers: {
		onRequestScrollIntoView: "onItemFocused"
	},
	onItemFocused: function(inSender, inEvent) {
		var scroller = this.get("children")[0];
		scroller.scrollIntoView(inEvent.originator);
	}
});