require('moonstone');

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	log = require('enyo/logger'),
	ri = require('enyo/resolution'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	Popup = require('enyo/Popup'),
	Animator = require('enyo/Animator');

var
	Spotlight = require('spotlight');

var
	ilib = require('enyo-ilib');

var
	ProgressBar = require('../ProgressBar');
	IconButton = require('../IconButton');

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
* {@link moon.Slider} is a [control]{@link enyo.Control} that presents a range of selection
* options in the form of a horizontal slider with a control knob. The knob may be tapped and
* dragged to the desired location.
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
module.exports = kind(
	/** @lends moon.Slider.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Slider',

	/**
	* @private
	*/
	kind: ProgressBar,

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
		* When `true`, current progress is styled differently from rest of bar.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		lockBar: true,

		/**
		* When `true`, tapping on bar will change current position.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		tappable: true,

		/**
		* When `true`, jumpIncrement button will be displayed in both side of slider.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		enableJumpIncrement: true,

		/**
		* Sliders will increase or decrease as much as this value in either direction
		* When jumpIncrement button is tapped.
		*
		* @type {Number}
		* @default 10
		* @public
		*/
		jumpIncrement: 10,

		/**
		* CSS classes to apply to the knob.
		*
		* @type {String}
		* @default 'moon-slider-knob'
		* @public
		*/
		knobClasses: 'moon-slider-knob',

		/**
		* CSS classes to apply to the popup label.
		*
		* @type {String}
		* @default 'moon-slider-popup-label'
		* @public
		*/
		popupLabelClasses: 'moon-large-button-text moon-slider-popup-label',

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
		* If set to `true`, button is shown as disabled and does not generate tap events.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false,

		/**
		* When `true`, knob and progress move with animation when left or right direction
		* key is pressed, or when bar is tapped.
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
		* Popup height in pixels; value should be less than `72`.
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
		* When `false`, knob may be moved past the
		* [bgProgress]{@link moon.ProgressBar#bgProgress} value.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		constrainToBgProgress: false,

		/**
		* If set to `true`, an elastic visual effect is seen when the knob is dragged past
		* the [bgProgress]{@link moon.ProgressBar#bgProgress} value.
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
		* When `true`, popup content will have locale-safe uppercasing applied.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		uppercase: true,

		/**
		* @deprecated Replaced by [uppercase]{@link moon.Slider#uppercase}.
		*
		* Formerly defaulted to `true`, now defaults to `null` and will only have
		* an effect when explicitly set (for complete backward compatibility).
		*
		* @type {Boolean}
		* @default null
		* @public
		*/
		popupContentUpperCase: null
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
		{kind: Animator, onStep: 'animatorStep', onEnd: 'animatorComplete'},
		{name: 'tapArea', kind: Control},
		{name: 'knob', kind: Control, ondown: 'showKnobStatus', onup: 'hideKnobStatus', components: [
			{name: 'popup', kind: Popup, classes: 'moon-slider-popup above', components: [
				{name: 'drawingLeft', kind: Control, tag: 'canvas', classes: 'moon-slider-popup-left'},
				{name: 'popupLabel', kind: Control, classes: 'moon-slider-popup-center' },
				{name: 'drawingRight', kind: Control, tag: 'canvas', classes: 'moon-slider-popup-right'}
			]}
		]}
	],

	/**
	* @private
	*/
	jumpWrapperComponents: [
		{name: 'buttonLeft', kind: IconButton, noBackground: true, classes: 'moon-simple-picker-button left', icon: 'arrowlargeleft', onSpotlightKeyDown: 'configureSpotlightHoldPulse', onSpotlightSelect: 'previous', ondown: 'downLeft', onholdpulse: 'previous', ondragstart: 'preventDrag', defaultSpotlightDisappear: 'buttonRight'},
		{name: 'sliderWrapper', classes: 'moon-slider', spotlight: true},
		{name: 'buttonRight', kind: IconButton, noBackground: true, classes: 'moon-simple-picker-button right', icon: 'arrowlargeright', onSpotlightKeyDown: 'configureSpotlightHoldPulse', onSpotlightSelect: 'next', ondown: 'downRight', onholdpulse: 'next', ondragstart: 'preventDrag', defaultSpotlightDisappear: 'buttonLeft'}
	],

	/**
	* @private
	*/
	holdConfig: {endHold: 'onLeave', delay: 300},

	/**
	* @private
	*/
	animatingTo: null,

	/**
	* @private
	*/
	popupLeftCanvasWidth: 27, // Popup left canvas width in pixel

	/**
	* @private
	*/
	popupRightCanvasWidth: 27, // Popup right canvas width in pixel

	/**
	* @private
	*/
	selected: false,

	/**
	* Animates to the given value.
	*
	* @param {Number} start - The start position, as an integer between `0` and `100`.
	* @param {Number} end - The end position, as an integer between `0` and `100`.
	* @public
	*/
	animateTo: function(start, end) {
		start = this.clampValue(this.min, this.max, start);
		end = this.clampValue(this.min, this.max, end); // Moved from animatorStep
		this.animatingTo = end;

		this.$.animator.play({
			startValue: start,
			endValue: end,
			node: this.hasNode()
		});
	},

	/**
	* Determines whether the slider is currently being dragged.
	*
	* @returns {Boolean} `true` if the slider is currently being dragged; otherwise, `false`.
	* @public
	*/
	isDragging: function() {
		return this.dragging;
	},

	/**
	* @private
	*/
	create: function() {
		ProgressBar.prototype.create.apply(this, arguments);
		this._nf = new ilib.NumFmt({type: 'percentage', useNative: false});

		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// the popupContentUpperCase property is fully deprecated and removed. The legacy
		// property takes precedence if it exists.
		if (this.popupContentUpperCase !== null) this.uppercase = this.popupContentUpperCase;

		this.createComponents(this.moreComponents);

		this.initValue();
		this.disabledChanged();
		this.knobClassesChanged();
		this.popupLabelClassesChanged();
		this.popupContentChanged();
		this.tapAreaClassesChanged();
		this.initSliderStyles();
	},

	/**
	* @private
	*/
	initComponents: function() {
		if (this.enableJumpIncrement) this.createJumpIncrementButton();
		ProgressBar.prototype.initComponents.apply(this, arguments);
	},

	/**
	* @private
	*/
	createJumpIncrementButton: function() {
		this.createComponents(this.jumpWrapperComponents, {owner: this});
		this.controlParent = this.$.sliderWrapper;
		this.removeClass('moon-slider');
		this.addClass('moon-slider-wrapper');

		this.set('spotlight', false);
	},

	/**
	* @private
	*/
	destroy: function() {
		delete this._nf;
		ProgressBar.prototype.destroy.apply(this, arguments);
	},

	/**
	* @private
	*/
	rendered: function() {
		ProgressBar.prototype.rendered.apply(this, arguments);
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
		if (this.enableJumpIncrement) {
			this.$.buttonLeft.set('disabled', this.disabled);
			this.$.buttonRight.set('disabled', this.disabled);
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
		// console.log("updatePopupOffset:", this.getPopupHeight(), this.getPopupOffset(), ri.scale(this.getPopupHeight() + this.getPopupOffset() + 5));
		this.$.popup.applyStyle('top', dom.unit(-(ri.scale(this.getPopupHeight() + this.getPopupOffset() + 5)), 'rem'));
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
			this.$.popupLabel.applyStyle('width', dom.unit( this.getPopupWidth() - (this.popupLeftCanvasWidth + this.popupRightCanvasWidth) , 'rem'));
		}
	},

	/**
	* @private
	*/
	updatePopupHeight: function() {
		var h = this.getPopupHeight(),
			hRem = ri.scale(h);

		this.$.drawingLeft.setAttribute('height', hRem);
		this.$.drawingRight.setAttribute('height', hRem);
		this.$.popupLabel.applyStyle('height', dom.unit(ri.scale(h - 7), 'rem'));
		this.$.popup.applyStyle('height', dom.unit(ri.scale(h), 'rem'));
		this.$.popup.applyStyle('line-height', dom.unit(ri.scale(h - 6), 'rem'));
	},

	/**
	* Updates popup height.
	*
	* @private
	*/
	popupHeightChanged: function() {
		if (this.getPopupHeight() >= 72) {
			log.warn('This popupHeight API is designed for under 72 pixels.');
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
		this._popupContent = this.get('uppercase') ? util.toUpperCase(content) : content;
		if (this._popupContent !== null) {
			this.$.popupLabel.setContent(this._popupContent);
		}
	},

	/**
	* @private
	*/
	uppercaseChanged: function() {
		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// popupContentUpperCase is fully deprecated and removed.
		if (this.popupContentUpperCase != this.uppercase) this.popupContentUpperCase = this.uppercase;
		this.popupContentChanged();
	},

	/**
	* @private
	*/
	popupContentUpperCaseChanged: function() {
		if (this.uppercase != this.popupContentUpperCase) this.uppercase = this.popupContentUpperCase;
		this.uppercaseChanged();
	},

	/**
	* Slider will snap to multiples of this value.
	*
	* @private
	*/
	calcIncrement: function(val) {
		return (Math.round(val / this.increment) * this.increment);
	},

	/**
	* Called only when [constrainToBgProgress]{@link moon.Slider#constrainToBgProgress} is
	* `true`.
	*
	* @private
	*/
	calcConstrainedIncrement: function(val) {
		return (Math.floor(val / this.increment) * this.increment);
	},

	/**
	* Initializes [value]{@link moon.Slider#value} at creation time.
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

		if (this.enableJumpIncrement) {
			this.$.buttonLeft.set('disabled', this.disabled || v == this.min);
			this.$.buttonRight.set('disabled', this.disabled || v == this.max);
		}

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
			val = this._nf.format(Math.round(val));
		}
		return val;
	},

	/**
	* @private
	*/
	calcKnobPosition: function(e) {
		var node = this.enableJumpIncrement ? this.$.sliderWrapper.hasNode() : this.hasNode(),
			rect = node.getBoundingClientRect(),
			x = e.clientX - rect.left,
			pos = (x / rect.width) * (this.max - this.min) + this.min;
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
			Spotlight.freeze();
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
		if (this.disabled || !this.dragging) {
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
		Spotlight.unfreeze();
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
		if (this.tappable && !this.disabled && !sender.isDescendantOf(this.$.buttonLeft) && !sender.isDescendantOf(this.$.buttonRight)) {
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
		this.doAnimateFinish(sender);
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
		if (this.selected && sender == this.$.sliderWrapper) {
			// If in the process of animating, work from the previously set value
			var v = this.getValue() - (this.increment || 1);

			this.set('value',v);
			return true;
		}
	},

	/**
	* @private
	*/
	spotRight: function(sender, e) {
		if (this.selected && sender == this.$.sliderWrapper) {
			var	v = this.getValue() + (this.increment || 1);

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
		bgColor = bgColor  || dom.getComputedStyleValue(this.$.knob.hasNode(), 'background-color');
		var h = ri.scale( this.getPopupHeight()+1 ), // height total
			hb = h - ri.scale(8), // height bubble
			hbc = (hb)/2, // height of bubble's center
			wre = ri.scale(26), // width's edge
			r = hbc, // radius is half the bubble height
			bcr = ri.scale(50), // bottom curve radius 50
			bcy = hb + bcr, //calculate the height of the center of the circle plus the radius to get the y coordinate of the circle to draw the bottom irregular arc
			lw = 1, // line width that will be tucked under the neighboring dom element's edge

			ctxLeft = this.$.drawingLeft.hasNode().getContext('2d'),
			ctxRight = this.$.drawingRight.hasNode().getContext('2d');

		this.$.drawingLeft.setAttribute('width', ri.scale( this.popupLeftCanvasWidth) );
		this.$.drawingRight.setAttribute('width', ri.scale( this.popupRightCanvasWidth) );

		// Set styles. Default color is knob's color
		ctxLeft.fillStyle = bgColor;
		// Draw shape with arrow on left
		ctxLeft.moveTo(0, h);
 		// arc(x, y, radius, startAngle, endAngle, counterClockwise);
		ctxLeft.arc(wre, bcy, bcr, 1.35 * Math.PI, 1.485 * Math.PI, false);
		ctxLeft.lineTo(wre, hb);
		ctxLeft.lineTo(wre, 0);
		ctxLeft.arcTo(0, 0, 0, hbc, r);
		ctxLeft.lineTo(0, h);
		ctxLeft.fill();
		// Add a spacer line
		ctxLeft.beginPath();
		ctxLeft.lineWidth = lw+1;
		ctxLeft.strokeStyle = bgColor;
		ctxLeft.moveTo(wre+lw, 0);
		ctxLeft.lineTo(wre+lw, hb);
		ctxLeft.stroke();

		// Set styles. Default color is knob's color
		ctxRight.fillStyle = bgColor;
		// Draw shape with arrow on right
		ctxRight.moveTo(lw, hb);
		ctxRight.arcTo(wre+lw, hb, wre+lw, hbc, r);

		ctxRight.arcTo(wre+lw, 0, lw, 0, r);
		ctxRight.lineTo(0, 0);
		ctxRight.fill();
		// Add a spacer line
		ctxRight.beginPath();
		ctxRight.lineWidth = lw+1;
		ctxRight.strokeStyle = bgColor;
		ctxRight.moveTo(0, 0);
		ctxRight.lineTo(0, hb);
		ctxRight.stroke();
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
	},

	/**
	* @private
	*/
	downLeft: function (sender, e) {
		// checking button explicitly because it may be disabled due to value only
		if (!this.$.buttonLeft.disabled) {
			e.configureHoldPulse(this.holdConfig);
			this.previous();
		}
	},

	/**
	* @private
	*/
	downRight: function (sender, e) {
		// checking button explicitly because it may be disabled due to value only
		if (!this.$.buttonRight.disabled) {
			e.configureHoldPulse(this.holdConfig);
			this.next();
		}
	},

	/**
	* @private
	*/
	configureSpotlightHoldPulse: function (sender, e) {
		if (e.keyCode === 13) {
			e.configureHoldPulse(this.holdConfig);
		}
	},

	/**
	* Prevent drag events that start on the left and right jump buttons
	* 
	* @private
	*/
	preventDrag: function (sender, event) {
		return true;
	},

	/**
	* Decrement slider by jumpIncrement value.
	*
	* @public
	*/
	previous: function () {
		this.set('value', this.value - this.jumpIncrement);
	},

	/**
	* Increment slider by jumpIncrement value.
	*
	* @public
	*/
	next: function () {
		this.set('value', this.value + this.jumpIncrement);
	}
});