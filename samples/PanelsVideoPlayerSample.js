enyo.kind({
	name: "moon.sample.PanelsVideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{name: "panels", kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", title: "Video", classes: "moon-4h", components: [
				{kind: "moon.Divider", content: "Select video content"},
				{name: "vidContents", kind: "Group", style: "margin-top: 20px;", components: [
					{kind: "moon.SelectableItem", content: "Counter", onActivate: "webMovieCounter"},
					{kind: "moon.SelectableItem", content: "Bunny", onActivate: "webMovieBunny"},
					{kind: "moon.SelectableItem", content: "Sintel", onActivate: "webMovieSintel"}
				]}
			]},
			{kind: "moon.Panel", joinToPrev: true, title: "Player", layoutKind: "FittableColumnsLayout", classes: "moon-7h", components: [
				{
					fit: true,
					components: [
						{name: "player", spotlight: true, kind: "moon.VideoPlayer", inline:true, style: "width: 640px;",
							src: "http://media.w3.org/2010/05/bunny/movie.mp4",
							infoComponents: [
								{
									kind: "moon.VideoInfoHeader",
									aboveTitle: new Date(),
									title: "Breaking Bad - Live Free Or Die",
									subTitle: "AMC (301) 7:00 PM - 8:00 PM",
									description: "As Walt deals with the aftermath of the Casa Tranquila explosion, Hank works to wrap up his investigation of Gus' empire.",
									components: [
										{content: "3D"},
										{content: "Live"},
										{content: "REC 08:22", classes: "moon-video-player-info-redicon"}
									]
								}
							],
							components: [
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.VideoFullscreenToggleButton"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"}
							]
						}
					]
				},
				{layoutKind: "FittableRowsLayout", classes: "moon-7h", components: [
					{kind: "moon.Item", style: "position:absolute; right:0px;", content: "Capture", ontap: "next"}
				]}
			]},
			{kind: "moon.Panel", title: "Capture to Canvas", components: [
				{kind: "moon.Scroller", fit: true, components: [
					{tag: "canvas", name: "capture"}
				]}
			]}
		]}
	],
	next: function(inSender, inEvent) {
		try {
			this.updateCanvas();
		} catch (e) {
			enyo.warn(e);
		}
		this.$.panels.next();
		return true;
	},
	webMovieCounter: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		this.$.player.setSrc("http://media.w3.org/2010/05/video/movie_300.mp4");
	},
	webMovieBunny: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		this.$.player.setSrc("http://media.w3.org/2010/05/bunny/movie.mp4");
	},
	webMovieSintel: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		this.$.player.setSrc("http://media.w3.org/2010/05/sintel/trailer.mp4");
	},
	updateCanvas: function() {
		var drawingNode = this.$.capture.hasNode();
		var videoNode = this.$.player.$.video.hasNode();
		var ctx = drawingNode.getContext("2d");
		var vdb = videoNode.getBoundingClientRect();
		this.$.capture.applyStyle("width", vdb.width+"px");
		this.$.capture.applyStyle("height", vdb.height+"px");
		ctx.drawImage(videoNode, 0, 0, 300, 150);
	}
});
