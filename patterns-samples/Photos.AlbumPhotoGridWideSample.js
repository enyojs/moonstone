enyo.kind({
    name: "moon.sample.photos.PhotoGridSample",
	kind: "moon.Panel",
	classes: "moon enyo-fit",
	titleAbove: "02",
	title: "Album Name",
	titleBelow: "97 Photos",
	components: [	
		{kind: "enyo.Spotlight"},
		{
			name: "gridlist",
			kind: "moon.GridList",
			classes: "enyo-fill",
			onSetupItem: "setupGridItem",
			itemWidth: 270,
			itemHeight: 202,
			itemSpacing: 20,
			components: [
				{name: "gridItem", kind: "moon.GridList.ImageItem"}
			]
		}
	],

	headerComponents: [
		{kind: "moon.IconButton", src: "assets/icon-round-extend.png"},
		{kind: "moon.IconButton", src: "assets/icon-round-share.png"},
		{kind: "moon.IconButton", src: "assets/icon-round-download.png"},
		{kind: "moon.IconButton", src: "assets/icon-round-delete.png"}
	],
	
	rendered: function() {
		this.inherited(arguments);
		this.$.gridlist.show(30);
	},

	setupGridItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.gridItem.setSource("assets/album.png");
		this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
	},
});
