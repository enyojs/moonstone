// Sample view

enyo.kind({
	name: "moon.sample.music.TrackOneColumnNarrowSample",
	components: [{
		kind: "moon.Panels",
		pattern: "alwaysviewing",
		components: [
			{
				kind: "moon.Panel",
				title: "Browse Tracks",
				titleAbove: "02",
				titleBelow: "",
				headerComponents: [
					{kind: "moon.IconButton", src: "../assets/icon-album.png"},
					{kind: "moon.IconButton", src: "../assets/icon-list.png"}
				],
				components: [
					{
						name: "trackList",
						kind: "moon.DataList",
						scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" },
						fit: true,
						components: [
							{
								bindings: [
									{from: ".model.coverUrl", to: ".$.enyoImage.src"},
									{from: ".model.track", to: ".$.imageTrack.content"},
									{from: ".model.artist", to: ".$.imageArtist.content"},
									{from: ".model.time", to: ".$.imageTime.content"}
								],
								components: [
									{kind: "moon.Item", ontap: "changeName", layoutKind: "FittableColumnsLayout", components: [
										{name: "enyoImage", kind: "enyo.Image"},
										{components: [
											{name: "imageTrack"},
											{name: "imageArtist", classes: "moon-superscript"}
										]},
										{name: "imageTime"}
									]}
								]
							}
						]
					}
				]
			}
		]
	}],
	bindings: [
		{from: ".controller.track", to: ".$.trackList.controller"}
	]
});

// Sample Model

enyo.ready(function (){
	var sampleModel = new enyo.Model({
		track: new enyo.Collection([
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"}
		])
	});

// Sample Application

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{
					kind: "moon.sample.music.TrackOneColumnNarrowSample",
					controller: ".app.controllers.trackController",
					classes: "enyo-fit"
				},
				{kind: "enyo.Image", style: "height:100%; width:100%; z-index: -1", src: enyo.Image.placeholder}
			]
		},
		controllers: [
			{
				name: "trackController",
				kind: "enyo.ModelController",
				model: sampleModel,
				changeName: function(inSender, inEvent) {
					inSender.parent.controller.set("track", "Good track");
				}
			}
		]
	});
});