enyo.kind({
	name: "moon.sample.music.TrackDetailNarrowSample",
	kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-track-detail",
	fit: true,
	spotlight: false,
	title: "Track Name",
	titleAbove: "03",
	titleBelow: "Artist Name",
	headerComponents: [
		{
			classes: "header",
			components: [
				{kind: "moon.IconButton", src: "assets/icon-album.png"},
				{
					kind: "moon.IconButton",
					src: "assets/icon-download.png",
					classes: "right-button"
				},
				{
					kind: "moon.IconButton",
					src: "assets/icon-like.png",
					classes: "right-button"
				},
				{
					kind: "moon.IconButton",
					src: "assets/icon-next.png",
					classes: "right-button"
				}
			]
		}
	],
	components: [
		{kind: "enyo.Spotlight"},
		{
			kind: "FittableColumns",
			classes: "client",
			fit: true,
			components: [
				{
					name: "detail",
					kind: "FittableRows",
					classes: "detail",
					components: [
						{
							name: "movie",
							classes: "preview",
							spotlight: true,
							components: [{name: "play", classes: "play-icon"}]
						},
						{
							kind: "FittableColumns",
							classes: "info",
							components: [
								{classes: "title", content: "Released"},
								{classes: "content", content: "5 April 2013"}
							]
						},
						{
							kind: "FittableColumns",
							classes: "info",
							components: [
								{classes: "title", content: "Genre"},
								{classes: "content", content: "Ballad"}
							]
						}
					]
				},
				{
					fit: true,
					components: [
						{kind: "moon.Divider", classes: "divider", content: "More"},
						{kind: "Group", components: [
							{kind: "moon.SelectableItem", content: "Lyrics"},
							{kind: "moon.SelectableItem", content: "Artist"},
							{kind: "moon.SelectableItem", content: "Album"},
							{kind: "moon.SelectableItem", content: "Similar Track"},
							{kind: "moon.SelectableItem", content: "Related Videos"}
						]}
					]
				}
			]
		}
	],

	rendered: function() {
		this.inherited(arguments);
		this.resizeHandler();
	},

	resizeHandler: function() {
		var d = this.$.detail.getBounds().width;
		this.$.movie.setBounds({width: d, height: d});

		d = Math.round((d - 168) * 0.5);
		this.$.play.setStyle("margin: " + d + "px 0px 0px " + d + "px;");
	}
});
