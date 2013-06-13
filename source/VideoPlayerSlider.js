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
	// spotlight: "container",
	published: {
		//* enyo.Video object
		video: null
	},
	handlers: {
		onenter: "onEnterSlider", 
		onleave: "onLeaveSlider"
	},
	moreComponents: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{classes: "moon-slider-taparea"},
		{name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", classes: "moon-slider-knob"},
		{kind: "enyo.Popup", name: "popup", classes: "moon-videoplayer-slider-popup above", components: [
			{tag: "canvas", name: "drawing", classes: "moon-videoplayer-slider-popup-canvas"},
			{name: "popupLabel", classes: "moon-videoplayer-slider-popup-label"}
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
	updateKnobPosition: function(inPercent) {
		this.$.knob.applyStyle("left", inPercent + "%");
		this.$.popup.applyStyle("left", inPercent + "%");

		var label = null;
		if (this.video) { 
			var curTime = new Date(this.video.getCurrentTime()*1000);
			label = curTime.getMinutes() + ':' + curTime.getSeconds(); 
		}
		this.$.popupLabel.setContent(label);

		this.updatePopupPosition();
	},
	updatePopupPosition: function() {
		var inControl = this.$.popup;
		if (!inControl.hasNode().getBoundingClientRect) {
			return;
		}
		
		// canvas bounds
		var db = this.$.drawing.hasNode().getBoundingClientRect();
		var ctx = this.$.drawing.hasNode().getContext("2d");

		// popup bounds
		var pb = inControl.hasNode().getBoundingClientRect();
		// container bounds
		var cb = this.container.hasNode().getBoundingClientRect();
		// knob bounds
		var kb = this.$.knob.hasNode().getBoundingClientRect();

		// draw video preview thumbnail
		if (this.video !== null) {
			ctx.drawImage(this.video.hasNode(), 0, 0, db.width, db.height);
		}
		
		// when the popup's left edge is out of the window, adjust to the left
		if ( (kb.left  - pb.width/2) < cb.left ) {
			inControl.applyStyle("left", (kb.left - (kb.width/2)) + "px");
		} else 
		// when the popup's right edge is out of the window, adjust to the left
		if ( (kb.left + (kb.width) + pb.width/2) > cb.right ) {
			inControl.applyStyle("left", (kb.left - (kb.width/2) - pb.width) + "px");
		} else {
			inControl.applyStyle("left", (kb.left - (kb.width/2) - pb.width/2) + "px");
		}
	},
	dragstart: function(inSender, inEvent) {
		if (this.video !== null && this.video.hasNode()) {
			this.paused = this.video.isPaused();
			this.video.pause();

			var b = this.video.getBounds();
			var bs = this.$.bgScreen;
			
			bs.setAttribute("width", b.width);
			bs.setAttribute("height", b.height);
			bs.setBounds(b);
	
			var ctx = bs.hasNode().getContext("2d");
			ctx.drawImage(this.video.hasNode(), 0, 0, b.width, b.height);

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
			var db = this.$.drawing.hasNode().getBoundingClientRect();
			ctx.drawImage(this.video.hasNode() , 0, 0, db.width, db.height);
		}
		this.inherited(arguments);
	},
	drawToCanvas: function(bgColor) {
		return true;
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
