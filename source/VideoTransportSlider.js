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
	spotlight: false,
	classes: "moon-video-transport-slider",
	//* @protected
	published: {
		//** This is start point of slider
		rangeStart: 0,
		//** This is end point of slider
		rangeEnd: 100,
		//** This flag decide the slider draw
		syncTick: true,
		//** This flag decide whether using dummy area or not
		showDummyArea: true,
		//** When true, show label on start and end position
		showTickText: true,
		//** When true, show tick bar on start and end position
		showTickBar: true,
		//** When true, the progress can extend past the hour markers.
		liveMode: false,
		//* CSS classes to apply to bg progressbar
		bgBarClasses: "moon-video-transport-slider-bg-bar",
		//* CSS classes to apply to progressbar
		barClasses: "moon-video-transport-slider-bar-bar",
		//* CSS classes to apply to popup label
		popupLabelClasses: "moon-video-transport-slider-popup-label",
		//* CSS classes to apply to knob
		knobClasses: "moon-video-transport-slider-knob",
		//* CSS classes to apply to tapArea
		tapAreaClasses: "moon-video-transport-slider-taparea",
		//* Color of value popup
		popupColor: "#fff",
		//** Custom Popup width for video player
		popupWidth: 200,
		//* Popup offset in pixels
		popupOffset: 25,
		//** threshold value(percentage) for using animation effect on slider progress change
		smallVariation: 1
	},
	handlers: {
		onTimeupdate: "timeUpdate",
		onresize: "resizeHandler"
	},
	events: {
		onSeekStart: "",
		onSeek: "",
		onSeekFinish: "",
		onEnterTapArea: "",
		onLeaveTapArea: ""
	},
	tickComponents: [
		{classes: "moon-video-transport-slider-indicator-wrapper start", components: [
			{name: "beginTickBar", classes: "moon-video-transport-slider-indicator-bar-left"},
			{name: "beginTickText", classes: "moon-video-transport-slider-indicator-text", content: "00:00"}
		]},
		{classes: "moon-video-transport-slider-indicator-wrapper end", components: [
			{name: "endTickBar", classes: "moon-video-transport-slider-indicator-bar-right"},
			{name: "endTickText", classes: "moon-video-transport-slider-indicator-text", content: "00:00"}
		]}
	],
	popupLabelComponents: [
		{name: "feedback", kind:"moon.VideoFeedback"},
		{name: "popupLabelText"}
	],
	_previewMode: false,

	//* @protected
	create: function() {
		this.inherited(arguments);
		this.$.popup.setAutoDismiss(false);		//* Always showing popup
		this.$.popup.captureEvents = false;		//* Hot fix for bad originator on tap, drag ...
		this.$.tapArea.onmousemove = "preview";
		this.$.tapArea.onenter = "enterTapArea";
		this.$.tapArea.onleave = "leaveTapArea";
		//* Extend components
		this.createTickComponents();
		this.createPopupLabelComponents();
		this.showTickTextChanged();
		this.showTickBarChanged();

		if (window.ilib) {
			this.durfmt = new ilib.DurFmt({length: "medium", style: "clock"});
		}
	},
	createTickComponents: function() {
		this.createComponents(this.tickComponents, {owner: this, addBefore: this.$.tapArea});
	},
	createPopupLabelComponents: function() {
		this.$.popupLabel.createComponents(this.popupLabelComponents, {owner: this});
		this.currentTime = 0;
	},
	enterTapArea: function(inSender, inEvent) {
		this.addClass('visible');
		this.startPreview();
		this.doEnterTapArea(inEvent);
	},
	leaveTapArea: function(inSender, inEvent) {
		this.removeClass('visible');
		this.endPreview();
		this.doLeaveTapArea(inEvent);
	},
	preview: function(inSender, inEvent) {
		var v = this.calcKnobPosition(inEvent);
		if( this.dragging || this.showDummyArea && (v < this.beginTickPos || v > this.endTickPos) ) {
			return;
		}
		this.currentTime = this.transformToVideo(v);
		this._updateKnobPosition(this.currentTime);
	},
	startPreview: function(inSender, inEvent) {
		this._previewMode = true;
		this.$.feedback.setShowing(false);
	},
	endPreview: function(inSender, inEvent) {
		this._previewMode = false;
		this.currentTime = this._currentTime;
		this._updateKnobPosition(this._currentTime);
		if (this.$.feedback.isPersistShowing()) {
			this.$.feedback.setShowing(true);
		}
	},
	isInPreview: function(inSender, inEvent) {
		return this._previewMode;
	},
	resizeHandler: function() {
		this.inherited(arguments);
		this.updateSliderRange();
	},
	updateSliderRange: function() {
		this.beginTickPos = (this.max-this.min)*0.0625;
		this.endTickPos = (this.max-this.min)*0.9375;
		
		if(this.showDummyArea) {
			this.setRangeStart(this.beginTickPos);
			this.setRangeEnd(this.endTickPos);
		} else {
			this.setRangeStart(this.min);
			this.setRangeEnd(this.max);				
		}
		this.updateKnobPosition(this.value);
	},
	setMin: function() {
		this.inherited(arguments);
		this.updateSliderRange();
	},
	setMax: function() {
		this.inherited(arguments);
		this.updateSliderRange();
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
		this.$.beginTickText.setShowing(this.getShowTickText());
		this.$.endTickText.setShowing(this.getShowTickText());
	},
	showTickBarChanged: function() {
		if(this.showDummyArea) {
			this.showTickBar = true;
		}
		this.$.beginTickBar.setShowing(this.getShowTickBar());
		this.$.endTickBar.setShowing(this.getShowTickBar());
	},
	rangeStartChanged: function() {
		this.updateInternalProperty();
		var p = this._calcPercent(this.rangeStart), 
			property = "margin-left";
		if (this.liveMode) {
			property = "padding-left";
		}
		this.$.bar.applyStyle(property, p + "%");
		this.$.bgbar.applyStyle(property, p + "%");
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
	calcVariationRatio: function(inValue) {
		return (inValue - this.value) / (this.max - this.min);
	},
	calcVariationPercent: function(inValue) {
		return this.calcVariationRatio(inValue) * 100;
	},	
	updateKnobPosition: function(inValue) {
		if (!this.dragging && this.isInPreview()) { return; }
		this._updateKnobPosition(inValue);
	},
	_updateKnobPosition: function(inValue) {
		var p = this._calcPercent(inValue);
		var slider = this.inverseToSlider(p);
		this.$.knob.applyStyle("left", slider + "%");
		this.$.popup.addRemoveClass("moon-slider-popup-flip-h", slider > 50);
		this.$.popupLabel.addRemoveClass("moon-slider-popup-flip-h", slider > 50);
		if(this.currentTime !== undefined) {
			this.$.popupLabelText.setContent(this.formatTime(this.currentTime));
		}
	},
	inverseToSlider: function(inPercent) {
		var oValue = this.scaleFactor * inPercent + this._calcPercent(this.rangeStart);
		return oValue;
	},
	transformToVideo: function(oValue) {
		var iValue = (oValue - this.rangeStart) / this.scaleFactor;
		return iValue;
	},
	//* If user presses on _this.$.tapArea_, seek to that point
	tap: function(inSender, inEvent) {
		if (this.tappable && !this.disabled) {
			var v = this.calcKnobPosition(inEvent);
			if( this.showDummyArea && (v < this.beginTickPos || v > this.endTickPos) ) {
				// TODO : action in dummy area
			}

			v = this.transformToVideo(v);
			this.sendSeekEvent(v);

			if (this.isInPreview()) {
				//* This will move popup position to playing time when preview move is end
				this._currentTime = v;
			}
			return true;
		}
	},
	setValue: function(inValue) {
		if(Math.abs(this.calcVariationPercent(inValue)) > this.smallVariation) {
			this.inherited(arguments);
		} else {
			this._setValue(inValue);
		}
	},	
	//* If dragstart, bubble _onSeekStart_ event
	dragstart: function(inSender, inEvent) {
		if (this.disabled) {
			return; // return nothing
		}
		if (inEvent.horizontal) {
			var v = this.calcKnobPosition(inEvent);
			if( this.showDummyArea && (v < this.beginTickPos || v > this.endTickPos) ) {
				// TODO : action in dummy area
				this.dummyAction = true;
			} else {
				var dragstart = this.inherited(arguments);
				if (dragstart) {
					this.doSeekStart();
				}
				this.dummyAction = false;
			}
			return true;
		}
		
		return true;
	},
	//* If drag, bubble _onSeek_ event, and override parent drag handler
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			var v = this.calcKnobPosition(inEvent);

			if(this.showDummyArea && (v < this.beginTickPos || v > this.endTickPos) ) {
				// TODO : action in dummy area
			}
			//* Default behavior to support elastic effect
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
				this.setProgress(this.elasticFrom);
				this.sendChangingEvent({value: this.elasticFrom});
				this.throttleJob("updateCanvas", this.bindSafely(function() { this.sendSeekEvent(this.elasticFrom); }), 100);
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
			
			if(this.showDummyArea && v <= this.beginTickPos) {
				v = this.rangeStart;
			}
			if(this.showDummyArea && v >= this.endTickPos ) {
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
			// this.hideKnobStatus();
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
		if (!this.dragging && this.isInPreview()) { return; }
		this._currentTime = inSender._currentTime;
		this._duration = inSender._duration;
		this.currentTime = this._currentTime;
		this.duration = this._duration;
		this.$.endTickText.setContent(this.formatTime(this.duration));
	},

	//* Properly format time
	formatTime: function(inValue) {
		var hour = Math.floor(inValue / (60*60));
		var min = Math.floor(inValue / 60);
		var sec = Math.round(inValue % 60);
		if (this.durfmt) {
			var val = {minute: min, second: sec};
			if (hour) {
				val.hour = hour;
			}
			return this.durfmt.format(val);
		} else {
			return (hour ? this.padDigit(hour) + ":" : "") + this.padDigit(min) + ":" + this.padDigit(sec);
		}
	},
	//* Format time helper
	padDigit: function(inValue) {
		return (inValue) ? (String(inValue).length < 2) ? "0"+inValue : inValue : "00";
	},
	feedback: function(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc) {
		if (!this.isInPreview()) {
			this.showKnobStatus();
			this.$.feedback.feedback(inMessage, inParams, inPersistShowing, inLeftSrc, inRightSrc);
		}
	}
});
