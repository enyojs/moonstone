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
	classes: "moon-slider",
	spotlight: true,
	published: {
		//* Position of slider, expressed as an integer between 0 and 100,
		//* inclusive
		value: 0,
		//* If true, current progress will be styled differently from rest of bar
		lockBar: true,
		//* If true, tapping on bar will change current position
		tappable: true,
		//* CSS classes to apply to knob
		knobClasses: "",
		//* Color of value popup
		popupColor: "#4b4b4b",
		//* When true, button is shown as disabled and does not generate tap events
		disabled: false,
		/**
			When true, knob and progress move with animation when left/right direction
			key is pressed or bar is tapped
		*/
		animate: true,
		//* When false, the slider's popup bubble is displayed when slider is adjusted
		noPopup: false,
		//* When true, popup displays a percentage value (rather than the absolute value)
		showPercentage: true,
		//* Popup width in pixels
		popupWidth: 86,
		//* Popup height in pixels
		popupHeight: 52,
		//* When false, you can move the knob past the _bgProgress_
		constrainToBgProgress: false,
		/**
			When true, an elastic visual effect is seen when the knob is dragged past
			the _bgProgress_.
		*/
		elasticEffect: false,
		//* Custom popup content (ignored if null)
		popupContent: null
	},
	events: {
		//* Fires when bar position is set. The _value_ property contains the
		//* new position.
		onChange: "",
		//* Fires while control knob is being dragged. The _value_ property
		//* contains the current position.
		onChanging: "",
		//* Fires when animation to a position finishes.
		onAnimateFinish: ""
	},
	//* @protected
	handlers: {
		ondragstart: "dragstart",
		ondrag: "drag",
		ondragfinish: "dragfinish",
		onSpotlightFocus: "spotFocus",
		onSpotlightSelect: "spotSelect",
		onSpotlightBlur: "spotBlur",
		onSpotlightLeft: "spotLeft",
		onSpotlightRight: "spotRight"
	},
	moreComponents: [
		{kind: "Animator", onStep: "animatorStep", onEnd: "animatorComplete"},
		{name: "tapArea", classes: "moon-slider-taparea"},
		{name: "knob", ondown: "showKnobStatus", onup: "hideKnobStatus", classes: "moon-slider-knob"},
		{name: "popup", kind: "enyo.Popup", classes: "moon-slider-popup above", components: [
			{tag: "canvas", name: "drawing"},
			{name: "popupLabel", classes: "moon-slider-popup-label"}
		]}
	],
	animatingTo: null,
	
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
	
	//* @protected
	
	create: function() {
		this.inherited(arguments);
		if (typeof ilib !== "undefined") {
			this._nf = new ilib.NumFmt({type: "percentage"});
		}
		this.createComponents(this.moreComponents);
		this.disabledChanged();
		this.knobClassesChanged();
	},
	destroy: function() {
		if (this._nf) {
			delete this._nf;
		}
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		this.canvasWidthChanged();
		this.canvasHeightChanged();
		this.drawToCanvas(this.popupColor);
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
		this.$.knob.addRemoveClass("disabled", this.disabled);
		this.setTappable(!this.disabled);
	},
	knobClassesChanged: function(inOld) {
		this.$.knob.removeClass(inOld);
		this.$.knob.addClass(this.knobClasses);
	},
	//* Updates _width_ attribute of _this.$.drawing_.
	canvasWidthChanged: function() {
		this.$.drawing.setAttribute("width", this.getPopupWidth());
	},
	//* Updates _height_ attribute of _this.$.drawing_.
	canvasHeightChanged: function() {
		this.$.drawing.setAttribute("height", this.getPopupHeight());
	},
	//* Updates popup color.
	popupColorChanged: function() {
		this.drawToCanvas(this.popupColor);
	},
	//* Updates the popup content.
	popupContentChanged: function() {
		var content = this.getPopupContent();
		if (content !== null) {
			this.$.popupLabel.setContent(content);
		}
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
	setValue: function(inValue) {
		if (this.value === inValue) {return false;}
		if (this.constrainToBgProgress) {
			inValue = this.clampValue(this.min, this.bgProgress, inValue); // Moved from animatorStep
			inValue = (this.increment) ? this.calcConstrainedIncrement(inValue) : inValue;
		}
		if (this.animate) {
			this.animateTo(this.getValue(), inValue);
		} else {
			this._setValue(inValue);
		}
	},
	_setValue: function(inValue) {
		var v = this.clampValue(this.min, this.max, inValue);

		// If no change, return
		if (v === this.value) {
			return;
		}
		
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
			knobValue = (this.showPercentage && this.popupContent === null) ? percent : inValue,
			label
		;
		
		this.$.knob.applyStyle("left", percent + "%");
		this.$.popup.applyStyle("left", percent + "%");
		
		this.updatePopupLabel(knobValue);
		this.updatePopupPosition();
	},
	updatePopupLabel: function(inKnobValue) {
		var label = this.getPopupContent();
		label = (label === null) ? this.calcPopupLabel(inKnobValue) : label;
		this.$.popupLabel.setContent(label);
	},
	calcPopupLabel: function(inKnobValue) {
		var label = (typeof ilib !== "undefined") ? this._nf.format(Math.round(inKnobValue)) : Math.round(inKnobValue);
		
		if (this.showPercentage) {
			label += "%";
		}
		
		return label;
	},
	updatePopupPosition: function() {
		var inControl = this.$.popup;
		if (!inControl.hasNode().getBoundingClientRect) {
			return;
		}
		var hFlip = false;
		// popup bounds
		var pb = inControl.hasNode().getBoundingClientRect();
		// container bounds
		var cb = this.container.hasNode().getBoundingClientRect();
		// knob bounds
		var kb = this.$.knob.hasNode().getBoundingClientRect();

		// when the popup's right edge is out of the window, adjust to the left
		if ( (kb.left + (kb.width) + pb.width) > cb.right - 30) {
			inControl.applyStyle("left", (kb.left - pb.width) + "px");
			hFlip = true;
		}
		inControl.addRemoveClass("moon-slider-popup-flip-h", hFlip);
		this.$.popupLabel.addRemoveClass("moon-slider-popup-flip-h", hFlip);
	},
	calcKnobPosition: function(inEvent) {
		var x = inEvent.clientX - this.hasNode().getBoundingClientRect().left;
		return (x / this.getBounds().width) * (this.max - this.min) + this.min;
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
			this.animateTo(this.elasticFrom, v);
		} else {
			v = this.calcKnobPosition(inEvent);
			v = (this.increment) ? this.calcIncrement(v) : v;	
			this._setValue(v);
		}

		this.dragging = false;

		inEvent.preventTap();

		this.$.knob.removeClass("active");
		this.hideKnobStatus();
		return true;
	},
	tap: function(inSender, inEvent) {
		if (this.tappable && !this.disabled) {
			var v = this.calcKnobPosition(inEvent);
			v = (this.increment) ? this.calcIncrement(v) : v;
			this.setValue(v);
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
	spotFocus: function() {
		return;
	},
	spotSelect: function() {
		var sh = this.$.popup.getShowing();
		this.$.knob.addRemoveClass("spotselect", !sh);
		if (!this.noPopup) {
			this.$.popup.setShowing(!sh);
		}
		this.selected = !sh;

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
			this.setValue(v);
			return true;
		}
	},
	spotRight: function(inSender, inEvent) {
		if (this.selected) {
			var v = this.getValue() + (this.increment || 1);
			this.setValue(v);
			return true;
		}
	},
	showKnobStatus: function(inSender, inEvent) {
		if ((!this.disabled) && (!this.noPopup)) {
			this.$.popup.show();
		}
	},
	hideKnobStatus: function(inSender, inEvent) {
		if (!this.noPopup) {
			this.$.popup.hide();
		}
	},
	drawToCanvas: function(bgColor) {
		var h = this.getPopupHeight() - 1; // height total
		var hb = h - 4; // height bubble
		var hbc = (hb-1)/2; // height of bubble's center
		var w = this.getPopupWidth() - 1; // width total
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
	},

	changeDelayMS: 50,
	sendChangeEvent: function(inEventData) {
		this.throttleJob("sliderChange", function() { this.doChange(inEventData); }, this.changeDelayMS);
	},
	sendChangingEvent: function(inEventData) {
		this.throttleJob("sliderChanging", function() { this.doChanging(inEventData); }, this.changeDelayMS);
	}
});
