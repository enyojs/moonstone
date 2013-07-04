enyo.kind({
	name: "moon.sample.GridListSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{
			name: "gridlist",
			kind: "moon.GridList",
			classes: "enyo-fill",
			onSetupItem: "setupItem",
			toggleSelected: true,
			itemWidth: 280,
			itemHeight: 180,
			itemSpacing: 100,
			components: [
				{name: "item", kind: "moon.GridListImageItem"}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.$.gridlist.show(50);
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.item.setSource("./assets/default-music.png");
		this.$.item.setCaption("Item " + i);
		this.$.item.setSubCaption("Sub Caption");
		this.$.item.setSelected(this.$.gridlist.isSelected(i));
	}
});
