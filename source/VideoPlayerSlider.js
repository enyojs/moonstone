/**
	_moon.VideoPlayerSlider_ is a control that presents a range of selection options in the
	form of a horizontal slider with a control knob. The knob may be tapped and
	dragged to the desired location.

		{kind: "moon.VideoPlayerSlider", value: 30}

	The _onChanging_ event is fired while the control knob is being dragged, and
	the _onChange_ event is fired when the position is set, either by finishing a
	drag or by tapping the bar.
*/
enyo.kind({
	name: "moon.VideoPlayerSlider",
	kind: "moon.Slider",
	classes: "moon-videoplayer-slider",
	// spotlight: true,
	published: {
		//* enyo.Video object
		video: null
	},
	handlers: {
		onenter: "onEnterSlider", 
		onleave: "onLeaveSlider"
	},
	popupComponents: [
		{kind: "enyo.Popup", name: "popup", classes: "moon-videoplayer-slider-popup ", captureEvents: false, components: [
			{tag: "canvas", name: "drawing", attributes: { width: 340, height: 270 }},
			{name: "popupLabel", showing: false}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.videoChanged();
		this.popupColor = "#323232";
		this.$.knob.setShowing(false);
	},
	videoChanged: function() {
		if (this.video !== null && this.video.container) {
			if (this.$["bgScreen"] !== undefined) {
				this.$["bgScreen"].destroy();
			}
			this.video.container.createComponent({	name:"bgScreen",
									tag: "canvas", 
									showing: false, 
									classes: "moon-videoplayer-screen",
									style: "margin-top:0px;margin-left:0px;"}, {owner: this});
		}
	},

	//* @public
	
	updatePopupPosition: function() {
		var inControl = this.$.popup;
		if (!inControl.hasNode().getBoundingClientRect) {
			return;
		}
		this.inherited(arguments);
		var ctx = this.$.drawing.hasNode().getContext("2d");
		if (this.video !== null) {
			ctx.drawImage(this.video.hasNode() , 10, 10, 320, 240);
		}
	},
	dragstart: function(inSender, inEvent) {
		if (this.video !== null && this.video.hasNode()) {
			this.paused = this.video.isPaused();
			this.video.pause();

			var b = this.video.getBounds();
			// var bs = this.video.container.$.bgScreen;
			var bs = this.$.bgScreen;
			// this.log(bs);
			bs.setAttribute("width", b.width);
			bs.setAttribute("height", b.height);
			bs.setBounds(b);
	
			var ctx = bs.hasNode().getContext("2d");
			ctx.drawImage(this.video.hasNode() , 0, 0, b.width, b.height);

			bs.setShowing(true);
		}

		this.inherited(arguments);
	},
	drag: function(inSender, inEvent) {
		if (this.dragging && this.video.hasNode()) {
			var v = this.calcKnobPosition(inEvent);
			v = this.clampValue(this.min, this.max, v);
			var p = this.calcPercent(v);
			var d = this.video.hasNode().duration;

			var t = d * p / 100;
			this.video.setCurrentTime(t);
		}

		this.inherited(arguments);
	},
	dragfinish: function(inSender, inEvent) {
		this.inherited(arguments);

		if (this.video !== null) {
			// var bs = this.video.container.$.bgScreen;
			var bs = this.$.bgScreen;
			if (!this.paused) this.video.play();
			bs.setShowing(false);
		}
	},
	tap: function(inSender, inEvent) {
		this.inherited(arguments);

		if (this.tappable && !this.disabled) {
			var v = this.calcKnobPosition(inEvent);
			v = this.clampValue(this.min, this.max, v);
			var p = this.calcPercent(v);
			var d = this.video.hasNode().duration;

			var t = d * p / 100;
			this.video.setCurrentTime(t);
		}
	},
	//* @public

	//* @protected
	showKnobStatus: function(inSender, inEvent) {
		if (!this.noPopup && this.video !== null) {
			var ctx = this.$.drawing.hasNode().getContext("2d");
			ctx.drawImage(this.video.hasNode() , 10, 10, 320, 240);
		}
		this.inherited(arguments);
	},
	drawToCanvas: function(bgColor) {
		var h = 270; // height total
		var hb = h - 10; // height bubble
		var hbc = (hb-1)/2; // height of bubble's center
		var w = 340; // width total
		var wre = 46; // width's right edge
		var wle = 16; // width's left edge
		var r = 20; // radius

		var ctx = this.$.drawing.hasNode().getContext("2d");

		// Set styles. Default color is knob's color
		ctx.fillStyle = bgColor || enyo.dom.getComputedStyleValue(this.$.knob.hasNode(), "background-color");

		// Draw shape with arrow on bottom-left
		ctx.moveTo(1, h);
		ctx.arcTo(1, hb, 39, hb, 8);
		ctx.lineTo(wre, hb);
		ctx.arcTo(w, hb, w, hbc, r);
		ctx.arcTo(w, 1, wre, 1, r);
		ctx.lineTo(wle, 1);
		ctx.arcTo(1, 1, 1, hbc, r);
		ctx.lineTo(1, h);
		ctx.fill();
		return false;
	},
	onEnterSlider: function(inSender, inEvent) {
		if (!this.dragging && this.$.knob.hasNode()) {
			this.$.knob.show();
		}
	},
	onLeaveSlider: function(inSender, inEvent) {
		if (!this.dragging && this.$.knob.hasNode()) {
			this.$.knob.setShowing(false);
		}
	},
});
