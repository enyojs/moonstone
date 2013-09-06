enyo.kind({
	name: "Discovery.Sample.Playback",
	classes: "slideshow-layered-sample enyo-unselectable",
	fit: true,
	handlers: {
		"onPrevious" : "previousHandler",
		"onFoward" : "fowardHandler"
	},
	components: [
		{
			name: "player",
			kind: "Discovery.Components.VideoPlaybackControl",
			// src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
			src: "http://10.170.42.166/files/movie.mp4", // On JCKIM's laptop
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
				{name: "sendThumbButton", kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon_shrink.png", ontap: "showPopup"}
			]
		},
		{name: "thumbPop", kind: "Discovery.Components.ImagePlaybackControl"}		
	],
	showPopup: function(inSender) {
		this.$.thumbPop.show();
	},
	buttonBack: function() {
		//window.open("http://www.google.com", "width=500, height=500", true);
	},
	previousHandler: function(inSender, inResponse) {
		this.log(inResponse);
		this.$.player.setSrc("http://10.170.42.166/files/movie.mp4"); // On JCKIM's laptop
	},
	fowardHandler: function(inSender, inResponse) {
		this.log(inResponse);	
		this.$.player.setSrc("http://10.170.42.166/files/trailer.mp4"); // On JCKIM's laptop
	}
});



enyo.kind({
	name: "Discovery.Components.VideoPlaybackControl",
	kind: "moon.VideoPlayer",
	autoplay:true,
	events: {
		onPrevious: "",
		onFoward: ""
	},
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
		this.doPrevious();
	},
	// override parent's function
	fastForward: function() {
		// this.inherited(arguments);
		this.log("Child call only");
		this.doFoward();
	}
});

enyo.kind({
	name: "Discovery.Components.ImagePlaybackControl",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "moon.Popup", 
	handlers: {
		"onActivate" : "tapHandler",
		"onClose" : "closeHandler"
	},
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
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "slideShow", kind:"discovery.PhotoSlideshow", onSetupImage: "setupImage", index: 3});
		this.$.slideShow.setCount(this.results.length);
		this.$.slideShow.render();
	},
	closeHandler: function() {
		// Bubble up from slideShow
		this.closePopup();
		// delete this;
		return true;
	},
	show: function() {
		this.inherited(arguments);
		this.$.slideShow.show();
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