enyo.kind({
    name: "moon.sample.photos.AlbumListWideSample",
	kind: "moon.Panel",
	titleAbove: "01",
	title: "Albums",
	classes: "photos-album",
	imageList: [
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"},
		{src: "assets/album.png"}
	],
	components: [
/** If you want to use this template alone with spotlight, remove this comment out.
        {kind: "enyo.Spotlight"},
*/
		{kind: "FittableColumns", fit: true, components: [				
			{kind : "moon.Scroller", style: "width: 25%;", horizontal: "hidden", touch: true, components:[
				{
					kind: "moon.ImageItem", 
					source: "assets/album.png", 
					label: "ALBUM NAME", 
				},
				{
					kind: "moon.ImageItem", 
					source: "assets/album.png", 
					label: "ALBUM NAME", 
				},
				{
					kind: "moon.ImageItem", 
					source: "assets/album.png", 
					label: "ALBUM NAME", 
				},
				{
					kind: "moon.ImageItem", 
					source: "assets/album.png", 
					label: "ALBUM NAME", 
				},
				{
					kind: "moon.ImageItem", 
					source: "assets/album.png", 
					label: "ALBUM NAME", 
				}
			]},
			{kind : "moon.Scroller", fit: true, touch: true, components:[
				{
					name: "gridlist",
					kind: "moon.GridList",
					onSetupItem: "setupGridItem",
					touch: true,
					itemWidth: 200,
					//itemHeight: 202,
					itemSpacing: 20,
					components: [
						{name: "gridItem", kind: "moon.GridList.ImageItem"}
					]
				}
			]}
		]}
	],
	
	rendered: function() {
		this.inherited(arguments);
		this.$.gridlist.show(this.imageList.length);
	},

	setupGridItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var gridItem = this.imageList[i];
		if (!gridItem.src) {
			return;
		}
		this.$.gridItem.setSource(gridItem.src);
		this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
	},
});
