enyo.kind({
    name: "moon.sample.photos.AlbumGridSample",
	kind: "moon.Panel",
	classes: "moon enyo-fit enyo-unselectable",
	titleAbove: "01",
	title: "Main Menu",
	components: [	
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit: true, touch: true, components:[
			{
				name: "gridlist",
				kind: "moon.GridList",
				classes: "enyo-fill",
				onSetupItem: "setupGridItem",
				itemWidth: 374,
				itemHeight: 267,
				itemSpacing: 30,
				components: [
					{name: "gridItem", kind: "moon.GridList.ImageItem"}
				]
			}
		]}
	],

	rendered: function() {
		this.inherited(arguments);
		this.$.gridlist.show(20);
	},
	setupGridItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.gridItem.setSource("../assets/album.png");
		this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
	}
});
