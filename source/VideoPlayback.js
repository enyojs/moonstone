/**
	_moon.VideoPlayback_ is a control that 

		{kind: "moon.Slider", value: 30}

*/
enyo.kind({
	name: "moon.VideoPlayback",
	kind: "enyo.Control",
	classes: "moon-video-playback",
	spotlight: true,
	published: {
		//* Position of slider, expressed as an integer between 0 and 100,
		//* inclusive
		src: "",
		width: 640,
		height: 360
	},
	events: {
	// 	//* Fires when bar position is set. The _value_ property contains the
	// 	//* new position.
	// 	onChange: "",
	},
	//* @protected
	handlers: {
	// 	ondragstart: "dragstart",
	// 	onSpotlightFocus: "spotFocus",
	},
	components: [
		// {kind: "enyo.Spotlight"},
		// {name: "video", kind: "Video", src: "http://www.w3schools.com/html/movie.mp4", ontimeupdate:"timeupdate"},
		{name: "video", kind: "enyo.Video", /*src: "http://www.w3schools.com/html/mov_bbb.mp4",*/ ontimeupdate:"timeupdate"},
		// {name: "bgScreen", tag: "canvas", showing: false, classes: "moon-preview-screen"},
		{name: "header",  layoutKind: enyo.HFlexLayout, classes: "moon-video-playback-header", components: [
			{name: "details", content: "details"},
			{name: "feedback", content: "feedback"}
		]},
		{name: "bottom", classes: "moon-video-playback-bottom", components: [
			{name: "controls", layoutKind: enyo.HFlexLayout, components: [
				{name: "blank", style: "width: 200px;"},
				{name: "controller", kind: "Panels", arrangerKind: "CarouselArranger", flex: true, style:"height:100px;", components: [
					{name: "trickPlay", content: "trickPlay", style: "height:100%; width:100%;"},
					{name: "client", content: "additional", style: "height:100%; width:100%;"}
				]},
				{name: "more", kind: "moon.Button", content: "more", ontap: "tapHandler"},
				{name: "blank2", style: "width: 100px;"}
			]},
			{name: "slider", kind: "moon.PreviewSlider", ondragstart: "previewDrag" /*classes:"moon-video-playback-slider", onChange: "sliderChanged"*/}
		]}
	],
	create: function() {
		this.inherited(arguments);
		
		this.srcChanged();
		this.widthChanged();
		this.heightChanged();

	},
	srcChanged: function() {
		if (typeof this.src === "string" && this.src.length > 0) {
			this.$.video.setSrc(this.src);

			var p = this.controlParent;
			this.controlParent = undefined;
			this.$.slider.setVideo(this.$.video);
			this.controlParent = p;

		}
	},
	widthChanged: function() {
		this.$.video.setWidth(this.width);
		// this.$.video.setAttribute("width", this.width + "px");
	},
	heightChanged: function() {
		this.$.video.setHeight(this.height);
		// this.$.video.setAttribute("height", this.height + "px");
	},
	timeupdate: function(inSender, inEvent) {
		// this.log(inEvent);
		return true;
	},

	//* @public

	tapHandler: function(inSender, inEvent) {
		var index = this.$.controller.getIndex();
		if (index === 0) {
			this.$.controller.next();
		}
		else {
			this.$.controller.previous();
		}

		return true;
	}

});
