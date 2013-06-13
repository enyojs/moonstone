enyo.kind({
	name: "moon.sample.slideshow.LayeredSample",
	classes: "slideshow-layered-sample enyo-unselectable",
	components: [
		{kind: "moon.Divider", content: "Click Image!"},
		{
			components: [
				{
					kind: "enyo.Image",
					src: "http://www.imagebase.net/var/resizes/City-88911873/city%20_9_.jpg",
					ontap: "tapHandler"
				}
			]
		}
	],
	// mockup data
	results: [
		{width: "500", height: "300", thumb: "http://www.imagebase.net/var/resizes/City-88911873/city%20_9_.jpg",
			url: "http://www.imagebase.net/var/albums/City-88911873/city%20_9_.jpg"},
		{width: "400", height: "400", thumb: "http://www.imagebase.net/var/resizes/City-88911873/columns.JPG",
			url: "http://www.imagebase.net/var/albums/City-88911873/columns.JPG"},
		{width: "500", height: "500", thumb: "http://www.imagebase.net/var/resizes/City-88911873/city%20_8_.jpg",
			url: "http://www.imagebase.net/var/albums/City-88911873/city%20_8_.jpg"},
		{width: "300", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/grass_003.jpg",
			url: "http://www.imagebase.net/var/albums/Nature/grass_003.jpg"},
		{width: "500", height: "300", thumb: "http://www.imagebase.net/var/resizes/City-88911873/city%20_9_.jpg",
			url: "http://www.imagebase.net/var/albums/City-88911873/city%20_9_.jpg"},
		{width: "400", height: "400", thumb: "http://www.imagebase.net/var/resizes/City-88911873/columns.JPG",
			url: "http://www.imagebase.net/var/albums/City-88911873/columns.JPG"},
		{width: "500", height: "500", thumb: "http://www.imagebase.net/var/resizes/City-88911873/city%20_8_.jpg",
			url: "http://www.imagebase.net/var/albums/City-88911873/city%20_8_.jpg"},
		{width: "300", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/grass_003.jpg",
			url: "http://www.imagebase.net/var/albums/Nature/grass_003.jpg"},
		{width: "500", height: "300", thumb: "http://www.imagebase.net/var/resizes/City-88911873/city%20_9_.jpg",
			url: "http://www.imagebase.net/var/albums/City-88911873/city%20_9_.jpg"},
		{width: "400", height: "400", thumb: "http://www.imagebase.net/var/resizes/City-88911873/columns.JPG",
			url: "http://www.imagebase.net/var/albums/City-88911873/columns.JPG"},
		{width: "500", height: "500", thumb: "http://www.imagebase.net/var/resizes/City-88911873/city%20_8_.jpg",
			url: "http://www.imagebase.net/var/albums/City-88911873/city%20_8_.jpg"},
		{width: "300", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/grass_003.jpg",
			url: "http://www.imagebase.net/var/albums/Nature/grass_003.jpg"}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "slideShow", kind:"moon.sample.slideshow.PhotoSlideshow", onSetupImage: "setupImage", index: 2});
		this.$.slideShow.setCount(this.results.length);
		this.$.slideShow.render();
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideShow.requestShow();
	},
	setupImage: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		if (inEvent.thumb && inEvent.image) {
			inEvent.thumb.width = this.results[i].width;
			inEvent.thumb.height = this.results[i].height;
			inEvent.thumb.src= this.results[i].thumb;
			inEvent.image.src = this.results[i].url;
		}

		return true;
	}
});

enyo.kind({
	name: "moon.sample.slideshow.PhotoSlideshow",
	kind: "moon.PhotoSlideshow",
	components: [
		//* Custom buttons for left area of slide controller */
		{name: "favorite", kind: "moon.IconButton", src: "../assets/favorite_icon.png", ontap: "favoriteHandler"},
		{kind: "moon.sample.slideshow.SharePopup"}
	],
	favoriteHandler: function(inSender, inEvent) {
		enyo.log("Favorite button is clicked");
		return true;
	}
});

enyo.kind({
	name: "moon.sample.slideshow.SharePopup",
	kind: "moon.ContextualPopupDecorator",
	defaultKind: "moon.IconButton",
	components: [
		{src: "../assets/share_icon.png", ontap: "shareHandler"},
		{kind: "moon.ContextualPopup", components: [
			{content:"Sample component in popup"}
		]}
	],
	shareHandler: function(inSender, inEvent) {
		enyo.log("ShareTo button is clicked");
		return true;
	}
});
