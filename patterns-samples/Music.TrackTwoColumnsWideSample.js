enyo.kind({
	name: "moon.sample.music.TrackTwoColumnsWideSample",
	kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-track-two-column",
	fit: true,
	spotlight: false,
	title: "Browser Tracks",
	titleAbove: "02",
	titleBelow: "15 Tracks",
	headerComponents: [
		{
			classes: "header",
			components: [
				{kind: "moon.IconButton", src: "assets/icon-album.png"},
				{
					kind: "moon.IconButton",
					src: "assets/icon-list.png",
					classes: "right-button"
				}
			]
		}
	],
	components: [
		{kind: "enyo.Spotlight"},
		{
			name: "list",
			kind: "moon.GridList",
			classes: "list",
			fit: true,
			count: 15,
			itemWidth: 300,
			itemHeight: 136,
			itemSpacing: 0,
			touch: true,
			spotlight: true,
			onSetupItem: "setupItem",
			components: [
				{
					name: "gridItem",
					kind: "enyo.FittableColumns",
					classes: "moon-gridlist-item moon-gridlist-imageitem item",
					tag: "span",
					components: [
						{
							name: "preview",
							classes: "preview",
							components: [{classes: "play-icon"}]
						},
						{style: "display: table-cell; width: 20px;"},
						{
							classes: "label",
							components: [
								{name: "track", classes: "content"},
								{name: "artist", classes: "small-content"}
							]
						},
						{name: "time", classes: "time"}
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
		var w = Math.floor(this.getAbsoluteBounds().width * 0.5);
		this.$.list.set("itemWidth", w - 10);
		this.$.list.render();
	},

	setupItem: function(inSender, inEvent) {
		var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name" + inEvent.index);
		this.$.artist.setContent("Artist");
		this.$.time.setContent("3:40");
	}
});
