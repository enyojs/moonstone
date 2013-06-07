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
		{name: "video", kind: "enyo.Video", classes: "moon-video-playback-video", ontimeupdate:"timeupdate"},
		{name: "captionDisplay", classes: "moon-video-playback-caption-display", components: [
			{name: "caption", content: "caption.....", classes: "moon-video-playback-caption"},
		]},
		{name: "spiner", /*showing: false,*/ components: [
			{kind: "moon.Spinner", classes: "moon-light"}
		]},
		{name: "header",  layoutKind: enyo.HFlexLayout, classes: "moon-video-playback-header", components: [
			{name: "details", flex: true, classes: "moon-video-playback-details", components: [{content: "details"}]},
			{name: "feedback", classes: "moon-video-playback-feedback", components: [{content: "feedback"}]}
		]},
		{name: "bottom", classes: "moon-video-playback-bottom", components: [
			{layoutKind: enyo.HFlexLayout, components: [
				{name: "controller", kind: "Panels", arrangerKind: "CarouselArranger", flex: true, classes: "moon-video-playback-controller", components: [
					{name: "trickPlay", layoutKind: "FittableColumnsLayout", classes: "enyo-center", components: [
						{kind: "moon.Button", content: "Back"},
						{kind: "moon.Button", content: "Play"},
						{kind: "moon.Button", content: "Forward"},
						
					]},
					{name: "client", layoutKind: "FittableColumnsLayout", classes: "enyo-center"}
				]},
				{name: "more", kind: "moon.Button", content: "more", ontap: "tapHandler"},
			]},
			{name: "slider", kind: "moon.PreviewSlider", classes:"moon-video-playback-slider"/*,  ondragstart: "previewDrag", onChange: "sliderChanged"*/}
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
		this.$.video.setAttribute("width", this.width + "px");
	},
	heightChanged: function() {
		this.$.video.setHeight(this.height);
		this.$.video.setAttribute("height", this.height + "px");
	},
	timeupdate: function(inSender, inEvent) {
		var val = (inSender.getCurrentTime() / inSender.getDuration())*100;
		if (!this.$.slider.dragging) {
			this.$.slider.setValue(val);
		}
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
