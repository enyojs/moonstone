enyo.kind({
	name: "moon.sample.GridListSample",
	classes: "moon moon-sample enyo-fit",
	kind: "FittableRows",
	components: [
		{kind: "enyo.Spotlight"},
		{classes: "moon-subheader", content: "Moonstone GridList Sample"},
		{
			name: "gridlist",
			kind: "moon.GridList",
			onSetupItem: "setupItem",
			toggleSelected: true,
			itemWidth: 140,
			itemHeight: 140,
			itemSpacing: 100,
			components: [
				{name: "item", kind: "moon.GridList.ImageItem"}
			],
			fit: true
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
