// Sample view

enyo.kind({
	name: "Test.Controller",
	kind: "enyo.ModelController",
	handlers: {
		ontap: "myTapHandler"
	},
	myTapHandler: function (sender, event) {
		this.log(this.owner, this.model);
		this.set("artist", "Hi");
	}
});

enyo.kind({
	name: "moon.sample.music.TrackOneColumnWideSample",
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
					childControllerKind: "Test.Controller",					
					components: [
						{
							kind: "FittableColumns",							
							bindings: [
								{from: ".model.coverUrl", to: ".$.imageCoverUrl.src"},
								{from: ".model.track", to: ".$.imageTrack.content"},
								{from: ".model.artist", to: ".$.imageArtist.content"},
								{from: ".model.album", to: ".$.imageAlbum.content"},
								{from: ".model.time", to: ".$.imageTime.content"}
							],													
							components: [
								{kind: "moon.Item", components: [
									{name: "imageCoverUrl", kind: "enyo.Image", classes: "moon-music-small-image"}
								]},
								{components: [
									{name: "imageTrack", kind: "moon.Item", ontap: "changeName"},
									{name: "imageArtist", kind: "moon.Item", ontap: "changeName"},
									{name: "imageAlbum", kind: "moon.Item", ontap: "changeName"}
								]},								
								{name: "imageTime", kind: "moon.Item", ontap: "changeName"}
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
			{coverUrl: "../assets/default-music.png", track: "Track 16", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 17", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 18", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 19", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 20", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 21", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 22", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 23", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 24", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 25", artist: "Artist name", album: "Album name", time: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "Track 26", artist: "Artist name", album: "Album name", time: "3:40"}
		])
	});

// Sample Application

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{
					kind: "moon.sample.music.TrackOneColumnWideSample",
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
					/** Todo: find the way how to access active datalist row */
					//inSender.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.controller.set("track", "Good track");
					//var controller = inEvent.originator.controller || inEvent.originator.parent.controller;
				}
			}
		]
	});
});
