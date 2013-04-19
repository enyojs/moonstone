enyo.kind({
    name: "moon.sample.photos.AlbumGridSample",
	kind: "moon.Panels",
	classes: "photos-album album-grid-sample",
	imgList: [
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"}
	],
	components: [	
		{name: "Albums", title: "Main Menu", components: [
			{kind: "enyo.Spotlight"},
			{
				name: "gridlist",
				kind: "moon.GridList",
				fit: true,
				count: 4,
				onSetupItem: "setupGridItem",
				touch: true,
				itemWidth: 374,
				itemHeight: 267,
				itemSpacing: 30,
				components: [
					{name: "gridItem", kind: "moon.GridList.ImageItem"}
				]
			}
		]}
	],
	
	setupGridItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var gridItem = this.imgList[i];
		if (!gridItem.src) {
			return;
		}
		this.$.gridItem.setSource(gridItem.src);
		//this.$.gridItem.setCaption(gridItem.title);
		this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
	},
});
