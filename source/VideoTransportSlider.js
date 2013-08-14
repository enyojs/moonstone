/**
	_moon.VideoTransportSlider_ extends <a href="#moon.Slider">moon.Slider</a>,
	adding specialized behavior related to video playback.

		{kind: "moon.VideoTransportSlider", value: 30}

	The _onChanging_ event is fired while the control knob is being dragged, and
	the _onChange_ event is fired when the position is set, either by finishing a
	drag or by tapping the bar.
*/
enyo.kind({
	name: "moon.VideoTransportSlider",
	kind: "moon.Slider",
	classes: "moon-slider moon-video-transport-slider",
	published: {
		//** This is start point of slider 
		rangeStart: 0,
		//** This is end point of slider
		rangeEnd: 100,
		//** This flag decide whether using dummy area or not
		haveDummyArea: false,
		//** Tick position decide the margin areas in both side 
		//** This flag control the indicator in the Video Transport Slider
		showTickBar: true,
		showTickText: true
	},
	//* @protected
	
	popupWidth: 300,
	popupHeight: 200,

	handlers: {
		ondown: "down",
		onresize: "resizeHandler",
		onTimeupdate: "timeUpdate",
		onBufferStateChanged: "progressUpdate"
	},
	events: {
		onSeek: "",
		onSeekStart: "",
		onSeekFinish: ""
	},
	moreComponents: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{name: "tapArea", classes: "moon-slider-taparea video-transport"},
		{name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", classes: "moon-slider-knob video-transport"},
		{name: "leftIndicator", classes: "moon-slider-indicator-wrapper start", components: [
			{name: "beginTickBar", classes: "moon-indicator-bar"},
			{name: "beginTickText", classes: "moon-indicator-text", content: "00:00"}
		]},
		{name: "rightIndicator", classes: "moon-slider-indicator-wrapper end", components: [
			{name: "endTickBar", classes: "moon-indicator-bar"},
			{name: "endTickText", classes: "moon-indicator-text", content: "00:00"}
		]},
		{kind: "enyo.Popup", name: "popup", classes: "moon-slider-popup above", components: [
			{classes: "moon-slider-popup-wrapper", components: [
				{tag: "canvas", name: "drawing", classes: "moon-slider-popup-canvas"},
				{name: "popupLabel", classes: "moon-slider-popup-label"}
			]}
		]}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.isFixed = false; // Do not change 
		this.showTickTextChanged();
		this.showTickBarChanged();
	},
	resizeHandler: function() {
		this.updateSliderRange(this.isFixed);
	},
	updateSliderRange: function(fixedShape) {
		if(fixedShape)
		{	// Only For VisD
			var width = window.innerWidth-40; 
			this.dummyAreaPixel = 120;
			this.beginTickPos = (this.dummyAreaPixel/width)*100;
			this.endTickPos = ((width-this.dummyAreaPixel)/width)*100;
			this.$.leftIndicator.addRemoveClass("rate", false);
			this.$.rightIndicator.addRemoveClass("rate", false);
			this.$.leftIndicator.addRemoveClass("pixe", true);
			this.$.rightIndicator.addRemoveClass("pixe", true);
		} else {
			this.beginTickPos = (this.max-this.min)*0.05;
			this.endTickPos = (this.max-this.min)*0.95;
			this.$.leftIndicator.addRemoveClass("rate", true);
			this.$.rightIndicator.addRemoveClass("rate", true);
			this.$.leftIndicator.addRemoveClass("pixe", false);
			this.$.rightIndicator.addRemoveClass("pixe", false);
		}	
		if(this.haveDummyArea) {
			this.setRangeStart(this.beginTickPos);
			this.setRangeEnd(this.endTickPos);
		}
		this.updateKnobPosition(this.value);
	},
	setRangeStart: function(inValue) {
		this.rangeStart = this.clampValue(this.getMin(), this.getMax(), inValue);
		this.rangeStartChanged();
	},
	setRangeEnd: function(inValue) {
		this.rangeEnd = this.clampValue(this.getMin(), this.getMax(), inValue);
		this.rangeEndChanged();	
	},
	showTickTextChanged: function() {
		this.$.beginTickText.addRemoveClass("hide", !this.getShowTickText());
		this.$.endTickText.addRemoveClass("hide", !this.getShowTickText());
	},
	showTickBarChanged: function() {
		if(this.haveDummyArea) {
			this.showTickBar = true;
		}
		this.$.beginTickBar.addRemoveClass("hide", !this.getShowTickBar());
		this.$.endTickBar.addRemoveClass("hide", !this.getShowTickBar());
	},
	rangeStartChanged: function() {
		this.updateInternalProperty();
		var p = this._calcPercent(this.rangeStart);
		this.$.bar.applyStyle("margin-left", p + "%");
		this.$.bgbar.applyStyle("margin-left", p + "%");
	},
	rangeEndChanged: function() {
		this.updateInternalProperty();
	},
	updateInternalProperty: function() {
		this.updateScale();
		this.progressChanged();
		this.bgProgressChanged();
	},
	//** hiden variable, scaleFactor is generated when create this
	updateScale: function() {
		this.scaleFactor = (this.rangeEnd-this.rangeStart)/(this.max-this.min);
	},
	// 
	calcPercent: function(inValue) {
		return (this.calcRatio(inValue) * 100) * this.scaleFactor;
	},
	// 
	_calcPercent: function(inValue) {
		return this.calcRatio(inValue) * 100;
	},
	updateKnobPosition: function(inValue) {
		var p = this._calcPercent(inValue);
		var slider = this.inverseToSlider(p);
		this.$.knob.applyStyle("left", slider + "%");
		this.$.popup.applyStyle("left", slider + "%");

		var label = "";
		if (typeof ilib !== "undefined") {
			label = this._nf.format(Math.round(p));
		}
		else {
			label = Math.round(p) + "%";
		}
		if(this.currentTime !== undefined) {
			this.$.popupLabel.setContent(this.formatTime(this.currentTime));
		}
		this.updatePopupPosition();
	},
	inverseToSlider: function(inPercent) {
		var oValue = this.scaleFactor * inPercent + this._calcPercent(this.rangeStart);
		return oValue;
	},
	transformToVideo: function(oValue) {
		var iValue = (oValue - this.rangeStart) / this.scaleFactor;
		return iValue;
	},
	tap: function(inSender, inEvent) {
		return false;
	},
	//* If user presses on _this.$.tapArea_, seek to that point
	down: function(inSender, inEvent) {
		var v = this.calcKnobPosition(inEvent);
		if( this.haveDummyArea && (v < this.beginTickPos || v > this.endTickPos) ) {
			// TODO : action in dummy area
		} else {
			if (inSender === this.$.tapArea) {
				v = this.transformToVideo(v);
				this.sendSeekEvent(v);
			}
		}
		return true;
	},
	//* If dragstart, bubble _onSeekStart_ event
	dragstart: function(inSender, inEvent) {
		var v = this.calcKnobPosition(inEvent);
		if( this.haveDummyArea && (v < this.beginTickPos || v > this.endTickPos) ) {
			// TODO : action in dummy area
			this.dummyAction = true;
		} else {
			var dragstart = this.inherited(arguments);
			if (dragstart) {
				this.doSeekStart();
			}
			this.dummyAction = false;
		}
	},
	//* If drag, bubble _onSeek_ event, and override parent drag handler
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			var v = this.calcKnobPosition(inEvent);

			if(this.haveDummyArea && (v < this.beginTickPos || v > this.endTickPos) ) {
				// TODO : action in dummy area
			} else {
				v = this.transformToVideo(v);
				if (this.constrainToBgProgress === true) {
					v = (this.increment) ? this.calcConstrainedIncrement(v) : v;
					var ev = this.bgProgress + (v-this.bgProgress)*0.4;
					v = this.clampValue(this.min, this.bgProgress, v);
					this.elasticFrom = (this.elasticEffect === false || this.bgProgress > v) ? v : ev;
					this.elasticTo = v;
				} else {
					v = (this.increment) ? this.calcIncrement(v) : v;
					v = this.clampValue(this.min, this.max, v);
					this.elasticFrom = this.elasticTo = v;
				}

				this.updateKnobPosition(this.elasticFrom);

				if (this.lockBar) {
					this.setProgress(v);
					this.sendChangingEvent({value: v});
					this.throttleJob("updateCanvas", this.bindSafely(function() { this.sendSeekEvent(v); }), 200);
				}
			}
			return true;
		}
	},
	//* If dragfinish, bubble _onSeecFinish_ event, and override parent dragfinish handler
	dragfinish: function(inSender, inEvent) {
		if (this.disabled) {
			return;
		}
		if(!this.dummyAction) {
			var v = this.calcKnobPosition(inEvent);
			
			if(this.haveDummyArea && v <= this.beginTickPos) {
				v = this.rangeStart;
			}
			if(this.haveDummyArea && v >= this.endTickPos ) {
				v = this.rangeEnd;
			}
			v = this.transformToVideo(v);
			var z = this.elasticTo;
			if (this.constrainToBgProgress === true) {
				z = (this.increment) ? this.calcConstrainedIncrement(z) : z;
				this.animateTo(this.elasticFrom, z);
				v = z;
			} else {
				v = (this.increment) ? this.calcIncrement(v) : v;
				this._setValue(v);
			}
			inEvent.preventTap();
			this.hideKnobStatus();
			this.doSeekFinish({value: v});
		}
		this.$.knob.removeClass("active");
		this.dummyAction = false;
		this.dragging = false;
		return true;
	},
	//* Send seek event, inValue is in video domain
	sendSeekEvent: function(inValue) {
		this.doSeek({value: inValue});
	},
	//* When the time updates, update buffered progress, canvas, video currentTime and duration 
	timeUpdate: function(inSender, inEvent) {
		this.triggerCanvasUpdate(inEvent.srcElement);
		this._currentTime = inSender._currentTime;
		this._duration = inSender._duration;
		this.currentTime = new Date(this._currentTime * 1000);
		this.duration = new Date(this._duration * 1000);
		this.$.endTickText.setContent(this.formatTime(this.duration));
	},
	progressUpdate: function(inSender, inEvent) {
		this.updateBufferedProgress(inEvent.srcElement);
	},
	//* Update _this.bgProgress_ to reflect video buffered progress
	updateBufferedProgress: function(inNode) {
		var bufferData = inNode.buffered,
			numberOfBuffers = bufferData.length,
			bufferedPercentage = 0,
			highestBufferPoint = 0,
			duration = inNode.duration || 0,
			endPoint = 0,
			i
		;
		
		if (duration === 0) {
			return;
		}
		
		// Find furthest along buffer end point and use that (only supporting one buffer range for now)
		for (i = 0; i < numberOfBuffers; i++) {
			endPoint = bufferData.end(i);
			highestBufferPoint = (endPoint > highestBufferPoint) ? endPoint : highestBufferPoint;
		}
		bufferedPercentage = highestBufferPoint * 100 / inNode.duration;
		this.setBgProgress(bufferedPercentage);
	},
	//* Kickoff canvas update when video time changes
	triggerCanvasUpdate: function(inNode) {
		if (!this.dragging) {
			return;
		}
		// Add delay here to account for pause in dragging
		setTimeout(enyo.bind(this, function() { this.updateCanvas(inNode); }), 200);
	},
	//* Draw copy of _inNode_ to _this.$.drawing_
	updateCanvas: function(inNode) {
		var drawingNode = this.$.drawing.hasNode(),
			db = drawingNode.getBoundingClientRect(),
			ctx = drawingNode.getContext("2d")
		;
		// draw video preview thumbnail
		ctx.drawImage(inNode, 0, 0, db.width, db.height);
	},
	//* Properly format time
	formatTime: function(inValue) {
		var inMinutes = this._formatTime(inValue.getMinutes());
		var inSeconds = this._formatTime(inValue.getSeconds());
		return inMinutes + ":" + inSeconds;
	},
	//* Format time helper
	_formatTime: function(inValue) {
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	}
});
