require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Slider~Slider} kind.
* @module moonstone/Slider
*/

var
	kind = require('enyo/kind'),
	log = require('enyo/logger'),
	Control = require('enyo/Control'),
	Animator = require('enyo/Animator');

var
	Spotlight = require('spotlight');

var
	ProgressBar = require('../ProgressBar'),
	IconButton = require('../IconButton');

/**
* Fires when bar position is set.
*
* @event module:moonstone/Slider~Slider#onChange
* @type {Object}
* @property {Number} value - The value of the current position.
* @public
*/

/**
* Fires while control knob is being dragged.
*
* @event module:moonstone/Slider~Slider#onChanging
* @type {Object}
* @property {Number} value - The value of the current position.
* @public
*/

/**
* Fires when animation to a position finishes. No additional information is passed with this
* event.
*
* @event module:moonstone/Slider~Slider#onAnimateFinish
* @type {Object}
* @public
*/

/**
* {@link module:moonstone/Slider~Slider} is a [control]{@link module:enyo/Control~Control} that presents a range of selection
* options in the form of a horizontal slider with a control knob. The knob may be tapped and
* dragged to the desired location.
*
* ```javascript
* {kind: "moon.Slider", value: 30}
* ```
*
* @class Slider
* @extends module:moonstone/ProgressBar~ProgressBar
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Slider~Slider.prototype */ {

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
	* @lends module:moonstone/Slider~Slider.prototype
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
		* @default false
		* @public
		*/
		enableJumpIncrement: false,

		/**
		* Sliders will increase or decrease as much as this percentage value in either direction
		* when jumpIncrement button is tapped.
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
		* CSS classes to apply to the tap area.
		*
		* @type {String}
		* @default 'moon-slider-taparea'
		* @public
		*/
		tapAreaClasses: 'moon-slider-taparea',

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
		* When `false`, knob may be moved past the
		* [bgProgress]{@link module:moonstone/ProgressBar~ProgressBar#bgProgress} value.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		constrainToBgProgress: false,

		/**
		* If set to `true`, an elastic visual effect is seen when the knob is dragged past
		* the [bgProgress]{@link module:moonstone/ProgressBar~ProgressBar#bgProgress} value.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		elasticEffect: false
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
		{name: 'tapArea', ontap: 'tapAreaTapped', kind: Control},
		{name: 'knob', kind: Control, ondown: 'showKnobStatus', onup: 'hideKnobStatus'}
	],

	/**
	* @private
	*/
	jumpWrapperComponents: [
		{name: 'buttonLeft', kind: IconButton, backgroundOpacity: 'transparent', classes: 'moon-slider-button left', icon: 'arrowlargeleft', onSpotlightKeyDown: 'configureSpotlightHoldPulse', onSpotlightSelect: 'previous', ondown: 'downLeft', onholdpulse: 'holdLeft', ondragstart: 'preventDrag', defaultSpotlightDisappear: 'buttonRight'},
		{name: 'slider', classes: 'moon-slider', spotlight: true},
		{name: 'buttonRight', kind: IconButton, backgroundOpacity: 'transparent', classes: 'moon-slider-button right', icon: 'arrowlargeright', onSpotlightKeyDown: 'configureSpotlightHoldPulse', onSpotlightSelect: 'next', ondown: 'downRight', onholdpulse: 'holdRight', ondragstart: 'preventDrag', defaultSpotlightDisappear: 'buttonLeft'}
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
	selected: false,

	/**
	* Animates to the given value.
	*
	* @param {Number} start - The start position, as an integer between `0` and `100`.
	* @param {Number} end - The end position, as an integer between `0` and `100`.
	* @public
	*/
	animateTo: function (start, end) {
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
	isDragging: function () {
		return this.dragging;
	},

	/**
	* @private
	*/
	create: function () {
		ProgressBar.prototype.create.apply(this, arguments);
	},

	/**
	* @private
	*/
	initComponents: function () {
		if (this.enableJumpIncrement) this.createJumpIncrementButton();
		ProgressBar.prototype.initComponents.apply(this, arguments);
	},

	/**
	* @private
	*/
	createJumpIncrementButton: function () {
		this.createComponents(this.jumpWrapperComponents, {owner: this});
		this.controlParent = this.$.slider;
		this.removeClass('moon-slider');
		this.addClass('moon-slider-wrapper');

		this.set('spotlight', false);
	},

	/**
	* @private
	*/
	destroy: function () {
		ProgressBar.prototype.destroy.apply(this, arguments);
	},

	/**
	* @private
	*/
	rendered: function () {
		ProgressBar.prototype.rendered.apply(this, arguments);
		this._setValue(this.value);
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		if (this.enableJumpIncrement) {
			this.$.slider.addRemoveClass('disabled', this.disabled);
			this.$.slider.set('disabled', this.disabled);
			this.$.buttonLeft.set('disabled', this.disabled);
			this.$.buttonRight.set('disabled', this.disabled);
		} else {
			this.addRemoveClass('disabled', this.disabled);
		}
		this.$.knob.addRemoveClass('disabled', this.disabled);
		this.setTappable(!this.disabled);
		if (this.disabled) {
			this.hideKnobStatus();
		}
	},

	/**
	* @private
	*/
	knobClassesChanged: function (was) {
		this.$.knob.removeClass(was);
		this.$.knob.addClass(this.knobClasses);
	},

	/**
	* @private
	*/
	tapAreaClassesChanged: function (was) {
		this.$.tapArea.removeClass(was);
		this.$.tapArea.addClass(this.tapAreaClasses);
	},

	jumpIncrementChanged: function () {
		var range = this.max - this.min;
		this._jumpIncrementAmount = range * this.jumpIncrement / 100;
	},

	/**
	* Slider will snap to multiples of this value.
	*
	* @private
	*/
	calcIncrement: function (val) {
		return (Math.round(val / this.increment) * this.increment);
	},

	/**
	* Called only when [constrainToBgProgress]{@link module:moonstone/Slider~Slider#constrainToBgProgress} is
	* `true`.
	*
	* @private
	*/
	calcConstrainedIncrement: function (val) {
		return (Math.floor(val / this.increment) * this.increment);
	},

	/**
	* Initializes [value]{@link module:moonstone/Slider~Slider#value} at creation time.
	*
	* @private
	*/
	initValue: function () {
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
	valueChanged : function (was, is) {
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
	_setValue: function (val) {
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
	getValue: function () {
		return (this.animatingTo !== null) ? this.animatingTo : this.value;
	},

	/**
	* @private
	*/
	updateKnobPosition: function (val) {
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
	calcKnobPosition: function (e) {
		var node = this.enableJumpIncrement ? this.$.slider.hasNode() : this.hasNode(),
			rect = node.getBoundingClientRect(),
			x = e.clientX - rect.left,
			pos = (x / rect.width) * (this.max - this.min) + this.min;
		return pos;
	},

	/**
	* @private
	*/
	dragstart: function (sender, e) {
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
	drag: function (sender, e) {
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
	dragfinish: function (sender, e) {
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
	tapAreaTapped: function (sender, e) {
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
	animatorStep: function (sender) {
		var	v = sender.value;

		this.updateKnobPosition(v);

		if (this.lockBar) {
			this.setProgress(v);
		}

		this.sendChangingEvent({value: v});
		return true;
	},

	/**
	* @fires module:moonstone/Slider~Slider#onAnimateFinish
	* @private
	*/
	animatorComplete: function (sender) {
		this._setValue(sender.value);
		this.animatingTo = null;
		this.doAnimateFinish(sender);
		return true;
	},

	/**
	* @private
	*/
	spotFocused: function (sender, e) {
		if ((this.enableJumpIncrement && e.originator.owner === this) || e.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	},

	/**
	* @private
	*/
	spotSelect: function () {
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
	spotBlur: function () {
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
	spotLeft: function (sender, e) {
		if (this.selected && !this.dragging && (!this.enableJumpIncrement || sender == this.$.slider)) {
			// If in the process of animating, work from the previously set value
			var v = this.getValue() - (this.increment || 1);

			this.set('value', v);
			return true;
		}
	},

	/**
	* @private
	*/
	spotRight: function (sender, e) {
		if (this.selected && !this.dragging && (!this.enableJumpIncrement || sender == this.$.slider)) {
			var	v = this.getValue() + (this.increment || 1);

			this.set('value', v);
			return true;
		}
	},

	/**
	* @private
	*/
	showKnobStatus: function (sender, e) {
		if ((!this.disabled) && (!this.noPopup)) {
			this.$.popup.show();
			this.updateKnobPosition(this.getValue());
		}
	},

	/**
	* @private
	*/
	hideKnobStatus: function (sender, e) {
		if (!this.noPopup) {
			this.$.popup.hide();
		}
	},

	/**
	* @private
	*/
	changeDelayMS: 50,

	/**
	* @fires module:moonstone/Slider~Slider#onChange
	* @private
	*/
	sendChangeEvent: function (data) {
		this.throttleJob('sliderChange', function () { this.doChange(data); }, this.changeDelayMS);
	},

	/**
	* @fires module:moonstone/Slider~Slider#onChanging
	* @private
	*/
	sendChangingEvent: function (data) {
		this.throttleJob('sliderChanging', function () { this.doChanging(data); }, this.changeDelayMS);
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
	holdLeft: function (sender, event) {
		if (!this.$.buttonLeft.disabled) {
			this.previous();
		}
	},

	/**
	* @private
	*/
	holdRight: function (sender, event) {
		if (!this.$.buttonRight.disabled) {
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
		this.set('value', this.value - this._jumpIncrementAmount);
	},

	/**
	* Increment slider by jumpIncrement value.
	*
	* @public
	*/
	next: function () {
		this.set('value', this.value + this._jumpIncrementAmount);
	}
});
