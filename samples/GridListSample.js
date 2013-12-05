enyo.kind({
	name: "moon.sample.GridListSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{
			name: "gridlist",
			kind: "moon.GridList",
			classes: "enyo-fill",
			onSetupItem: "setupItem",
			toggleSelected: true,
			itemWidth: 200,
			itemHeight: 300,
			itemSpacing: 50,
			components: [
				{name: "item", kind: "moon.GridListImageItem"}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.$.gridlist.show(1000);
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.item.setSource("./assets/default-music.png");
		this.$.item.setCaption("Item " + i);
		this.$.item.setSubCaption("Sub Caption");
		this.$.item.setSelected(this.$.gridlist.isSelected(i));
	}
});
