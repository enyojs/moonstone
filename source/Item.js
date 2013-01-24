enyo.kind({
	name: "moon.Item",
	classes: "moon-item",
	spotlight: true,
	handlers: {
		onSpotlightFocused: "spotlightFocused"
	},
	spotlightFocused: function(inSender, inEvent) {
		this.bubble("onRequestScrollIntoView", {side: "top"});
		return true;
	}
});