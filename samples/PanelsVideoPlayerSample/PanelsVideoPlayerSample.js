enyo.kind({
	name: "moon.sample.PanelsVideoPlayerSample",
	classes: "moon enyo-fit enyo-unselectable",
	published: {
		server: "http://media.w3.org/2010/05/sintel/",
		// server: "http://10.195.248.113:8080/files/",
		// server: "http://192.168.56.101/files/",
		fileName: "trailer",
		fileExt: "mp4"
	},
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

				{name:"videoSampler", kind: "moon.sample.VideoPlayerSample", ontap: "requestFullScreen", style: "width: 720px; margin-top: 40px;z-index:10;"},
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
	create: function() {
		this.inherited(arguments);
		this.$.videoSampler.$.player.$.video.applyStyle("width", "720px");
	},
	next: function(inSender, inEvent) {
		this.updateCanvas(this.$.videoSampler.$.player.$.video.hasNode());
		this.$.panels.next();
		return true;
	},
	webCounter: function(inSender, inEvent) {
		this.setServer("http://media.w3.org/2010/05/video/");
		this.setFileName("movie_300");
		this.setFileExt("mp4");
		this.$.pickerExt.setSelectedIndex(0);
		this.movieChange();
		return true;
	},
	webMovieBunny: function(inSender, inEvent) {
		this.setServer("http://media.w3.org/2010/05/bunny/");
		this.setFileName("movie");
		this.setFileExt("mp4");
		this.$.pickerExt.setSelectedIndex(0);
		this.movieChange();
		return true;
	},
	webMovieSintel: function(inSender, inEvent) {
		this.setServer("http://media.w3.org/2010/05/sintel/");
		this.setFileName("trailer");
		this.setFileExt("mp4");
		this.$.pickerExt.setSelectedIndex(0);
		this.movieChange();
		return true;
	},
	changed: function(inSender, inEvent) {
		this.setFileExt(inEvent.content);
		this.movieChange();
	},
	movieChange: function() {
		this.$.videoSampler.$.player.$.video.setSrc(this.server + this.fileName + "." + this.fileExt);
		this.$.videoSampler.$.player.$.video.applyStyle("width", "720px");
		this.$.videoSampler.$.player.$.video.setAutoplay(true);
	},
	requestFullScreen: function(inSender, inEvent) {
		if(inEvent.originator.ontap=="closeFullscreen") {
			if(this.$.videoSampler.$.player.getFullScreen()) {	
				this.$.videoSampler.$.player.$.video.applyStyle("width", "720px");
		//		this.$.panels.applyStyle("opacity", 1);	
		//		this.applyStyle("background-color", "#ededed");
				this.$.videoSampler.$.player.toggleFullscreen();
			} 
		}
		if(inEvent.originator.ontap=="toggleFullscreen") {
			this.$.videoSampler.$.player.$.video.applyStyle("width", "auto");
		//	this.$.panels.applyStyle("opacity", 0);	
		//	this.applyStyle("background-color", "black");			
		}
	},
	updateCanvas: function(inNode) {
		var drawingNode = this.$.capture.hasNode();
		var videoNode = this.$.videoSampler.$.player.$.video.hasNode();
		var ctx = drawingNode.getContext("2d");
		var vdb = videoNode.getBoundingClientRect();
		this.$.capture.applyStyle("width", vdb.width+"px");
		this.$.capture.applyStyle("height", vdb.height+"px");
		ctx.drawImage(inNode, 0, 0, 300, 150);
	}
}); 