enyo.kind({
	name: "moon.sample.slideshow.LayeredSample",
	classes: "slideshow-layered-sample enyo-unselectable",
	components: [
		{kind: "moon.Divider", content: "Click Image!"},
		{
			components: [
				{
					kind: "enyo.Image",
					src: "http://www.imagebase.net/var/resizes/Nature/yosemite-valley_001.jpg?m=1300163258",
			url: "http://www.imagebase.net/var/albums/Nature/yosemite-valley_001.jpg?m=1300163251",
					ontap: "tapHandler"
				}
			]
		}
	],
	// mockup data
	results: [
		{width: "500", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/yosemite-valley_001.jpg?m=1300163258",
			url: "http://www.imagebase.net/var/albums/Nature/yosemite-valley_001.jpg?m=1300163251"},
		{width: "400", height: "400", thumb: "http://www.imagebase.net/var/resizes/Nature/daisy.jpg?m=1300163096",
			url: "http://www.imagebase.net/var/albums/Nature/daisy.jpg?m=1300163089"},
		{width: "500", height: "500", thumb: "http://www.imagebase.net/var/resizes/Nature/amazing-sunrise.jpg?m=1300163274",
			url: "http://www.imagebase.net/var/albums/Nature/amazing-sunrise.jpg?m=1300163268"},
		{width: "300", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/grass_003.jpg?m=1300159225",
			url: "http://www.imagebase.net/var/albums/Nature/grass_003.jpg?m=1300159220"},
		{width: "250", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/yosemite-valley_001.jpg?m=1300163258",
			url: "http://www.imagebase.net/var/albums/Nature/yosemite-valley_001.jpg?m=1300163251"},
		{width: "400", height: "400", thumb: "http://www.imagebase.net/var/resizes/Nature/daisy.jpg?m=1300163096",
			url: "http://www.imagebase.net/var/albums/Nature/daisy.jpg?m=1300163089"},
		{width: "500", height: "250", thumb: "http://www.imagebase.net/var/resizes/Nature/amazing-sunrise.jpg?m=1300163274",
			url: "http://www.imagebase.net/var/albums/Nature/amazing-sunrise.jpg?m=1300163268"},
		{width: "300", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/grass_003.jpg?m=1300159225",
			url: "http://www.imagebase.net/var/albums/Nature/grass_003.jpg?m=1300159220"},
		{width: "500", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/yosemite-valley_001.jpg?m=1300163258",
			url: "http://www.imagebase.net/var/albums/Nature/yosemite-valley_001.jpg?m=1300163251"},
		{width: "250", height: "400", thumb: "http://www.imagebase.net/var/resizes/Nature/daisy.jpg?m=1300163096",
			url: "http://www.imagebase.net/var/albums/Nature/daisy.jpg?m=1300163089"},
		{width: "500", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/amazing-sunrise.jpg?m=1300163274",
			url: "http://www.imagebase.net/var/albums/Nature/amazing-sunrise.jpg?m=1300163268"},
		{width: "300", height: "300", thumb: "http://www.imagebase.net/var/resizes/Nature/grass_003.jpg?m=1300159225",
			url: "http://www.imagebase.net/var/albums/Nature/grass_003.jpg?m=1300159220"}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "slideShow", kind:"moon.sample.slideshow.PhotoSlideshow", onSetupItem: "setupItem"});
		this.$.slideShow.setCount(this.results.length);
		this.$.slideShow.render();
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideShow.requestShow();
	},
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		inEvent.thumb.width = this.results[i].width;
		inEvent.thumb.height = this.results[i].height;
		inEvent.thumb.src= this.results[i].thumb;
		inEvent.image.src = this.results[i].url;

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
