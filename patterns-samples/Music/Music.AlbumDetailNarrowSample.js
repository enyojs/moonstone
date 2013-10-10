// Sample view

enyo.kind({
	name: "moon.sample.music.AlbumDetailNarrowSample",
	kind: "moon.Panel",
	titleAbove: "04",
	title: "Album",
	titleBelow: "",
	components: [
		{kind: "enyo.FittableColumns", noStretch: true, classes: "moon-hspacing", components: [
			{name: "cover", kind: "enyo.Image", style: "height: 200px; width: 200px;"},
			{name: "albumInfo", fit: true, kind: "moon.Table", components: [
				{components: [
					{name: "album", attributes: {colspan: "2"}, classes: "moon-large-text"}
				]},
				{components: [
					{content: "Artist", classes: "moon-sub-header-text"},
					{name: "artist", classes: "moon-body-text"}
				]},
				{components: [
					{content: "Released", classes: "moon-sub-header-text"},
					{name: "releaseDate", classes: "moon-body-text"}
				]},
				{name: "genreRow", components: [
					{content: "Genre", classes: "moon-sub-header-text"},
					{name: "genre", classes: "moon-body-text"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "SONGS", classes: "moon-divider moon-hspacing"},
		{kind: "moon.Scroller", fit: true, classes: "moon-body-text-spacing", components: [
			{name: "trackInfo", kind: "moon.DataTable", style: "width: 100%;", components: [
				{spotlight: true, ontap: "changeTrackName", components: [
					{name: "number", classes: "moon-sub-header-text"},
					{name: "name", classes: "moon-sub-header-text"},
					{name: "duration", classes: "moon-body-text"}
				],
				bindings: [
					{from: ".model.number", to: ".$.number.content"},
					{from: ".model.name", to: ".$.name.content"},
					{from: ".model.duration", to: ".$.duration.content"}
				]}
			]}
		]}
	],
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-like.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],
    bindings: [
        {from: ".controller.artist", to: ".$.artist.content"},
        {from: ".controller.releaseDate", to: ".$.releaseDate.content"},
        {from: ".controller.genre", to: ".$.genre.content"},
        {from: ".controller.album", to: ".$.album.content"},
        {from: ".controller.coverUrl", to: ".$.cover.src"},
		// NOTE: We are setting our tracks property (which is a collection)
		// directly to the controller property of the table
        {from: ".controller.tracks", to: ".$.trackInfo.controller"}
    ],
	changeTrackName: function(inSender, inEvent) {
		inEvent.model.set("name", "We are the Champions");
	}
});

// Sample controller

enyo.kind({
    name: "moon.sample.music.AlbumDetailNarrowSampleController",
    kind: "enyo.ModelController"
});


enyo.kind({
	name: "moon.sample.music.AlbumModel",
	kind: "enyo.Model",
	attributes: {
		artist: null,
		album: null,
		releaseDate: null,
		genre: null,
		coverUrl: null,
		price: null,
		tracks: null
	},
	parse: function(data) {
		data.tracks = new enyo.Collection(data.tracks);
		return data;
	}
});

// Mock data and application to render sample

enyo.ready(function () {
    var mockData = {
        artist: "Queen",
        album: "Greatest Hits",
        releaseDate: "5 April 2013",
        genre: "Rock",
        tracks: [
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "2", name: "Killer Queen", duration: "3:30", price: "$1.99"}
        ],
        coverUrl: "http://placehold.it/200x200"
    };

	var app = new enyo.Application({
		controllers: [
			{name: "album", kind: "moon.sample.music.AlbumDetailNarrowSampleController"}
		],
		view: {
			name: "moon.sample.music.AlbumDetailNarrowSampleMain",
			classes: "enyo-unselectable moon",
			components: [
				{kind: "moon.sample.music.AlbumDetailNarrowSample", classes: "enyo-fit", controller: ".app.controllers.album"}
			]
		}
	});

	app.controllers.album.set("model", new moon.sample.music.AlbumModel(mockData, {parse:true}));
});