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
	name: "moon.Slider",
	kind: "moon.ProgressBar",
	//* @protected
	classes: "moon-slider",
	spotlight: true,
	//* @public
	published: {
		/**
			Position of slider, expressed as an integer between 0 and 100, inclusive
		*/
		value: 0,
		//* Sliders may "snap" to multiples of this value in either direction
		increment: 0,
		/**
			If true (the default), current progress will be styled differently from
			rest of bar
		*/
		lockBar: true,
		//* If true (the default), tapping on bar will change current position
		tappable: true,
		//* CSS classes to apply to knob
		knobClasses: "moon-slider-knob",
		//* CSS classes to apply to popupLabel
		popupLabelClasses: "moon-slider-popup-label",
		//* CSS classes to apply to tapArea
		tapAreaClasses: "moon-slider-taparea",
		//* Color of value popup
		popupColor: "#4d4d4d",
		/**
			When set to true, button is shown as disabled and does not generate tap
			events (default is false)
		*/
		disabled: false,
		/**
			When true (the default), knob and progress move with animation when left
			or right direction key is pressed or bar is tapped
		*/
		animate: true,
		/**
			When false (the default), the slider's popup bubble is displayed while the
			slider is being adjusted
		*/
		noPopup: false,
		/**
			When true (the default), the popup displays a percentage value (rather
			than an absolute value)
		*/
		showPercentage: true,
		//* Popup width in pixels
		popupWidth: "auto",
		//* Popup height in pixels, and it is designed for under 72 pixels.
		popupHeight: 67,
		//* Popup offset in pixels
		popupOffset: 8,
		//* When false (the default), the knob may be moved past the _bgProgress_
		constrainToBgProgress: false,
		/**
			When true, an elastic visual effect is seen when the knob is dragged past
			the _bgProgress_ (default is false)
		*/
		elasticEffect: false,
		//* Custom popup content (ignored if null)
		popupContent: null,
		//* When true, popup content will be translated to locale-safe uppercase
		popupContentUpperCase: true
	},
	events: {
		/**
			Fires when bar position is set.

			_inEvent.value_ contains the new position.
		*/
		onChange: "",
		/**
			Fires while control knob is being dragged.

			_inEvent.value_ contains the current position.
		*/
		onChanging: "",
		//* Fires when animation to a position finishes.
		onAnimateFinish: ""
	},
	//* @protected
	handlers: {
		ondragstart: "dragstart",
		ondrag: "drag",
		ondragfinish: "dragfinish",
		onSpotlightFocused: "spotFocused",
		onSpotlightSelect: "spotSelect",
		onSpotlightBlur: "spotBlur",
		onSpotlightLeft: "spotLeft",
		onSpotlightRight: "spotRight"
	},
	moreComponents: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{name: "tapArea"},
		{name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", components: [
			{name: "popup", kind: "enyo.Popup", classes: "moon-slider-popup above", components: [
				{tag: "canvas", name: "drawingLeft", classes: "moon-slider-popup-left"},
				{name: "popupLabel", classes: "moon-slider-popup-center" },
				{tag: "canvas", name: "drawingRight", classes: "moon-slider-popup-right"}
			]}
		]}
	],
	animatingTo: null,
	popupLeftCanvasWidth: 26, // Popup left canvas width in pixel
	popupRightCanvasWidth: 26, // Popup right canvas width in pixel
	selected: false,

	//* @public

	//* Animates to the given value.
	animateTo: function(inStartValue, inEndValue) {
		inEndValue = this.clampValue(this.min, this.max, inEndValue); // Moved from animatorStep
		this.animatingTo = inEndValue;

		this.$.animator.play({
			startValue: inStartValue,
			endValue: inEndValue,
			node: this.hasNode()
		});
	},

	//* Returns true if the slider is currently being dragged.
	isDragging: function() {
		return this.dragging;
	},

	//* @protected
	create: function() {
		this.inherited(arguments);
		if (typeof ilib !== "undefined") {
			this._nf = new ilib.NumFmt({type: "percentage"});
		}
		this.createComponents(this.moreComponents);
		this.initValue();
		this.disabledChanged();
		this.knobClassesChanged();
		this.popupLabelClassesChanged();
		this.tapAreaClassesChanged();
	},
	destroy: function() {
		if (this._nf) {
			delete this._nf;
		}
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		this.popupColorChanged();
		this.popupHeightChanged();
		this.popupWidthChanged();
		this.drawToCanvas(this.popupColor);
		this._setValue(this.value);
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
		this.$.knob.addRemoveClass("disabled", this.disabled);
		this.setTappable(!this.disabled);
		if (this.disabled) {
			this.hideKnobStatus();
		}
	},
	knobClassesChanged: function(inOld) {
		this.$.knob.removeClass(inOld);
		this.$.knob.addClass(this.knobClasses);
	},
	popupLabelClassesChanged: function(inOld) {
		this.$.popupLabel.removeClass(inOld);
		this.$.popupLabel.addClass(this.popupLabelClasses);
	},
	tapAreaClassesChanged: function(inOld) {
		this.$.tapArea.removeClass(inOld);
		this.$.tapArea.addClass(this.tapAreaClasses);
	},
	//* Updates popup offset.
	popupOffsetChanged: function() {
		this.$.popup.applyStyle("top", -(this.getPopupHeight() + this.getPopupOffset()) + 'px');
		this.drawToCanvas(this.popupColor);
	},
	//* Updates popup width.
	popupWidthChanged: function() {
		if (this.popupWidth != "auto") {
			this.$.popupLabel.applyStyle("width", this.getPopupWidth() - (this.popupLeftCanvasWidth + this.popupRightCanvasWidth) + 'px');
		}
	},
	//* Updates popup height.
	popupHeightChanged: function() {
		if (this.getPopupHeight() >= 72) {
			enyo.warn("This popupHeight API is designed for under 72 pixels.");
		}

		this.$.drawingLeft.setAttribute("height", this.getPopupHeight());
		this.$.drawingRight.setAttribute("height", this.getPopupHeight());
		this.$.popupLabel.applyStyle("height", this.getPopupHeight() - 7 + 'px');
		this.$.popup.applyStyle("height", this.getPopupHeight() + 'px');
		this.$.popup.applyStyle("line-height", this.getPopupHeight() - 6 + 'px');
		this.popupOffsetChanged();
	},
	//* Updates popup color.
	popupColorChanged: function() {
		this.drawToCanvas(this.popupColor);
		this.$.popupLabel.applyStyle("background-color", this.popupColor);
	},
	//* Updates popup content.
	popupContentChanged: function() {
		var content = this.getPopupContent();
		this._popupContent = this.getPopupContentUpperCase() ? enyo.toUpperCase(content) : content;
		if (this._popupContent !== null) {
			this.$.popupLabel.setContent(this._popupContent);
		}
	},
	popupContentUpperCaseChanged: function() {
		this.popupContentChanged();
	},
	/**
		Slider will snap multiples.
	*/
	calcIncrement: function(inValue) {
		return (Math.round(inValue / this.increment) * this.increment);
	},
	//* Called only when _constrainToBgProgress_ is true.
	calcConstrainedIncrement: function(inValue) {
		return (Math.floor(inValue / this.increment) * this.increment);
	},
	//* Initializes _value_ at creation time.
	initValue: function() {
		if (this.constrainToBgProgress) {
			this.value = this.clampValue(this.min, this.bgProgress, this.value);
			this.value = (this.increment) ? this.calcConstrainedIncrement(this.value) : this.value;
		}

		this.updateKnobPosition(this.getValue());

		if (this.lockBar) {
			this.setProgress(this.getValue());
		}
	},
	valueChanged : function(preValue, inValue){
		if (!this.dragging) {
			if (this.constrainToBgProgress) {
				inValue = this.clampValue(this.min, this.bgProgress, inValue); // Moved from animatorStep
				inValue = (this.increment) ? this.calcConstrainedIncrement(inValue) : inValue;
			}
			if (this.animate){
				this.animateTo(preValue, inValue);
			} else {
				this._setValue(inValue);
			}
		}
	},
	minChanged: function (preValue, inValue) {
		this.initValue();
		this.progressChanged();
		this.bgProgressChanged();
	},
	maxChanged: function (preValue, inValue) {
		this.initValue();
		this.progressChanged();
		this.bgProgressChanged();
	},
	_setValue: function(inValue) {
		var v = this.clampValue(this.min, this.max, inValue);

		this.value = v;
		this.updateKnobPosition(v);

		if (this.lockBar) {
			this.setProgress(this.value);
		}

		this.sendChangeEvent({value: this.getValue()});
	},
	getValue: function() {
		return (this.animatingTo !== null) ? this.animatingTo : this.value;
	},
	updateKnobPosition: function(inValue) {
		var percent = this.calcPercent(inValue),
			knobValue = (this.showPercentage && this.popupContent === null) ? percent : inValue
		;

		this.$.knob.applyStyle("left", percent + "%");
		this.$.popup.addRemoveClass("moon-slider-popup-flip-h", percent > 50);
		this.$.popupLabel.addRemoveClass("moon-slider-popup-flip-h", percent > 50);

		this.updatePopupLabel(knobValue);
	},
	updatePopupLabel: function(inKnobValue) {
		var label = this._popupContent || this.calcPopupLabel(inKnobValue);
		this.$.popupLabel.setContent(label);
	},
	calcPopupLabel: function(inKnobValue) {
		if (this.showPercentage) {
			if (typeof ilib !== "undefined") {
				inKnobValue = this._nf.format(Math.round(inKnobValue));
			} else {
				inKnobValue = Math.round(inKnobValue) + "%";
			}
		}
		return inKnobValue;
	},
	calcKnobPosition: function(inEvent) {
		var x = inEvent.clientX - this.hasNode().getBoundingClientRect().left,
			pos = (x / this.getBounds().width) * (this.max - this.min) + this.min;
		return pos;
	},
	dragstart: function(inSender, inEvent) {
		if (this.disabled) {
			return; // return nothing
		}
		if (inEvent.horizontal) {
			inEvent.preventDefault();
			this.dragging = true;
			this.$.knob.addClass("active");
			this.showKnobStatus();
			return true;
		}
	},
	drag: function(inSender, inEvent) {
		if (this.dragging) {
			var v = this.calcKnobPosition(inEvent), ev;

			if (this.constrainToBgProgress === true) {
				v = (this.increment) ? this.calcConstrainedIncrement(v) : v;
				ev = this.bgProgress + (v-this.bgProgress)*0.4;
				v = this.clampValue(this.min, this.bgProgress, v);
				this.elasticFrom = (this.elasticEffect === false || this.bgProgress > v) ? v : ev;
				this.elasticTo = v;
			} else {
				v = (this.increment) ? this.calcIncrement(v) : v;
				v = this.clampValue(this.min, this.max, v);
				this.elasticFrom = this.elasticTo = v;
			}

			this.updateKnobPosition(this.elasticFrom);
			this.set("value",this.elasticFrom);

			if (this.lockBar) {
				this.setProgress(v);
			}

			this.sendChangingEvent({value: v});

			return true;
		}
	},
	dragfinish: function(inSender, inEvent) {
		if (this.disabled) {
			return; // return nothing
		}

		var v = this.elasticTo;
		if (this.constrainToBgProgress === true) {
			v = (this.increment) ? this.calcConstrainedIncrement(v) : v;
		} else {
			v = this.calcKnobPosition(inEvent);
			v = (this.increment) ? this.calcIncrement(v) : v;
			v = this.clampValue(this.min, this.max, v);
		}

		this.dragging = false;
		this.set("value",v);
		this.sendChangeEvent({value: this.getValue()});
		inEvent.preventTap();
		this.$.knob.removeClass("active");
		this.hideKnobStatus();
		return true;
	},
	tap: function(inSender, inEvent) {
		if (this.tappable && !this.disabled) {
			var v = this.calcKnobPosition(inEvent);
			v = (this.increment) ? this.calcIncrement(v) : v;
			v = (this.constrainToBgProgress && v>this.bgProgress) ? this.bgProgress : v;
			this.set("value",v);
			return true;
		}
	},
	animatorStep: function(inSender) {
		var	v = inSender.value;

		this.updateKnobPosition(v);

		if (this.lockBar) {
			this.setProgress(v);
		}

		this.sendChangingEvent({value: v});
		return true;
	},
	animatorComplete: function(inSender) {
		this._setValue(inSender.value);
		this.animatingTo = null;
		this.doAnimateFinish(inSender);
		return true;
	},
	spotFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView");
		}
	},
	spotSelect: function() {
		this.selected = !this.selected;
		if (!this.noPopup) {
			this.$.popup.setShowing(this.selected);
			this.updateKnobPosition(this.getValue());
		}
		this.$.knob.addRemoveClass("spotselect", this.selected);
		return true;
	},
	spotBlur: function() {
		if (this.dragging) {
			return true;
		} else {
			if (this.$.knob) {
				this.$.knob.removeClass("spotselect");
			}
			if (this.$.popup) {
				this.$.popup.hide();
			}
			this.selected = false;
		}
	},
	spotLeft: function(inSender, inEvent) {
		if (this.selected) {
			// If in the process of animating, work from the previously set value
			var v = this.getValue() - (this.increment || 1);

			this.set("value",v);
			return true;
		}
	},
	spotRight: function(inSender, inEvent) {
		if (this.selected) {
			var v = this.getValue() + (this.increment || 1);

			this.set("value",v);
			return true;
		}
	},
	showKnobStatus: function(inSender, inEvent) {
		if ((!this.disabled) && (!this.noPopup)) {
			this.$.popup.show();
			this.updateKnobPosition(this.getValue());
		}
	},
	hideKnobStatus: function(inSender, inEvent) {
		if (!this.noPopup) {
			this.$.popup.hide();
		}
	},
	drawToCanvas: function(bgColor) {
		var h = this.getPopupHeight()+1; // height total
		var hb = h - 8; // height bubble
		var hbc = (hb)/2; // height of bubble's center
		var wre = 26; // width's edge
		var r = hbc; //radius is half the bubble height
		var bcr = 50;//bottom curve radius 50
		var bcy = hb + bcr;//calculate the height of the center of the circle plus the radius to get the y coordinate of the circle to draw the bottom irregular arc

		var ctxLeft = this.$.drawingLeft.hasNode().getContext("2d");
		var ctxRight = this.$.drawingRight.hasNode().getContext("2d");

		this.$.drawingLeft.setAttribute("width", this.popupLeftCanvasWidth);
		this.$.drawingRight.setAttribute("width", this.popupRightCanvasWidth);

		// Set styles. Default color is knob's color
		ctxLeft.fillStyle = bgColor || enyo.dom.getComputedStyleValue(this.$.knob.hasNode(), "background-color");
		// Draw shape with arrow on left
		ctxLeft.moveTo(0, h);
		ctxLeft.arc(wre, bcy, bcr, 1.35 * Math.PI, 1.485 * Math.PI, false);
		ctxLeft.lineTo(wre, hb);
		ctxLeft.lineTo(wre, 0);
		ctxLeft.arcTo(0, 0, 0, hbc, r);
		ctxLeft.lineTo(0, h);
		ctxLeft.fill();

		// Set styles. Default color is knob's color
		ctxRight.fillStyle = bgColor || enyo.dom.getComputedStyleValue(this.$.knob.hasNode(), "background-color");
		// Draw shape with arrow on right
		ctxRight.moveTo(0, hb);
		ctxRight.arcTo(wre, hb, wre, hbc, r);

		ctxRight.arcTo(wre, 0, 0, 0, r);
		ctxRight.lineTo(0, 0);
		ctxRight.fill();
	},

	changeDelayMS: 50,
	sendChangeEvent: function(inEventData) {
		this.throttleJob("sliderChange", function() { this.doChange(inEventData); }, this.changeDelayMS);
	},
	sendChangingEvent: function(inEventData) {
		this.throttleJob("sliderChanging", function() { this.doChanging(inEventData); }, this.changeDelayMS);
	}
});
