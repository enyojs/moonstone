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
					{kind: "moon.SelectableItem", content: "Sintel", onActivate: "webMovieSintel"}
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
						infoComponents: [{
							kind: "moon.VideoInfoBackground",
							orient: "left",
							fit: true,
							components: [
								{
									kind: "moon.ChannelInfo",
									channelNo: "13",
									channelName: "AMC",
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
							{kind: "moon.IconButton", src: "$lib/moonstone/images/video-player/icon-placeholder.png"},
							{kind: "moon.VideoFullscreenToggleButton"},
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
				},
				{classes: "moon-3h", components: [
					{kind: "moon.Item", style: "position:absolute; right:0px;", content: "Capture", ontap: "capture"}
				]}
			]},
			{kind: "moon.Panel", title: "Capture to Canvas", components: [
				{kind: "moon.Scroller", fit: true, components: [
					{tag: "canvas", name: "capture", spotlight: true}
				]}
			]}
		]}
	],
	capture: function(inSender, inEvent) {
		try {
			this.updateCanvas();
		} catch (e) {
			enyo.warn(e);
		}
		this.$.panels.setIndex(2);
		return true;
	},
	webMovieCounter: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		this.$.player.setSrc("http://media.w3.org/2010/05/video/movie_300.mp4");
		this.$.videoInfoHeader.setTitle("Ticking Counter Video");
	},
	webMovieBunny: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		this.$.player.setSrc("http://media.w3.org/2010/05/bunny/movie.mp4");
		this.$.videoInfoHeader.setTitle("Bunny Video");
	},
	webMovieSintel: function(inSender, inEvent) {
		if (!inEvent.originator.active) {
			return;
		}
		this.$.player.setSrc("http://media.w3.org/2010/05/sintel/trailer.mp4");
		this.$.videoInfoHeader.setTitle("The Sintel Video");
	},
	updateCanvas: function() {
		var drawingNode = this.$.capture.hasNode();
		var videoNode = this.$.player.getVideo().hasNode();
		var ctx = drawingNode.getContext("2d");
		var vdb = videoNode.getBoundingClientRect();
		this.$.capture.applyStyle("width", vdb.width+"px");
		this.$.capture.applyStyle("height", vdb.height+"px");
		ctx.drawImage(videoNode, 0, 0, 300, 150);
	}
});
