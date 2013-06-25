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
	classes: "moon-slider moon-video-player-slider",
	//* @protected
	popupWidth: 300,
	popupHeight: 200,
	scaleFactor: 1,
	dummyAction: false,
	published: {
		//** This is start point of slider 
		rangeStart: 0,
		//** This is end point of slider
		rangeEnd: 100,
		//** This flag decide the slider draw  
		syncTick: true,
		//** Tick position decide the margin areas in both side 
		beginTickPos: 10,
		endTickPos: 90,
		//** This flag control the indicator in the Video Transport Slider
		showTickText: true,
		showTickBar: true
	},
	handlers: {
		onTimeupdate: "timeUpdate",
		ondown: "down"
	},
	events: {
		onSeekStart: "",
		onSeek: "",
		onSeekFinish: ""
	},
	moreComponents: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{style: "z-index: 5;", name: "tapArea", classes: "moon-slider-taparea"},
		{style: "z-index: 3;", name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", classes: "moon-slider-knob"},
		{classes: "moon-slider-indicator-wrapper start", components: [
			{name: "beginTickBar", classes: "moon-indicator-bar"},
			{name: "beginTickText", classes: "moon-indicator-text", content: "00:00 PM"}
		]},
		{classes: "moon-slider-indicator-wrapper end", components: [
			{name: "endTickBar", classes: "moon-indicator-bar"},
			{name: "endTickText", classes: "moon-indicator-text", content: "01:00 PM"}
		]},
		{kind: "enyo.Popup", name: "popup", classes: "moon-slider-popup above", components: [
			{tag: "canvas", name: "drawing"},
			{name: "popupLabel", classes: "moon-slider-popup-label"}
		]}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.initVideoSlider();
	},
	initVideoSlider: function() {
		this.setRangeStart(this.getBeginTickPos());
		this.setRangeEnd(this.getEndTickPos());
		this.rangeStartChanged();
		this.rangeEndChanged();
		this.showTickTextChanged();
		this.showTickBarChanged();
		this.setConstrainToBgProgress(true);
		this.setElasticEffect(false);
	},
	showTickTextChanged: function() {
		this.$.beginTickText.addRemoveClass("hide", !this.getShowTickText());
		this.$.endTickText.addRemoveClass("hide", !this.getShowTickText());
	},
	showTickBarChanged: function() {
		this.$.beginTickBar.addRemoveClass("hide", !this.getShowTickBar());
		this.$.endTickBar.addRemoveClass("hide", !this.getShowTickBar());
	},
	updateScale: function() {
		this.scaleFactor= (this.rangeEnd-this.rangeStart)/100;
	},
	setRangeStart: function(inValue) {
		if(this.getSyncTick() === true) {
			this.rangeStart = this.beginTickPos;
		} else {
			this.rangeStart = inValue;
		}
	},
	setRangeEnd: function(inValue) {
		if(this.getSyncTick()) {
			this.rangeEnd = this.endTickPos;
		} else {
			this.rangeEnd = inValue;
		}
	},
	updateOwnProperty: function() {
		this.updateScale();
		this.bgProgressChanged();
		this.progressChanged();
	},
	rangeStartChanged: function() {
		if((this.rangeEnd -this.rangeStart) < 1) {
			this.setRangeStart(this.rangeEnd - 1);
			return true;
		}
		this.$.bgbar.applyStyle("margin-left", this.rangeStart + "%");
		this.$.bar.applyStyle("margin-left", this.rangeStart + "%");
		this.updateOwnProperty();
	},
	rangeEndChanged: function() {
		if((this.rangeEnd - this.getRangeStart()) < 1) {
			this.setRangeEnd(this.getRangeStart()+1);
			return true;
		}
		this.updateOwnProperty();
	},
	calcPercent: function(inValue) {
		return this.calcRatio(inValue) * this.scaleFactor * 100;
	},
	updateKnobPosition: function(inPercent) {
		var v = inPercent/this.scaleFactor;
		var slider = this.inverseToSlider(v);
		this.$.knob.applyStyle("left", slider + "%");
		this.$.popup.applyStyle("left", slider + "%");

		var label = "";
		if (typeof ilib !== "undefined") {
			label = this._nf.format(Math.round(v));
		}
		else {
			label = Math.round(v) + "%";
		}
		// have to change video time
		this.$.popupLabel.setContent(label);
		this.updatePopupPosition();
	},
	inverseToSlider: function(iValue) {
		var oValue = this.scaleFactor * iValue + this.rangeStart;
		return oValue;
	},
	transformToVideo: function(oValue) {
		var iValue = (oValue - this.rangeStart) / this.scaleFactor;
		return iValue;
	},
	tap: function(inSender, inEvent) {
		if (this.tappable && !this.disabled) {
			return true;
		}
	},
	//* If user presses on _this.$.tapArea_, seek to that point
	down: function(inSender, inEvent) {
		var v = this.calcKnobPosition(inEvent);
		if( v < this.beginTickPos || v > this.endTickPos ) {
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
		if( v < this.beginTickPos || v > this.endTickPos ) {
			// TODO : action in dummy area
			this.dummyAction = true;
		} else {
			var dragstart = this.inherited(arguments);
			if (dragstart) {
				this.doSeekStart();
			}
		}
	},
	//* If drag, bubble _onSeek_ event, and override parent drag handler
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			var v = this.calcKnobPosition(inEvent);
			if(v < this.beginTickPos || v > this.endTickPos ) {
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

				var p = this.calcPercent(this.elasticFrom);
				this.updateKnobPosition(p);

				if (this.lockBar) {
					this.setProgress(v);
				}

				this.sendChangingEvent({value: v});
				this.throttleJob("updateCanvas", this.bindSafely(function() { this.sendSeekEvent(v); }), 200);
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
			if(v < this.beginTickPos) {
				v = this.rangeStart;
			}
			if(v > this.endTickPos ) {
				v = this.rangeEnd;
			}
			var z = this.elasticTo;
			if (this.constrainToBgProgress === true) {
				z = (this.increment) ? this.calcConstrainedIncrement(z) : z;
				this.animateTo(this.elasticFrom, z);
				v = z;
			} else {
				v = this.transformToVideo(v);
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
	//* When the time updates, update buffered progress and canvas
	timeUpdate: function(inSender, inEvent) {
		this.triggerCanvasUpdate(inEvent.srcElement);
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
	}
});
