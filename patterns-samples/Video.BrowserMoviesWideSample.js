enyo.kind({
	name: "moon.sample.video.BrowserMoviesWideSample",
	kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-video-browsermovies",
	fit: true,
	titleAbove: "02",
	title: "Browser Movies",
	imgList: [
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"},
		{src: "assets/album.png", name: "MOVIE NAME"}
	],
	components: [
		{kind: "enyo.Spotlight"},
		{
			classes: "moon-video-browsermovies-container",
			name: "gridlist",
			kind: "moon.GridList",
			fit: true,
			count: 12,
			onSetupItem: "setupGridItem",
			touch: true,
			itemWidth: 230,
			itemHeight: 130,
			itemSpacing: 30,
			components: [
				{name: "gridItem", kind: "moon.GridList.ImageItem"},
				{name: "gridCaption", classes: "moon-video-browsermovies-item-label"}
			]
		}
	],

	headerComponents: [
		{classes: "moon-video-browsermovie-header-button", components: [
			{kind: "moon.IconButton", src: "assets/icon-list.png"}
		]}
	],

	setupGridItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var gridItem = this.imgList[i];
		if (!gridItem.src) {
			return;
		}
		this.$.gridItem.setSource(gridItem.src);
		this.$.gridCaption.setContent(gridItem.name);
		this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));
	}
});