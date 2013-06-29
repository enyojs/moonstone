enyo.kind({
	name: "moon.sample.PanelsVideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{name: "panels", kind: "moon.Panels", pattern: "activity", classes: "enyo-fit", components: [
			{kind: "moon.Panel", title: "Intro", components: [
				{kind: "moon.Divider", content: "Select video content"},
				{kind: "Group", style: "margin-top: 20px;", onActivate: "groupChanged", components: [
					{kind: "moon.SelectableItem", content: "Counter", onchange: "webCounter", checked: true}, 
					{kind: "moon.SelectableItem", content: "Bunny", onchange: "webMovieBunny"},
					{kind: "moon.SelectableItem", content: "Sintel", onchange: "webMovieSintel"}
				]}
			]},
			{kind: "moon.Panel", joinToPrev: true, title: "Workspace", layoutKind: "FittableColumnsLayout", components: [
				{
					components: [
						{name: "player", kind: "moon.VideoPlayer", style: "width: 720px;",
							sourceComponents: [
								{src: "http://media.w3.org/2010/05/video/movie_300.mp4",  type: "video/mp4"},
								{src: "http://media.w3.org/2010/05/video/movie_300.webm", type: "video/webm"},
								{src: "http://media.w3.org/2010/05/video/movie_300.ogv",  type: "video/ogg"},
								{src: "http://media.w3.org/2010/05/bunny/movie.mp4",  type: "video/mp4"},
								{src: "http://media.w3.org/2010/05/bunny/movie.webm", type: "video/webm"},
								{src: "http://media.w3.org/2010/05/bunny/movie.ogv",  type: "video/ogg"},
								{src: "http://media.w3.org/2010/05/sintel/trailer.mp4",  type: "video/mp4"},
								{src: "http://media.w3.org/2010/05/sintel/trailer.webm", type: "video/webm"},
								{src: "http://media.w3.org/2010/05/sintel/trailer.ogv",  type: "video/ogg"}
							],
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
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-placeholder.png"},
								{kind: "moon.IconButton", src: "$lib/moonstone/images/icon-fullscreenbutton.png", ontap: "closeFullscreen"}
							]
						}
					]
				},
				{fit: true, layoutKind: "FittableRowsLayout", components: [
					{kind: "moon.Item", style: "float: right;", content: "Capture", ontap: "next"},
					{kind: "moon.Divider", style: "margin-top:40px", content:"Select Video Format"},
					{name:"pickerExt", kind:"moon.SimplePicker", onChange:"changed", components: [
						{content:"mp4"},
						{content:"webm"},
						{content:"ogv"}
					]}
				]}
				]},
				{kind: "moon.Panel", title: "Result", components: [
					{tag: "canvas", name: "capture"}
				]}
			]}
		],
		next: function(inSender, inEvent) {
			this.updateCanvas();
			this.$.panels.next();
			return true;
		},
		webCounter: function(inSender, inEvent) {
			this.$.pickerExt.setSelectedIndex(0);
			return true;
		},
		webMovieBunny: function(inSender, inEvent) {
			this.$.pickerExt.setSelectedIndex(0);
			return true;
		},
		webMovieSintel: function(inSender, inEvent) {
			this.$.pickerExt.setSelectedIndex(0);
			return true;
		},
		changed: function(inSender, inEvent) {
			// this.$.player.setSrc(this.$.player.sources[7]);
		},
		closeFullscreen: function(inSender, inEvent) {
			this.$.player.toggleFullscreen(inSender, inEvent);
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
	}
); 