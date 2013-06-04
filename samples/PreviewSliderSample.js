enyo.kind({
	name: "moon.sample.PreviewSliderSample",
	classes: "moon enyo-unselectable moon-scenepreview-sample",
	kind: "FittableRows",
	// handlers: {
	// 	ontap: "sliderChanged"
	// },
	components: [
		{kind: "enyo.Spotlight"},
		// {name: "video", kind: "Video", src: "http://www.w3schools.com/html/movie.mp4", ontimeupdate:"timeupdate"},
		{name: "video", kind: "Video", src: "http://www.w3schools.com/html/mov_bbb.mp4", ontimeupdate:"timeupdate"},
		{name: "slider", kind: "moon.PreviewSlider", value: 25, bgProgress: 35, onChanging: "sliderChanging", onChange: "sliderChanged"}
	],
	timeupdate: function(inSender, inEvent) {
		// this.log(inEvent);
	},
	//* @protected
	create: function() {
		this.inherited(arguments);

		this.$.video.setAttribute("type", "video/mp4");
		this.$.video.setAttribute("width", "800px;");

		this.$.slider.setVideo(this.$.video);
	},
	initComponents: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		// this.$.video.setAttribute("type", "video/mp4");
		// this.$.video.setAttribute("width", "640px;");

		// var b = this.getAbsoluteBounds();
		// var ctx = this.$.previewFull.hasNode().getContext("2d");
		// ctx.drawImage(this.$.video.hasNode() , b.left, b.top, b.width, b.height);
		
	},
	showHandler: function(inSender, inEvent) {
		var b = this.getAbsoluteBounds();
		this.$.previewFull.setAttribute("width", b.width);
		this.$.previewFull.setAttribute("height", b.height);

		var ctxF = this.$.previewFull.hasNode().getContext("2d");
		ctxF.drawImage(this.$.video.hasNode() , b.left, b.top, b.width, b.height);
		// this.$.previewFull.setShowing(true);
		
		var pb = this.$.preview.getAbsoluteBounds();
		// var padding = this.$.preview.container.hasNode() ? enyo.dom.calcPaddingExtents(this.$.preview.container.node) : {left: 0, top: 0};
		var padding = {left: 0, top: 0};

		var ctx = this.$.preview.hasNode().getContext("2d");
		ctx.drawImage(this.$.video.hasNode() , 0, 0, pb.width, pb.height);

		var o = {top: b.top, left: b.left, width: b.width, height: b.height};
		var d = {top: pb.top + padding.top, left: pb.left + padding.left, width: pb.width, height: pb.height};
		// this.$.animator.play({
		// 	startValue: 0,
		// 	endValue: pb.top + padding.top,
		// 	org: o,
		// 	dst: d
		// });

		return true;
	}
});
