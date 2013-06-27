enyo.kind({
    name: "moon.sample.photos.AlbumListWideSample",
	kind: "moon.Panel",
	titleAbove: "01",
	title: "Albums",
	classes: "photos-album enyo-fit",
	layoutKind: "FittableColumnsLayout",
	components: [
		{kind: "enyo.Spotlight"},
		{kind : "moon.Scroller", classes: "moon-7h", horizontal: "hidden", touch: true, components:[
			{
				kind: "moon.ImageItem",
				source: "../assets/album.png",
				label: "ALBUM NAME"
			},
			{
				kind: "moon.ImageItem",
				source: "../assets/album.png",
				label: "ALBUM NAME"
			},
			{
				kind: "moon.ImageItem",
				source: "../assets/album.png",
				label: "ALBUM NAME"
			},
			{
				kind: "moon.ImageItem",
				source: "../assets/album.png",
				label: "ALBUM NAME"
			},
			{
				kind: "moon.ImageItem",
				source: "../assets/album.png",
				label: "ALBUM NAME"
			},
			{
				kind: "moon.ImageItem",
				source: "../assets/album.png",
				label: "ALBUM NAME"
			},
			{
				kind: "moon.ImageItem",
				source: "../assets/album.png",
				label: "ALBUM NAME"
			}
		]},
		{kind : "moon.Scroller", fit: true, touch: true, components:[
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
