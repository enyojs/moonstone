enyo.kind({
    name: "moon.sample.photos.AlbumListWideSample",
	kind: "moon.Panel",
	index: "01",
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
		{kind: "enyo.Spotlight"},
		{kind: "FittableColumns", style: "height:550px;", components: [				
			{kind : "moon.Scroller", style: "width: 20%;", horizontal: "hidden", touch: true, components:[
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
			{kind : "moon.Scroller", style: "height:550px;", fit: true, touch: true, components:[
				{
					name: "gridlist",
					kind: "moon.GridList",
					onSetupItem: "setupGridItem",
					touch: true,
					itemWidth: 270,
					itemHeight: 202,
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
