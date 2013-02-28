enyo.kind({
	name: "moon.SelectableItem",
	kind: "moon.Item",
	classes: "moon-item",
	spotlight: true,
	handlers: {
		onSpotlightFocused: "spotlightFocused"
	},
	published: {
	},
	//* @protected
	spotlightFocused: function(inSender, inEvent) {
		this.bubble("onRequestScrollIntoView", {side: "top"});
		return true;
	}
});