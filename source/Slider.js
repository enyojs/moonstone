(function (enyo, scope) {
	/**
	* Fires when bar position is set.
	*
	* @event moon.Slider#onChange
	* @type {Object}
	* @property {Number} value - The value of the current position.
	* @public
	*/

	/**
	* Fires while control knob is being dragged.
	*
	* @event moon.Slider#onChanging
	* @type {Object}
	* @property {Number} value - The value of the current position.
	* @public
	*/

	/**
	* Fires when animation to a position finishes. No additional information is passed with this
	* event.
	*
	* @event moon.Slider#onAnimateFinish
	* @type {Object}
	* @public
	*/

	/**
	* `moon.Slider` is a [control]{@link enyo.Control} that presents a range of selection options in
	* the form of a horizontal slider with a control knob. The knob may be tapped and dragged to the
	* desired location.
	*
	* ```javascript
	* {kind: "moon.Slider", value: 30}
	* ```
	*
	* @class moon.Slider
	* @extends moon.ProgressBar
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Slider.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Slider',

		/**
		* @private
		*/
		kind: 'moon.ProgressBar',
		
		/**
		* @private
		*/
		classes: 'moon-slider',

		/**
		* @private
		*/
		spotlight: true,
		
		/**
		* @private
		* @lends moon.Slider.prototype
		*/
		published: {

			/**
			* Position of slider, expressed as an integer between `0` and `100`, inclusive.
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			value: 0,
			
			/**
			* Sliders may "snap" to multiples of this value in either direction.
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			increment: 0,
			
			/**
			* If `true`, current progress will be styled differently from rest of bar.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			lockBar: true,
			
			/**
			* If `true`, tapping on bar will change current position.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			tappable: true,
			
			/**
			* CSS classes to apply to knob.
			*
			* @type {String}
			* @default 'moon-slider-knob'
			* @public
			*/
			knobClasses: 'moon-slider-knob',
			
			/**
			* CSS classes to apply to the popup label
			*
			* @type {String}
			* @default 'moon-slider-popup-label'
			* @public
			*/
			popupLabelClasses: 'moon-slider-popup-label',
			
			/**
			* CSS classes to apply to the tap area.
			*
			* @type {String}
			* @default 'moon-slider-taparea'
			* @public
			*/
			tapAreaClasses: 'moon-slider-taparea',
			
			/**
			* Color value of the popup.
			*
			* @type {String}
			* @default '#4d4d4d'
			* @public
			*/
			popupColor: '#4d4d4d',
			
			/**
			* When set to `true`, button is shown as disabled and does not generate tap events.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			disabled: false,
			
			/**
			* When `true`, knob and progress move with animation when left or right direction key is
			* pressed or bar is tapped.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			animate: true,
			
			/**
			* When `false`, the slider's popup bubble is displayed while the slider is being
			* adjusted.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			noPopup: false,
			
			/**
			* When `true`, the popup displays a percentage value (rather than an absolute value).
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			showPercentage: true,
			
			/**
			* Popup width in pixels.
			*
			* @type {Number|String}
			* @default 'auto'
			* @public
			*/
			popupWidth: 'auto',
			
			/**
			* Popup height in pixels; value should be under `72`.
			*
			* @type {Number|String}
			* @default 67
			* @public
			*/
			popupHeight: 67,
			
			/**
			* Popup offset in pixels.
			*
			* @type {Number}
			* @default 8
			* @public
			*/
			popupOffset: 8,
			
			/**
			* When `false`, the knob may be moved past the
			* [`bgProgress`]{@link moon.ProgressBar#bgProgress} value.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			constrainToBgProgress: false,
			
			/**
			* When `true`, an elastic visual effect is seen when the knob is dragged past the
			* [`bgProgress`]{@link moon.ProgressBar#bgProgress} value.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			elasticEffect: false,
			
			/**
			* Custom popup content (ignored if `null`).
			*
			* @type {String|null}
			* @default null
			* @public
			*/
			popupContent: null,
			
			/**
			* When `true`, popup content will be translated to locale-safe uppercase.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			popupContentUpperCase: true
		},

		/**
		* @private
		*/
		events: {
			onChange: '',
			onChanging: '',
			onAnimateFinish: ''
		},
		
		/**
		* @private
		*/
		handlers: {
			ondragstart: 'dragstart',
			ondrag: 'drag',
			ondragfinish: 'dragfinish',
			onSpotlightFocused: 'spotFocused',
			onSpotlightSelect: 'spotSelect',
			onSpotlightBlur: 'spotBlur',
			onSpotlightLeft: 'spotLeft',
			onSpotlightRight: 'spotRight'
		},

		/**
		* @private
		*/
		moreComponents: [
			{kind: 'Animator', onStep: 'animatorStep', onEnd: 'animatorComplete'},
			{name: 'tapArea'},
			{name: 'knob', ondown: 'showKnobStatus', onup: 'hideKnobStatus', components: [
				{name: 'popup', kind: 'enyo.Popup', classes: 'moon-slider-popup above', components: [
					{tag: 'canvas', name: 'drawingLeft', classes: 'moon-slider-popup-left'},
					{name: 'popupLabel', classes: 'moon-slider-popup-center' },
					{tag: 'canvas', name: 'drawingRight', classes: 'moon-slider-popup-right'}
				]}
			]}
		],

		/**
		* @private
		*/
		animatingTo: null,

		/**
		* @private
		*/
		popupLeftCanvasWidth: 26, // Popup left canvas width in pixel

		/**
		* @private
		*/
		popupRightCanvasWidth: 26, // Popup right canvas width in pixel

		/**
		* @private
		*/
		selected: false,

		/**
		* Animates to the given value.
		*
		* @param {Number} start The start position, as an integer between `0` and `100`.
		* @param {Number} end The end position, as an integer between `0` and `100`.
		* @public
		*/
		animateTo: function(start, end) {
			end = this.clampValue(this.min, this.max, end); // Moved from animatorStep
			this.animatingTo = end;

			this.$.animator.play({
				startValue: start,
				endValue: end,
				node: this.hasNode()
			});
		},

		/**
		* Determine if the slider is currently being dragged.
		*
		* @returns {Boolean} Returns `true` if the slider is currently being dragged.
		* @public
		*/
		isDragging: function() {
			return this.dragging;
		},

		/**
		* @private
		*/
		create: function() {
			this.inherited(arguments);
			if (typeof ilib !== 'undefined') {
				this._nf = new ilib.NumFmt({type: 'percentage'});
			}
			this.createComponents(this.moreComponents);
			this.initValue();
			this.disabledChanged();
			this.knobClassesChanged();
			this.popupLabelClassesChanged();
			this.tapAreaClassesChanged();
			this.initSliderStyles();
			this.addRemoveClass('moon-slider-rtl', this.rtl);
		},

		/**
		* @private
		*/
		destroy: function() {
			if (this._nf) {
				delete this._nf;
			}
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		rendered: function() {
			this.inherited(arguments);
			this.drawToCanvas(this.popupColor);
			this._setValue(this.value);
		},

		/**
		* @private
		*/
		initSliderStyles: function() {
			this.updatePopupLabelColor();
			this.updatePopupHeight();
			this.updatePopupOffset();
			this.popupWidthChanged();
		},

		/**
		* @private
		*/
		disabledChanged: function() {
			this.addRemoveClass('disabled', this.disabled);
			this.$.knob.addRemoveClass('disabled', this.disabled);
			this.setTappable(!this.disabled);
			if (this.disabled) {
				this.hideKnobStatus();
			}
		},

		/**
		* @private
		*/
		knobClassesChanged: function(was) {
			this.$.knob.removeClass(was);
			this.$.knob.addClass(this.knobClasses);
		},

		/**
		* @private
		*/
		popupLabelClassesChanged: function(was) {
			this.$.popupLabel.removeClass(was);
			this.$.popupLabel.addClass(this.popupLabelClasses);
		},

		/**
		* @private
		*/
		tapAreaClassesChanged: function(was) {
			this.$.tapArea.removeClass(was);
			this.$.tapArea.addClass(this.tapAreaClasses);
		},

		/**
		* @private
		*/
		updatePopupOffset: function() {
			this.$.popup.applyStyle('top', -(this.getPopupHeight() + this.getPopupOffset()) + 'px');
		},
		
		/**
		* Updates popup offset.
		*
		* @private
		*/
		popupOffsetChanged: function() {
			this.updatePopupOffset();
			this.drawToCanvas(this.popupColor);
		},
		
		/**
		* Updates popup width.
		*
		* @private
		*/
		popupWidthChanged: function() {
			if (this.popupWidth != 'auto') {
				this.$.popupLabel.applyStyle('width', this.getPopupWidth() - (this.popupLeftCanvasWidth + this.popupRightCanvasWidth) + 'px');
			}
		},

		/**
		* @private
		*/
		updatePopupHeight: function() {
			var h = this.getPopupHeight();
			this.$.drawingLeft.setAttribute('height', h);
			this.$.drawingRight.setAttribute('height', h);
			this.$.popupLabel.applyStyle('height', h - 7 + 'px');
			this.$.popup.applyStyle('height', h + 'px');
			this.$.popup.applyStyle('line-height', h - 6 + 'px');
		},
		
		/**
		* Updates popup height.
		*
		* @private
		*/
		popupHeightChanged: function() {
			if (this.getPopupHeight() >= 72) {
				enyo.warn('This popupHeight API is designed for under 72 pixels.');
			}

			this.updatePopupHeight();
			this.popupOffsetChanged();
		},

		/**
		* @private
		*/
		updatePopupLabelColor: function() {
			this.$.popupLabel.applyStyle('background-color', this.popupColor);
		},
		
		/**
		* Updates popup color.
		*
		* @private
		*/
		popupColorChanged: function() {
			this.drawToCanvas(this.popupColor);
			this.updatePopupLabelColor();
		},
		
		/**
		* Updates popup content.
		*
		* @private
		*/
		popupContentChanged: function() {
			var content = this.getPopupContent();
			this._popupContent = this.getPopupContentUpperCase() ? enyo.toUpperCase(content) : content;
			if (this._popupContent !== null) {
				this.$.popupLabel.setContent(this._popupContent);
			}
		},

		/**
		* @private
		*/
		popupContentUpperCaseChanged: function() {
			this.popupContentChanged();
		},

		/**
		* Slider will snap multiples.
		*
		* @private
		*/
		calcIncrement: function(val) {
			return (Math.round(val / this.increment) * this.increment);
		},
		
		/**
		* Called only when [`constrainToBgProgress`]{@link moon.Slider#constrainToBgProgress} is
		* `true`.
		*
		* @private
		*/
		calcConstrainedIncrement: function(val) {
			return (Math.floor(val / this.increment) * this.increment);
		},

		/**
		* Initializes [`value`]{@link moon.Slider#value} at creation time.
		*
		* @private
		*/
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

		/**
		* @private
		*/
		valueChanged : function(was, is){
			if (!this.dragging) {
				var allowAnimation = this.constrainToBgProgress && is <= this.bgProgress || !this.constrainToBgProgress;
				if (this.constrainToBgProgress) {
					is = this.clampValue(this.min, this.bgProgress, is); // Moved from animatorStep
					is = (this.increment) ? this.calcConstrainedIncrement(is) : is;
				}
				if (this.animate && allowAnimation) {
					this.animateTo(was, is);
				} else {
					this._setValue(is);
				}
			}
		},

		/**
		* @private
		*/
		minChanged: function (was, is) {
			this.initValue();
			this.progressChanged();
			this.bgProgressChanged();
		},

		/**
		* @private
		*/
		maxChanged: function (was, is) {
			this.initValue();
			this.progressChanged();
			this.bgProgressChanged();
		},

		/**
		* @private
		*/
		_setValue: function(val) {
			var v = this.clampValue(this.min, this.max, val);

			this.value = v;
			this.updateKnobPosition(v);

			if (this.lockBar) {
				this.setProgress(this.value);
			}

			this.sendChangeEvent({value: this.getValue()});
		},

		/**
		* @private
		*/
		getValue: function() {
			return (this.animatingTo !== null) ? this.animatingTo : this.value;
		},

		/**
		* @private
		*/
		updateKnobPosition: function(val) {
			var percent = this.calcPercent(val),
				knobValue = (this.showPercentage && this.popupContent === null) ? percent : val
			;

			if (this.rtl) { percent = 100 - percent; }

			this.$.knob.applyStyle('left', percent + '%');
			this.$.popup.addRemoveClass('moon-slider-popup-flip-h', percent > 50);
			this.$.popupLabel.addRemoveClass('moon-slider-popup-flip-h', percent > 50);

			this.updatePopupLabel(knobValue);
		},

		/**
		* @private
		*/
		updatePopupLabel: function(val) {
			var label = this._popupContent || this.calcPopupLabel(val);
			this.$.popupLabel.setContent(label);
		},

		/**
		* @private
		*/
		calcPopupLabel: function(val) {
			if (this.showPercentage) {
				if (typeof ilib !== 'undefined') {
					val = this._nf.format(Math.round(val));
				} else {
					val = Math.round(val) + '%';
				}
			}
			return val;
		},

		/**
		* @private
		*/
		calcKnobPosition: function(e) {
			var x;
			if (this.rtl) {
				x = this.hasNode().getBoundingClientRect().right - e.clientX;
			} else {
				x = e.clientX - this.hasNode().getBoundingClientRect().left;
			}
			var pos = (x / this.getBounds().width) * (this.max - this.min) + this.min;
			return pos;
		},

		/**
		* @private
		*/
		dragstart: function(sender, e) {
			if (this.disabled) {
				return; // return nothing
			}
			if (e.horizontal) {
				e.preventDefault();
				this.dragging = true;
				enyo.Spotlight.freeze();
				this.$.knob.addClass('active');
				this.showKnobStatus();
				return true;
			}
		},

		/**
		* @private
		*/
		drag: function(sender, e) {
			if (this.dragging) {
				var v = this.calcKnobPosition(e), ev;

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
				this.set('value',this.elasticFrom);

				if (this.lockBar) {
					this.setProgress(v);
				}

				this.sendChangingEvent({value: v});

				return true;
			}
		},

		/**
		* @private
		*/
		dragfinish: function(sender, e) {
			if (this.disabled) {
				return; // return nothing
			}

			var v = this.elasticTo;
			if (this.constrainToBgProgress === true) {
				v = (this.increment) ? this.calcConstrainedIncrement(v) : v;
			} else {
				v = this.calcKnobPosition(e);
				v = (this.increment) ? this.calcIncrement(v) : v;
				v = this.clampValue(this.min, this.max, v);
			}

			this.dragging = false;
			enyo.Spotlight.unfreeze();
			this.set('value',v);
			this.sendChangeEvent({value: this.getValue()});
			e.preventTap();
			this.$.knob.removeClass('active');
			this.hideKnobStatus();
			return true;
		},

		/**
		* @private
		*/
		tap: function(sender, e) {
			if (this.tappable && !this.disabled) {
				var v = this.calcKnobPosition(e);
				v = (this.increment) ? this.calcIncrement(v) : v;
				v = (this.constrainToBgProgress && v>this.bgProgress) ? this.bgProgress : v;
				this.set('value',v);
				return true;
			}
		},

		/**
		* @private
		*/
		animatorStep: function(sender) {
			var	v = sender.value;

			this.updateKnobPosition(v);

			if (this.lockBar) {
				this.setProgress(v);
			}

			this.sendChangingEvent({value: v});
			return true;
		},

		/**
		* @fires moon.Slider#onAnimateFinish
		* @private
		*/
		animatorComplete: function(sender) {
			this._setValue(sender.value);
			this.animatingTo = null;
			this.doAnimateFinish();
			return true;
		},

		/**
		* @private
		*/
		spotFocused: function(sender, e) {
			if (e.originator === this) {
				this.bubble('onRequestScrollIntoView');
			}
		},

		/**
		* @private
		*/
		spotSelect: function() {
			this.selected = !this.selected;
			if (!this.noPopup) {
				this.$.popup.setShowing(this.selected);
				this.updateKnobPosition(this.getValue());
			}
			this.$.knob.addRemoveClass('spotselect', this.selected);
			return true;
		},

		/**
		* @private
		*/
		spotBlur: function() {
			if (!this.dragging) {
				if (this.$.knob) {
					this.$.knob.removeClass('spotselect');
				}
				if (this.$.popup) {
					this.$.popup.hide();
				}
				this.selected = false;
			}
		},

		/**
		* @private
		*/
		spotLeft: function(sender, e) {
			if (this.selected) {
				// If in the process of animating, work from the previously set value
				var v = this.rtl
					? this.getValue() + (this.increment || 1)
					: this.getValue() - (this.increment || 1);

				this.set('value',v);
				return true;
			}
		},

		/**
		* @private
		*/
		spotRight: function(sender, e) {
			if (this.selected) {
				var v = this.rtl
					? this.getValue() - (this.increment || 1)
					: this.getValue() + (this.increment || 1);

				this.set('value',v);
				return true;
			}
		},

		/**
		* @private
		*/
		showKnobStatus: function(sender, e) {
			if ((!this.disabled) && (!this.noPopup)) {
				this.$.popup.show();
				this.updateKnobPosition(this.getValue());
			}
		},

		/**
		* @private
		*/
		hideKnobStatus: function(sender, e) {
			if (!this.noPopup) {
				this.$.popup.hide();
			}
		},

		/**
		* @private
		*/
		drawToCanvas: function(bgColor) {
			var h = this.getPopupHeight()+1; // height total
			var hb = h - 8; // height bubble
			var hbc = (hb)/2; // height of bubble's center
			var wre = 26; // width's edge
			var r = hbc; //radius is half the bubble height
			var bcr = 50;//bottom curve radius 50
			var bcy = hb + bcr;//calculate the height of the center of the circle plus the radius to get the y coordinate of the circle to draw the bottom irregular arc

			var ctxLeft = this.$.drawingLeft.hasNode().getContext('2d');
			var ctxRight = this.$.drawingRight.hasNode().getContext('2d');

			this.$.drawingLeft.setAttribute('width', this.popupLeftCanvasWidth);
			this.$.drawingRight.setAttribute('width', this.popupRightCanvasWidth);

			// Set styles. Default color is knob's color
			ctxLeft.fillStyle = bgColor || enyo.dom.getComputedStyleValue(this.$.knob.hasNode(), 'background-color');
			// Draw shape with arrow on left
			ctxLeft.moveTo(0, h);
			ctxLeft.arc(wre, bcy, bcr, 1.35 * Math.PI, 1.485 * Math.PI, false);
			ctxLeft.lineTo(wre, hb);
			ctxLeft.lineTo(wre, 0);
			ctxLeft.arcTo(0, 0, 0, hbc, r);
			ctxLeft.lineTo(0, h);
			ctxLeft.fill();

			// Set styles. Default color is knob's color
			ctxRight.fillStyle = bgColor || enyo.dom.getComputedStyleValue(this.$.knob.hasNode(), 'background-color');
			// Draw shape with arrow on right
			ctxRight.moveTo(0, hb);
			ctxRight.arcTo(wre, hb, wre, hbc, r);

			ctxRight.arcTo(wre, 0, 0, 0, r);
			ctxRight.lineTo(0, 0);
			ctxRight.fill();
		},

		/**
		* @private
		*/
		changeDelayMS: 50,

		/**
		* @fires moon.Slider#onChange
		* @private
		*/
		sendChangeEvent: function(data) {
			this.throttleJob('sliderChange', function() { this.doChange(data); }, this.changeDelayMS);
		},

		/**
		* @fires moon.Slider#onChanging
		* @private
		*/
		sendChangingEvent: function(data) {
			this.throttleJob('sliderChanging', function() { this.doChanging(data); }, this.changeDelayMS);
		}
	});

})(enyo, this);
