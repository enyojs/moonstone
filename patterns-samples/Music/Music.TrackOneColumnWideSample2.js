// Sample view

enyo.kind({
	name: "moon.sample.music.TrackOneColumnWideSample2",
	kind: "moon.Panels",
	pattern: "alwaysviewing",
	classes: "moon-neutral",  // TODO: this should be applied automatically by moon.Panels for alwaysviewing
	components: [
		{
			kind: "moon.Panel",
			titleAbove: "02",
			title: "Browse Tracks",
			titleBelow: "15 Tracks",
			headerComponents: [
				{kind: "moon.IconButton", src: "../assets/icon-album.png"},
				{kind: "moon.IconButton", src: "../assets/icon-list.png"}
			],
			components: [
				{
					kind:"moon.Scroller",
					horizontal: "hidden",
					fit: true,
					components: [
						{
							name: "trackList",
							kind: "moon.DataTable",
							components: [
								{
									components: [
										{
											components: [
												{
													kind: "moon.Item",
													components: [
														{
															kind: "enyo.Image",
															classes: "moon-music-small-image",
															bindings: [
																{from: ".model.coverUrl", to: ".src"}
															]

														}
													]
												}
											]
										},
										{
											components: [
												{
													kind: "moon.Item",
													ontap: "changeName",
													bindings: [
														{from: ".model.track", to: ".content"}
													]

												}
											]
										},
										{
											components: [
												{
													kind: "moon.Item",
													ontap: "changeName",
													bindings: [
														{from: ".model.artist", to: ".content"}
													]
												}
											]
										},
										{
											components: [
												{
													kind: "moon.Item",
													ontap: "changeName",
													bindings: [
														{from: ".model.album", to: ".content"}
													]
												}
											]
										},
										{
											components: [
												{
													kind: "moon.Item",
													ontap: "changeName",
													bindings: [
														{from: ".model.time", to: ".content"}
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
			{coverUrl: "../assets/default-music.png", track: "Track 1", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 2", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 3", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 4", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 5", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 6", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 7", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 8", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 9", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 10", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 11", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 12", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 13", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 14", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 15", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 16", artist: "Artist name", album: "Album name", time: "3:40"}
		])
	});

// Sample Application

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			style: "background-image: url(../assets/livetv-background.png); background-size: 100% 100%;",
			components: [
				{
					kind: "moon.sample.music.TrackOneColumnWideSample2",
					controller: ".app.controllers.trackController",
					classes: "enyo-fit",
				}
			]
		},
		controllers: [
			{
				name: "trackController",
				kind: "enyo.ModelController",
				model: sampleModel,
				changeName: function(inSender, inEvent) {
					/** Todo: find the way how to access active datalist row */
					inSender.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.controller.set("track", "Good track");
				}
			}
		]
	});
});