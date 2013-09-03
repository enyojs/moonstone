enyo.kind({
	name: "moon.sample.music.ArtistDetailNarrowSample",
	classes: "moon enyo-unselectable",
	controller: ".app.controllers.albumController",
	components: [
		{kind: "moon.Panels", classes: "enyo-fit", pattern: "alwaysviewing", components: [
			{name: "artistPanel", kind: "moon.Panel", classes: "enyo-fit", title: "Artist", headerComponents: [
				{kind: "moon.IconButton", src: "../assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../assets/icon-next.png"}
			], components: [
				{kind: "enyo.FittableColumns", fit: true, components: [
					{style: "width: 400px;", components: [
						{name: "artistImage", kind: "enyo.Image", style: "height: 400px;"},
						{kind: "moon.Table", components: [
							{components: [
								{content: "Organized"},
								{name: "artistOrganized"}
							]},
							{components: [
								{content: "Debut"},
								{name: "artistDebut"}
							]},
							{components: [
								{content: "Type"},
								{name: "artistType"}
							]}
						]}
					]},
					{fit: true, components: [
						{kind: "enyo.FittableRows", classes: "enyo-fill", components: [
							{style: "height: 200px;", kind: "enyo.FittableRows", components: [
								{kind: "moon.Divider", content: "Related Artists"},
								{name: "relatedArtists", kind: "moon.DataGridList", fit: true, components: [
									{kind: "moon.GridListImageItem", bindings: [
										{from: ".model.coverUrl", to: ".source"}
									]}
								], minHeight: 100, minWidth: 100, spacing: 10}
							]},
							{fit: true, kind: "enyo.FittableRows", components: [
								{kind: "moon.Divider", content: "Top 10 Tracks"},
								{name: "trackInfo", fit: true, kind: "moon.DataList", components: [
									{kind: "moon.Item", style: "height: 100px;", components: [
										{kind: "moon.Table", style: "height: 100%;", components: [
											{components: [
												{components: [
													{name: "trackCover", kind: "enyo.Image", style: "width: 100px;"}
												]},
												{components: [
													{name: "trackName", style: "font-weight: bold;"},	
													{content: "Album Name"},
													{name: "trackDuration"}
												]}
											]}
										]}
									], bindings: [
										{from: ".model.coverUrl", to: ".$.trackCover.src"},
										{from: ".model.trackName", to: ".$.trackName.content"},
										{from: ".model.trackDuration", to: ".$.trackDuration.content"}
									]}
								]}
							]}
						]}
					]}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".controller.organizedDate", to: ".$.artistOrganized.content"},
		{from: ".controller.debutDate", to: ".$.artistDebut.content"},
		{from: ".controller.type", to: ".$.artistType.content"},
		{from: ".controller.imageUrl", to: ".$.artistImage.src"},
		{from: ".controller.tracks", to: ".$.trackInfo.controller"},
		{from: ".controller.artist", to: ".$.artistPanel.titleBelow"},
		{from: ".controller.relatedArtists", to: ".$.relatedArtists.controller"}
	]
});

enyo.kind({
	name: "moon.sample.music.ArtistDetailNarrowSampleApplication",
	kind: "enyo.Application",
	view: "moon.sample.music.ArtistDetailNarrowSample",
	controllers: [
		{name: "albumController", kind: "enyo.ModelController"}
	],
	start: function () {
		this.inherited(arguments);
		var m = {
			artist: "Paul McCartney",
			organizedDate: "5 April 2013",
			debutDate: "5 April 2013",
			type: "Solo",
			imageUrl: "../assets/default-music-big.png",
			tracks: new enyo.Collection(),
			relatedArtists: new enyo.Collection()
		};
		for (var i=0, r=m.tracks, a=m.relatedArtists; i<13; ++i) {
			r.add({coverUrl: "../assets/default-music.png", trackName: "Track " + i, trackDuration: i + ":40"});
			if (a.length < 3) { a.add({coverUrl: "../assets/default-music.png"}); }
		}
		this.controllers.albumController.set("model", new enyo.Model(m));
	}
});

enyo.ready(function () {
	new moon.sample.music.ArtistDetailNarrowSampleApplication({name: "app"});
});
