enyo.kind({
	name: "moon.sample.PanelsVideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{name: "panels", kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", title: "Video", classes: "moon-4h", components: [
				{kind: "moon.Divider", content: "Select video content"},
				{name: "vidContents", kind: "Group", style: "margin-top: 20px;", components: [
					{kind: "moon.SelectableItem", content: "Counter", onActivate: "webMovieCounter"},
					{kind: "moon.SelectableItem", selected: true, content: "Bunny", onActivate: "webMovieBunny"},
					{kind: "moon.SelectableItem", content: "Sintel", onActivate: "webMovieSintel"},
					{kind: "moon.SelectableItem", content: "Error URL", onActivate: "error"}
				]},
				{classes:"moon-vspacing-m", components: [
					{kind: "moon.Button", content: "Unload", ontap: "unload"},
					{kind: "moon.Button", content:"Reload", ontap:"load"},
					{kind: "moon.ToggleButton", name:"autoplayToggle", content:"AutoPlay"}
				]}
			]},
			{kind: "moon.Panel", joinToPrev: true, title: "Player", layoutKind: "FittableColumnsLayout", classes: "moon-7h", components: [
				{
					fit: true,
					components: [{
						name: "player",
						kind: "moon.VideoPlayer",
						inline:true,
						classes: "moon-8h",
						poster: "$lib/moonstone/samples/assets/video-poster.png",
						infoComponents: [{
							kind: "moon.VideoInfoBackground",
							orient: "left",
							fit: true,
							components: [
								{
									kind: "moon.ChannelInfo",
									channelNo: "13",
									channelName: "AMC",
									classes: "moon-2h",
									components: [
										{content: "3D"},
										{content: "Live"},
										{content: "REC 08:22", classes: "moon-video-player-info-redicon"}
									]
								},
								{
									kind: "moon.VideoInfoHeader",
									title: "Downton Abbey",
									subTitle: "Mon June 21, 7:00 - 8:00pm",
									subSubTitle: "R - TV 14, V, L, SC",
									description: "The series, set in the Youkshire country estate of Downton Abbey, depicts the lives of the aristocratic Crawley famiry and"
								}
							]
						}, {
							kind: "moon.VideoInfoBackground",
							orient: "right",
							components: [
								{kind:"moon.Clock"}
							]
						}],
						components: [
							{kind: "moon.VideoFullscreenToggleButton"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"}
						]
					}]
				}
			]}
		]}
	],
	bindings: [
		{from:".$.autoplayToggle.value", to:".$.player.autoplay"}
	],
	unload: function() {
		this.$.player.unload();
	},
	load: function() {
		this.$.player.unload();
		this.$.player.setSources(this.sources);
	},
	webMovieCounter: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		// Set source by sources array
		this.sources = [
			{src: "http://media.w3.org/2010/05/video/movie_300.mp4", type: "video/mp4"},
			{src: "http://media.w3.org/2010/05/video/movie_300.ogv", type: "video/ogg"},
			{src: "http://media.w3.org/2010/05/video/movie_300.webm", type: "video/webm"}
		];
		this.$.player.setSources(this.sources);
		this.$.videoInfoHeader.setTitle("Ticking Counter Video");
	},
	webMovieBunny: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		// Set source by sources array
		this.sources = [
			{src: "http://media.w3.org/2010/05/bunny/movie.mp4", type: "video/mp4"},
			{src: "http://media.w3.org/2010/05/bunny/movie.ogv", type: "video/ogg"}
		];
		this.$.player.setSources(this.sources);
		this.$.videoInfoHeader.setTitle("Bunny Video");
	},
	webMovieSintel: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		// Set source by sources array
		this.sources = [
			{src: "http://media.w3.org/2010/05/sintel/trailer.mp4", type: "video/mp4"},
			{src: "http://media.w3.org/2010/05/sintel/trailer.ogv", type: "video/ogg"},
			{src: "http://media.w3.org/2010/05/sintel/trailer.webm", type: "video/webm"}
		];
		this.$.player.setSources(this.sources);
		this.$.videoInfoHeader.setTitle("The Sintel Video");
	},
	error: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		this.src = "http://foo.bar";
		this.$.player.setSrc(this.src);
		this.$.videoInfoHeader.setTitle("Error video");
	}
});
