// Sample view

enyo.kind({
	name: "moon.sample.music.TrackOneColumnNarrowSample",
	kind: "moon.Panels",
	pattern: "alwaysviewing",
	classes: "moon-neutral",  // TODO: this should be applied automatically by moon.Panels for alwaysviewing
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
							kind: "moon.Item",
							ontap: "changeName",
							components: [
								{
									kind: "enyo.Table",
									components: [
										{
											components: [
												{
													components: [
														{
															kind: "enyo.Image",
															bindings: [
																{from: ".model.coverUrl", to: ".src"}
															]

														}
													],
													attributes: {rowspan: "2"}
												},
												{
													bindings: [
														{from: ".model.track", to: ".content"}
													]
												},
												{
													bindings: [
														{from: ".model.time", to: ".content"}
													],
													attributes: {rowspan: "2"}
												}
											]
										},
										{
											components: [
												{
													bindings: [
														{from: ".model.artist", to: ".content"}
													] ,

													classes: "moon-superscript"
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	],
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
			style: "background-image: url(../assets/livetv-background.png); background-size: 100% 100%;",
			components: [
				{
					kind: "moon.sample.music.TrackOneColumnNarrowSample",
					controller: ".app.controllers.trackController",
					classes: "enyo-fit"
				}
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