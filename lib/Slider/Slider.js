require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Slider~Slider} kind.
* @module moonstone/Slider
*/

var
	kind = require('enyo/kind'),
	options = require('enyo/options'),
	Control = require('enyo/Control'),
	Animator = require('enyo/Animator');

var
	Spotlight = require('spotlight');

var
	ProgressBar = require('../ProgressBar'),
	IconButton = require('../IconButton');

var
	SliderAccessibilitySupport = require('./SliderAccessibilitySupport');

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
	mixins: options.accessibility ? [SliderAccessibilitySupport] : null,

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
		* Sliders will increase or decrease as much as this percentage or value in either direction
		* when jumpIncrement button is tapped.
		*
		* @type {Number|String}
		* @default '10%'
		* @public
		*/
		jumpIncrement: '10%',

		/**
		* Sliders will use this icon name for the button that decreases the value. Another good
		* alternative would be 'minus'.
		*
		* @type {String}
		* @default 'arrowlargeleft'
		* @public
		*/
		iconDecreaseButton: 'arrowlargeleft',

		/**
		* Sliders will use this icon name for the button that increases the value. Another good
		* alternative would be 'plus'.
		*
		* @type {String}
		* @default 'arrowlargeright'
		* @public
		*/
		iconIncreaseButton: 'arrowlargeright',

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
		* @deprecated This control no longer uses a DOM element as a tap area and relies on a
		* 	runtime pseudo-class to capture taps.
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
		* Overriding the default value of popup to `true`
		*
		* @see module:moonstone/ProgressBar~ProgressBar#popup
		* @type {Boolean}
		* @default true
		* @public
		*/
		popup: true,

		/**
		* When `false`, the popup bubble is displayed while the slider is being adjusted.
		*
		* @type {Boolean}
		* @default false
		* @deprecated Replaced by {@link module:moonstone/ProgressBar~ProgressBar#popup}
		* @public
		*/
		noPopup: false,

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
		ontap: 'tapAreaTapped',
		ondragstart: 'dragstart',
		ondrag: 'drag',
		ondragfinish: 'dragfinish',
		onSpotlightFocused: 'spotFocused',
		onSpotlightSelect: 'spotSelect',
		onSpotlightBlur: 'spotBlur',
		onSpotlightUp: 'spotUp',
		onSpotlightDown: 'spotDown',
		onSpotlightLeft: 'spotLeft',
		onSpotlightRight: 'spotRight'
	},

	/**
	* @private
	*/
	moreComponents: [
		{name: 'animator', kind: Animator, onStep: 'animatorStep', onEnd: 'animatorComplete'},
		{name: 'knob', kind: Control, ondown: 'handleKnobDown', onup: 'hideKnobStatus'}
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
		// Compatibility code for noPopup. Intentionally updating after the super call because this
		// control assumes the popup will be created and `popup` will only affect its display
		if (this.hasOwnProperty('noPopup')) this.popup = !this.noPopup;

		this.initValue();
		this.disabledChanged();
		this.knobClassesChanged();
		this.enableJumpIncrementChanged();
		this.jumpIncrementChanged();
	},

	/**
	* @private
	*/
	initComponents: function () {
		if (this.enableJumpIncrement) this.createJumpIncrementButton();
		ProgressBar.prototype.initComponents.apply(this, arguments);
		this.createChrome(this.moreComponents);
	},

	/**
	* Overriding {@link module:moonstone/ProgressBar~ProgressBar#createPopup} to change the
	* container of the popup as well as skip the logic to make it persistently shown.
	*
	* @private
	*/
	createPopup: function () {
		this.$.knob.createComponents(this.popupComponents, {owner: this});
	},

	/**
	* @private
	*/
	createJumpIncrementButton: function () {
		this.createComponents(this.jumpWrapperComponents, {owner: this});
		this.controlParent = this.$.slider;
		this.addClass('moon-slider-wrapper');

		this.set('spotlight', false);
		this.$.buttonLeft.set('icon', this.get('iconDecreaseButton'));
		this.$.buttonRight.set('icon', this.get('iconIncreaseButton'));
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
	enableJumpIncrementChanged: function () {
		this.addRemoveClass('incrementable', this.enableJumpIncrement);
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		if (this.enableJumpIncrement) {
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
	jumpIncrementChanged: function () {
		var range = this.max - this.min,
			incrementBy;
		if (typeof this.jumpIncrement == 'string' && this.jumpIncrement.substr(-1) == '%') {
			// jumpIncrement is a percent value
			incrementBy = range * parseFloat(this.jumpIncrement.slice(0,-1)) / 100;
		} else {
			// jumpIncrement is a plain number
			incrementBy = this.jumpIncrement;
		}
		this._jumpIncrementAmount = incrementBy;
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

		this.updatePopup(this.getValue());

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
	 * @deprecated To be removed when noPopup removed
	 * @private
	 */
	noPopupChanged: function () {
		this.set('popup', !this.noPopup);
	},

	/**
	* @private
	*/
	_setValue: function (val) {
		var v = this.clampValue(this.min, this.max, val);

		this.value = v;
		this.updatePopup(v);

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
	updatePopupPosition: function (percent) {
		this.$.knob.applyStyle(this.get('orientation') == 'vertical' ? 'bottom' : 'left', percent + '%');
	},

	/**
	* @private
	*/
	calcKnobPosition: function (e) {
		var node = this.enableJumpIncrement ? this.$.slider.hasNode() : this.hasNode(),
			rect = node.getBoundingClientRect(),
			dist;

		if (this.get('orientation') == 'vertical') {
			dist = ((rect.height - (e.clientY - rect.top)) / rect.height);
		} else {
			// default to horizontal
			dist = ((e.clientX - rect.left) / rect.width);
		}
		return (dist * (this.max - this.min) + this.min);
	},

	/**
	* @private
	*/
	dragstart: function (sender, e) {
		if (this.disabled) {
			return; // return nothing
		}
		var orient = this.get('orientation');
		if ((e.horizontal && orient == 'horizontal') || (e.vertical && orient == 'vertical')) { // could be simplified as: if (e[orient]); but left long for clarity and maintainability
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

			this.updatePopup(this.elasticFrom);
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
		if (this.tappable && !this.disabled && (e.originator === this || e.originator === this.$.slider || e.originator === this.$.bar || e.originator === this.$.bgbar)) {
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

		this.updatePopup(v);

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
		if (this.popup) {
			this.$.popup.setShowing(this.selected);
			if (this.selected) {
				this.$.popup.bubble('onRequestScrollIntoView');
			}
			this.updatePopup(this.getValue());
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
	spotUp: function (sender, e) {
		if (this.get('orientation') == 'vertical' && this.selected && !this.dragging && (!this.enableJumpIncrement || sender == this.$.slider)) {
			// If in the process of animating, work from the previously set value
			var v = this.getValue() + (this.increment || 1);

			this.set('value', v);
			return true;
		}
	},

	/**
	* @private
	*/
	spotDown: function (sender, e) {
		if (this.get('orientation') == 'vertical' && this.selected && !this.dragging && (!this.enableJumpIncrement || sender == this.$.slider)) {
			// If in the process of animating, work from the previously set value
			var v = this.getValue() - (this.increment || 1);

			this.set('value', v);
			return true;
		}
	},

	/**
	* @private
	*/
	spotLeft: function (sender, e) {
		if (this.get('orientation') == 'horizontal' && this.selected && !this.dragging && (!this.enableJumpIncrement || sender == this.$.slider)) {
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
		if (this.get('orientation') == 'horizontal' && this.selected && !this.dragging && (!this.enableJumpIncrement || sender == this.$.slider)) {
			var	v = this.getValue() + (this.increment || 1);

			this.set('value', v);
			return true;
		}
	},

	/**
	* @private
	*/
	handleKnobDown: function (sender, e) {
		if (!this.disabled) {
			e.configureHoldPulse({endHold: 'onMove'});
			this.showKnobStatus();
		}
	},

	/**
	* @private
	*/
	showKnobStatus: function () {
		if (this.popup) {
			this.$.popup.show();
			this.updatePopup(this.getValue());
		}
	},

	/**
	* @private
	*/
	hideKnobStatus: function (sender, e) {
		if (this.popup) {
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
