enyo.kind({
	name: "moon.sample.music.TrackTwoColumnsWideSample",
	kind: "moon.Panel",
	classes: "moon enyo-unselectable enyo-fit",
	titleAbove: "02",
	title: "Browse Tracks",
	titleBelow: "26 Tracks",
	controller: ".app.controllers.playlistController",
	headerComponents: [
		{kind: "moon.IconButton", src: "../assets/icon-album.png"},
		{kind: "moon.IconButton", src: "../assets/icon-list.png"}
	],
	components: [
		{name: "trackList", kind: "moon.DataGridList", fit: true, minWidth: 180, minHeight: 260, components: [
			{kind: "moon.GridListImageItem", ontap: "changeName", bindings: [
				{from: ".model.coverUrl", to: ".source"},
				{from: ".model.track", to: ".caption"},
				{from: ".model.artist", to: ".subCaption"}
			]}
		]}
	],
	bindings: [
		{from: ".controller.tracks", to: ".$.trackList.controller"}
	],
	changeName: function (inSender, inEvent) {
		this.controller.get("tracks").get(inSender.index).set("track", "Good Track!");
	}
});

enyo.ready(function () {
	// create our sample playlist with a collection of tracks
	var playlist = new enyo.Model({tracks: new enyo.Collection()}),
		c        = playlist.get("tracks");
	// create some tracks for our playlist
	for (var i=0; i<26; ++i) {
		c.add({coverUrl: "../assets/default-music.png", track: "Track name " + (i+1), artist: "Artist name " + (i+1), album: "Album name", time: "3:40"});
	}
	new enyo.Application({
		name: "app",
		view: "moon.sample.music.TrackTwoColumnsWideSample",
		controllers: [
			{name: "playlistController", kind: "enyo.ModelController", model: playlist}
		]
	});
});
