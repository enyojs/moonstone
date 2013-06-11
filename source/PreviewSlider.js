/**
	_moon.Slider_ is a control that presents a range of selection options in the
	form of a horizontal slider with a control knob. The knob may be tapped and
	dragged to the desired location.

		{kind: "moon.Slider", value: 30}

	The _onChanging_ event is fired while the control knob is being dragged, and
	the _onChange_ event is fired when the position is set, either by finishing a
	drag or by tapping the bar.
*/
enyo.kind({
	name: "moon.PreviewSlider",
	kind: "moon.Slider",
	//classes: "moon-preview-slider",
	// spotlight: true,
	published: {
		//* enyo.Video object
		video: null
	},
	// events: {
	// 	//* Fires when bar position is set. The _value_ property contains the
	// 	//* new position.
	// 	onChange: "",
	// 	//* Fires while control knob is being dragged. The _value_ property
	// 	//* contains the current position.
	// 	onChanging: "",
	// 	//* Fires when animation to a position finishes.
	// 	onAnimateFinish: ""
	// },
	//* @protected
	// handlers: {
	// 	ondragstart: "dragstart",
	// 	ondrag: "drag",
	// 	ondragfinish: "dragfinish",
	// 	onSpotlightFocus: "spotFocus",
	// 	onSpotlightSelect: "spotSelect",
	// 	onSpotlightBlur: "spotBlur",
	// 	onSpotlightLeft: "spotLeft",
	// 	onSpotlightRight: "spotRight"
	// },
	// moreComponents: [
	// 	{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
	// 	{classes: "moon-slider-taparea"},
	// 	{name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", classes: "moon-slider-knob"},
	// 	{kind: "enyo.Popup", name: "popup", classes: "moon-slider-popup above", components: [
	// 		{tag: "canvas", name: "drawing", attributes: { width: 62, height: 52 }},
	// 		{name: "popupLabel", classes: "moon-slider-popup-label"}
	// 	]}
	// ],
	popupComponents: [
		{kind: "enyo.Popup", name: "popup", classes: "moon-preview-slider-popup above", captureEvents: false, components: [
			{tag: "canvas", name: "drawing", attributes: { width: 340, height: 270 }},
			{name: "popupLabel", showing: false}
		]},
		// {name:"bgScreen", tag: "canvas", showing: false, classes: "moon-preview-screen", style: "top: 0px;"}
	],
	create: function() {
		this.inherited(arguments);
		
		this.videoChanged();
		this.popupColor = "#323232";
		// this.$.popupLabel.hide();
		// this.$.popup.
		// this.$.drawing.setAttribute("width", 320);
		// this.$.drawing.setAttribute("height", 240);

		// this.$.popup.setShowing(true);
	},
	videoChanged: function() {
		if (this.video !== null && this.video.container) {
			if (this.$["bgScreen"] !== undefined) {
				this.$["bgScreen"].destroy();
			}
			// this.video.container.$.previewContainer.createComponent({	name:"bgScreen",
			// 						tag: "canvas",
			// 						showing: false,
			// 						classes: "moon-preview-screen",
			// 						// controlParentName: "videoPlayback",
			// 						container: this.video.container,
			// 						parent: this.video.container,
			// 						style: "margin-top:0px;margin-left:0px;"}, {owner: this});

			// this.video.container.$.previewContainer.createComponent({	name:"bgScreen",
			// 						tag: "canvas", 
			// 						showing: false, 	
			// 						classes: "moon-preview-screen",
			// 						// controlParentName: "videoPlayback",
			// 						container: this.video.container,
			// 						parent: this.video.container,
			// 						style: "margin-top:0px;margin-left:0px;"}, {owner: this});

			this.video.container.createComponent({	name:"bgScreen",
									tag: "canvas", 
									showing: false, 
									classes: "moon-preview-screen",
									style: "margin-top:0px;margin-left:0px;"}, {owner: this});
			
			// this.video.applyStyle("z-index", -2);
		}
	},

	//* @public
	// video: null,
	// setupVideo: function(inVideo) {
	// 	this.video = inVideo;
	// },
	// animatingTo: null,
	// create: function() {
	// 	this.inherited(arguments);
	// 	this.createComponents(this.moreComponents);
	// 	this.initValue();
	// 	this.disabledChanged();
	// },
	// rendered: function() {
	// 	this.inherited(arguments);
	// 	this.drawToCanvas(this.popupColor);
	// },
	// disabledChanged: function() {
	// 	this.addRemoveClass("disabled", this.disabled);
	// 	this.$.knob.addRemoveClass("disabled", this.disabled);
	// 	this.setTappable(!this.disabled);
	// },
	//* Prep value at create time
	// initValue: function() {
	// 	this.updateKnobPosition(this.calcPercent(this.getValue()));
	// 	if (this.lockBar) {
	// 		this.setProgress(this.getValue());
	// 	}
	// },
	// setValue: function(inValue) {
	// 	if (this.animate) {
	// 		this.animateTo(this.getValue(), inValue);
	// 	} else {
	// 		this._setValue(inValue);
	// 	}
	// },
	// _setValue: function(inValue) {
	// 	var v = this.clampValue(this.min, this.max, inValue);

	// 	// If no change, return
	// 	if (v === this.value) {
	// 		return;
	// 	}

	// 	this.value = v;
	// 	this.updateKnobPosition(this.calcPercent(this.value));

	// 	if (this.lockBar) {
	// 		this.setProgress(this.value);
	// 	}

	// 	this.sendChangeEvent({value: this.getValue()});
	// },
	// getValue: function() {
	// 	return (this.animatingTo !== null) ? this.animatingTo : this.value;
	// },
	// updateKnobPosition: function(inPercent) {
	// 	this.$.knob.applyStyle("left", inPercent + "%");
	// 	this.$.popup.applyStyle("left", inPercent + "%");
	// 	this.$.popupLabel.setContent( Math.round(inPercent) + "%" );
	// 	this.updatePopupPosition();
	// },
	updatePopupPosition: function() {
		var inControl = this.$.popup;
		if (!inControl.hasNode().getBoundingClientRect) {
			return;
		}
/*		var hFlip = false;
		// popup bounds
		var pb = inControl.hasNode().getBoundingClientRect();
		// container bounds
		var cb = this.container.hasNode().getBoundingClientRect();
		// knob bounds
		var kb = this.$.knob.hasNode().getBoundingClientRect();

		// when the popup's right edge is out of the window, adjust to the left
		if ( (kb.left + (kb.width/2) + pb.width) > cb.right ) {
			inControl.applyStyle("left", (kb.left - pb.width) + "px");
			hFlip = true;
		}
		inControl.addRemoveClass("moon-slider-popup-flip-h", hFlip);
		// this.$.popupLabel.addRemoveClass("moon-slider-popup-flip-h", hFlip);
*/
		this.inherited(arguments);
		var ctx = this.$.drawing.hasNode().getContext("2d");
		if (this.video !== null) {
			ctx.drawImage(this.video.hasNode() , 10, 10, 320, 240);
		}
	},
	// calcKnobPosition: function(inEvent) {
	// 	var x = inEvent.clientX - this.hasNode().getBoundingClientRect().left;
	// 	return (x / this.getBounds().width) * (this.max - this.min) + this.min;
	// },
	// dragstart: function(inSender, inEvent) {
	// 	if (this.disabled) {
	// 		return;	// return nothing
	// 	}

	// 	if (inEvent.horizontal) {
	// 		inEvent.preventDefault();
	// 		this.dragging = true;
	// 		this.$.knob.addClass("active");
	// 		this.showKnobStatus();
	// 		return true;
	// 	}
	// },
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
	// //* @public
	// //* Animates to the given value.
	// animateTo: function(inStartValue, inEndValue) {
	// 	this.animatingTo = inEndValue;

	// 	this.$.animator.play({
	// 		startValue: inStartValue,
	// 		endValue: inEndValue,
	// 		node: this.hasNode()
	// 	});
	// },

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

	// changeDelayMS: 50,
	// sendChangeEvent: function(inEventData) {
	// 	this.throttleJob("sliderChange", function() { this.doChange(inEventData); }, this.changeDelayMS);
	// },
	// sendChangingEvent: function(inEventData) {
	// 	this.throttleJob("sliderChanging", function() { this.doChanging(inEventData); }, this.changeDelayMS);
	// }
});
