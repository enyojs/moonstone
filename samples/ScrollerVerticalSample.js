enyo.kind({
	name: 'moon.sample.ScrollerVerticalSample',
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{name: "scroller", kind: 'moon.Scroller', classes: 'moon-scroller-vertical-sample-scroller enyo-fill moon-8h', onScrollStart: "start", onScroll: "scroll", onScrollStop: "stop"}
	],
	create: function() {
		this.inherited(arguments);
		for (var i = 0; i < 300; i++) {
			this.$.scroller.createComponent({kind: "moon.Item", content: "This is item " + i + "."});
		}
	},
	start: function(inSender, inEvent) {
		// this.log();
	},
	scroll: function(inSender, inEvent) {
		// this.log();
	},
	stop: function(inSender, inEvent) {
		// this.log();
	}
});
