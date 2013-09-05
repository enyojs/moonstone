enyo.kind({
	name: "Discovery.Sample.Playback",
	classes: "slideshow-layered-sample enyo-unselectable",
	fit: true,
	components: [
		{
			name: "player",
			kind: "Discovery.Components.VideoPlaybackControl",
			src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
			infoComponents: [
				{kind: "moon.VideoInfoBackground", orient: "left", background: true, fit: true, components: [
					{
						kind: "moon.VideoInfoHeader",
						title: "Downton Abbey"
					}
				]}
			],
			components: [
				{name: "sendBackButton", kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-fullscreenbutton.png", ontap: "buttonBack"},
				{name: "sendThumbButton", kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon_shrink.png", ontap: "showPopup", popup: "thumbPop", components: [
					{name: "thumbPop", kind: "Discovery.Components.ImagePlaybackControl"}
				]},
			]
		}		
	],

	popupActivator: null,
	showPopup: function(inSender) {
		this.hidePopups();
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	},
	hidePopups: function() {
		this.$.thumbPop.hide();
	},

	buttonBack: function() {
		window.open("http://www.google.com", "width=500, height=500", true);
	}

});



enyo.kind({
	name: "Discovery.Components.VideoPlaybackControl",
	kind: "moon.VideoPlayer",
	autoplay:true,
	create: function() {
		this.inherited(arguments);		
		// ICON 변경
		this.setRewindIcon("$lib/moonstone/images/video-player/icon_skipbackward.png");
		this.setFastForwardIcon("$lib/moonstone/images/video-player/icon_skipforward.png");
		this.$.jumpBack.addRemoveClass("hide", true);
		this.$.jumpForward.addRemoveClass("hide", true);
	},
	// override parent's function
	rewind: function() {
		// this.inherited(arguments);
		this.log("Child call only");
	},
	// override parent's function
	fastForward: function() {
		// this.inherited(arguments);
		this.log("Child call only");
	}

});

enyo.kind({
	name: "Discovery.Components.ImagePlaybackControl",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "moon.Popup",
	

	components: [
		{kind: "moon.Divider", content: "Click Image!"},
		{
			components: [
				{
					kind: "enyo.Image",
					src: "http://www.imagebase.net/var/resizes/City-88911873/city%20_9_.jpg",
					ontap: "startImage"
				}
			]
		}
	],

	// mockup data
	results: [
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

	// components: [
	// 	{kind: "moon.Divider", content: "Click me"}
	// ],

	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "slideShow", kind:"discovery.PhotoSlideshow", onSetupImage: "setupImage"});
		this.$.slideShow.setCount(this.results.length);
		this.$.slideShow.render();

	},

	startImage: function(inSender, inEvent) {
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