/* globals app: true, sample: true */
// Sample view
enyo.kind({
	name: "moon.sample.music.ArtistDetailNarrowSample",
	kind: "moon.Panel",
	titleAbove: "04",
	title: "Artist",
	controller: ".app.controllers.albumController",
	headerComponents: [
		{kind: "moon.IconButton", src: "../assets/icon-like.png"},
		{kind: "moon.IconButton", src: "../assets/icon-next.png"}
	],
	components: [
		{kind: "enyo.FittableColumns", noStretch: true, components: [
			{name: "artistImage", kind: "enyo.Image", style: "width: 200px; height: 200px;"},
			{kind: "enyo.Table", mixins: ["enyo.AutoBindingSupport"], fit: true, components: [
				{components: [
					{bindFrom: ".artist", attributes: {colspan: "2"}, style: "font-weight: bold;"}
				]},
				{components: [
					{content: "Organized"},
					{bindFrom: ".organizedDate"}
				]},
				{components: [
					{content: "Debut"},
					{bindFrom: ".debutDate"}
				]},
				{components: [
					{content: "Type"},
					{bindFrom: ".type"}
				]}
			], bindSource: ".controller", controller: ".app.controllers.albumController"}
		]},
		{kind: "moon.Divider", content: "Top 10 Tracks"},
		{name: "trackInfo", kind: "moon.DataList", fit: true, components: [
			{kind: "moon.Item", components: [
				{kind: "enyo.Table", components: [
					{components: [
						{attributes: {rowspan: "3"}, components: [
							{kind: "enyo.Image", bindFrom: ".coverUrl", bindTo: ".src"}
						]},
						{bindFrom: ".name"}
					]},
					{components: [
						{bindFrom: ".duration", classes: "moon-superscript"}
					]}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".controller.artistImageUrl", to: ".$.artistImage.src"},
		{from: ".controller.tracks", to: ".$.trackInfo.controller"}
	]
});

// Sample model
enyo.kind({
	name: "sample.Model",
	kind: "enyo.Model",
	attributes: {
		tracks: {
			relation: enyo.toMany()
		}
	}
});

enyo.ready(function() {

	new enyo.Application({
		name: "app",
		view: {
			classes: "moon",
			components: [
				{kind: "enyo.Spotlight"},
				{kind: "moon.sample.music.ArtistDetailNarrowSample", classes: "enyo-fit", name: "detail"}
			]
		},
		controllers: [
			{name: "albumController", kind: "enyo.ModelController"}
		]
	});
	app.controllers.albumController.set("model", new sample.Model({
		artist: "Paul McCartney",
		organizedDate: "5 April 2013",
		debutDate: "5 April 1973",
		type: "Solo",
		tracks: [
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", name: "Track Name", duration: "3:40"}
		],
		artistImageUrl: "../assets/default-music-big.png"
	}));
});