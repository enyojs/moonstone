require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/IntegerPicker~IntegerPicker} kind.
* @module moonstone/IntegerPicker
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	Control = require('enyo/Control'),
	Scroller = require('enyo/Scroller');

var
	FlyweightRepeater = require('layout/FlyweightRepeater');

var
	ScrollStrategy = require('../ScrollStrategy'),
	TouchScrollStrategy = ScrollStrategy.Touch;

/**
* Fires when the currently selected value changes.
*
* @event module:moonstone/IntegerPicker~IntegerPicker#onChange
* @type {Object}
* @property {Number} value - The currently selected value.
* @property {String} name - The name of the picker instance.
* @public
*/

/**
* {@link module:moonstone/IntegerPicker~IntegerPicker} is a control that displays a list of integers
* ranging from [min]{@link module:moonstone/IntegerPicker~IntegerPicker#min} to [max]{@link module:moonstone/IntegerPicker~IntegerPicker#max},
* soliciting a choice from the user.
*
* To initialize the picker to a particular integer, set the
* [value]{@link module:moonstone/IntegerPicker~IntegerPicker#value} property to that integer:
*
* ```
* {kind: 'moon.IntegerPicker', noneText: 'None Selected',
*	content: 'Choose a Number', min: 0, max: 25, value: 5}
* ```
*
* The picker may be changed programmatically by modifying the `value`, `min`,
* and `max` properties in the normal manner, by calling [set()]{@link module:enyo/CoreObject~Object#set}.
*
* @class IntegerPicker
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/IntegerPicker~IntegerPicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.IntegerPicker',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-scroll-picker-container',

	/**
	* @private
	* @lends module:moonstone/IntegerPicker~IntegerPicker.prototype
	*/
	published: {
		/**
		* When `true`, button is shown as disabled and does not generate tap events.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false,

		/**
		* When `true`, picker transitions animate left/right.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		animate: true,

		/**
		* Current value of the picker.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		value: 0,

		/**
		* Minimum value of the picker.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		min: 0,

		/**
		* Maximum value of the picker.
		*
		* @type {Number}
		* @default 9
		* @public
		*/
		max: 9,

		/**
		* Amount by which to increment or decrement when moving picker between
		* [min]{@link module:moonstone/IntegerPicker~IntegerPicker#min} and [max]{@link module:moonstone/IntegerPicker~IntegerPicker#max}.
		*
		* @type {Number}
		* @default 1
		* @public
		*/
		step: 1,

		/**
		* If a number is specified, the picker value is displayed as this many
		* zero-filled digits.
		*
		* @type {Number}
		* @default null
		* @public
		*/
		digits: null,

		/**
		* When `true`, incrementing beyond [max]{@link module:moonstone/IntegerPicker~IntegerPicker#max} will wrap to
		* [min]{@link module:moonstone/IntegerPicker~IntegerPicker#min}, and decrementing beyond `min` will wrap to
		* `max`.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		wrap: false,

		/**
		* The minimum width of the picker. If not set, or set to a low value, the width
		* of the picker will fluctuate slightly depending on the rendered width of the value.
		*
		* @type {Number}
		* @default 50
		* @public
		*/
		minWidth: 50

	},

	/**
	* @private
	*/
	handlers: {
		onSpotlightUp:'next',
		onSpotlightDown:'previous',
		onSpotlightFocused: 'spotlightFocused',
		onSpotlightBlur:'spotlightBlur',
		onSpotlightScrollUp:'next',
		onSpotlightScrollDown:'previous',
		onmousewheel:'mousewheel'
	},

	/**
	* @private
	*/
	events: {
		/**
		* {@link module:moonstone/IntegerPicker~IntegerPicker#onChange}
		*/
		onChange: ''
	},

	/**
	* @private
	*/
	spotlight: true,

	/**
	* Cache scroll bounds so we don't have to run {@link module:enyo/Scroller~Scroller#stop} every time we
	* need them.
	*
	* @private
	*/
	scrollBounds: {},

	/**
	* @private
	*/
	components: [
		{name:'nextOverlay', kind: Control, ondown:'downNext', onholdpulse:'next', classes:'moon-scroll-picker-overlay-container next', components:[
			{kind: Control, classes: 'moon-scroll-picker-overlay next'},
			{kind: Control, classes: 'moon-scroll-picker-taparea'}
		]},
		// FIXME: TranslateScrollStrategy doesn't work with the current design of this component so
		// we're forcing TouchScrollStrategy
		{kind: Scroller, strategyKind: TouchScrollStrategy, thumb:false, touch:true, useMouseWheel: false, classes: 'moon-scroll-picker', components:[
			{name: 'repeater', kind: FlyweightRepeater, classes: 'moon-scroll-picker-repeater', ondragstart: 'dragstart', onSetupItem: 'setupItem', noSelect: true, components: [
				{name: 'item', kind: Control, classes: 'moon-scroll-picker-item'}
			]},
			{name: 'buffer', kind: Control, classes: 'moon-scroll-picker-buffer'}
		]},
		{name:'previousOverlay', kind: Control, ondown:'downPrevious', onholdpulse:'previous', classes:'moon-scroll-picker-overlay-container previous', components:[
			{kind: Control, classes: 'moon-scroll-picker-overlay previous'},
			{kind: Control, classes: 'moon-scroll-picker-taparea'}
		]}
	],

	/**
	* Parameter that determines scroll math simulation speed.
	*
	* @private
	*/
	scrollFrame: 3,

	/**
	* Indicates direction of change from user. Necessary to support proper wrapping
	* when `range == 2`.
	*
	* @private
	*/
	direction: 0,

	/**
	* Range of possible values `max - min`.
	*
	* @private
	*/
	range: 0,

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.verifyValue();
		this.updateOverlays();
	},

	/**
	* @private
	*/
	rendered: function () {
		Control.prototype.rendered.apply(this, arguments);
		this.width = null;
		this.rangeChanged();
		this.minWidthChanged();
		this.scrollToValue();
		this.$.scroller.getStrategy().setFixedTime(false);
		this.$.scroller.getStrategy().setFrame(this.scrollFrame);
	},

	/**
	* Snap to current value on a reflow.
	*
	* @private
	*/
	reflow: function () {
		Control.prototype.reflow.apply(this, arguments);
		this.scrollToValue();
	},

	/**
	* @private
	*/
	getVerifiedValue: function () {
		return this.value >= this.min && this.value <= this.max ? this.value : this.min;
	},

	/**
	* @private
	*/
	verifyValue: function () {
		var animate = this.animate;
		this.animate = false;
		this.set('value', this.getVerifiedValue());
		this.animate = animate;
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var index = inEvent.index;
		var content = this.labelForValue(this.indexToValue(index % this.range));
		this.$.item.setContent(content);
	},

	/**
	* Formats passed-in value for display. If [digits]{@link module:moonstone/IntegerPicker~IntegerPicker#digits}
	* is **truthy**, zeros will be prepended to reach that number of digits.
	*
	* @param  {Number} value - Value to format.
	* @return {String}       - Formatted value.
	* @private
	*/
	labelForValue: function(value) {
		if (this.digits) {
			value = (value < 0? '-' : '') + ('00000000000000000000' + Math.abs(value)).slice(-this.digits);
		}

		return value;
	},

	/**
	* @private
	*/
	setupBuffer: function() {
		var bmin = ('' + this.min).length,
			bmax = Math.max(bmin, ('' + this.max).length),
			digits = this.digits + (this.min < 0 ? 1 : 0),
			buffer = Math.max(bmax, digits),
			content = '00000000000000000000'.substring(0, buffer);
		this.$.buffer.setContent(content);
	},

	/**
	* @private
	*/
	digitsChanged: function () {
		this.setupBuffer();
	},

	/**
	* @private
	*/
	rangeChanged: function () {
		this.verifyValue();
		this.range = this.valueToIndex(this.max) - this.valueToIndex(this.min) + 1;
		this.setupBuffer();
	},

	/**
	* Fail-safe design.
	* If out-of-boundary value is assigned, adjust boundary.
	*
	* @private
	*/
	valueChanged: function (old) {
		this.value -= (this.value-this.min)%this.step;
		if (this.value < this.min) {
			this.setMin(this.value);
		} else if (this.value > this.max) {
			this.setMax(this.value);
		}

		this.scrollToValue(old);
		this.updateOverlays();
		this.fireChangeEvent(old);
	},

	stepChanged: function (old) {
		var step = parseInt(this.step, 10);
		this.step = isNaN(step)? 1 : step;
		this.valueChanged(this.value);
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		this.addRemoveClass('disabled', this.disabled);
	},

	/**
	* @private
	*/
	wrapChanged: function () {
		this.updateOverlays();
	},

	/**
	* Prevent scroller dragging
	*
	* @private
	*/
	dragstart: function (inSender, inEvent) {
		return true;
	},

	/**
	* @private
	*/
	minChanged: function () {
		this.rangeChanged();
	},

	/**
	* @private
	*/
	maxChanged: function () {
		this.rangeChanged();
	},

	/**
	* @private
	*/
	previous: function (inSender, inEvent) {
		if(this.disabled) {
			return;
		}

		this.direction = -1;

		if (this.value - this.step >= this.min) {
			this.setValue(this.value - this.step);
		} else if (this.wrap) {
			this.setValue(this.max);
		} else {
			return;
		}
		this.$.previousOverlay.addClass('selected');
		if (inEvent.originator != this.$.upArrow) {
			this.startJob('hideBottomOverlay', 'hideBottomOverlay', 350);
		}

		this.direction = 0;
		return true;
	},

	/**
	* @private
	*/
	next: function (inSender, inEvent) {
		if(this.disabled) {
			return;
		}

		this.direction = 1;

		if (this.value + this.step <= this.max) {
			this.setValue(this.value + this.step);
		} else if (this.wrap) {
			this.setValue(this.min);
		} else {
			return;
		}
		this.$.nextOverlay.addClass('selected');
		if (inEvent.originator != this.$.downArrow) {
			this.startJob('hideTopOverlay', 'hideTopOverlay', 350);
		}

		this.direction = 0;
		return true;
	},

	/**
	* @private
	*/
	downPrevious: function (inSender, inEvent) {
		this.previous(inSender, inEvent);
	},

	/**
	* @private
	*/
	downNext: function (inSender, inEvent) {
		this.next(inSender, inEvent);
	},

	/**
	* @private
	*/
	updateOverlays: function () {
		this.$.previousOverlay.applyStyle('visibility', (this.wrap || this.value - this.step >= this.min) ? 'visible' : 'hidden');
		this.$.nextOverlay.applyStyle('visibility', (this.wrap || this.value + this.step <= this.max) ? 'visible' : 'hidden');
	},

	/**
	* Renders the repeater.
	*
	* @param {Number} index - Index of row.
	* @param {Number} count - Number of rows to render.
	* @private
	*/
	updateRepeater: function(index, count) {
		this.$.repeater.set('rowOffset', index);
		this.$.repeater.set('count', count || 1);
		this.$.repeater.render();
		this.$.scroller.remeasure();
	},

	/**
	* Scrolls to the node at `index` if it exists.
	*
	* @param  {Number} index    - Index of row.
	* @param  {Boolean} animate - If `true`, scroll is animated.
	* @private
	*/
	scrollToIndex: function(index, animate) {
		var node = this.$.repeater.fetchRowNode(index);
		if (node) {
			if(animate) {
				this.$.scroller.scrollTo(node.offsetLeft, node.offsetTop);
			} else {
				this.$.scroller.setScrollTop(node.offsetTop);
				this.$.scroller.setScrollLeft(node.offsetLeft);
			}
		}
	},

	/**
	* Converts `value` to its index in the repeater.
	*
	* @param  {Number} value - Integer value.
	* @return {Number}       - Repeater index.
	* @private
	*/
	valueToIndex: function(value) {
		return Math.floor((value - this.min) / this.step);
	},

	/**
	* Converts a repeater `index` to its value.
	*
	* @param  {Number} index - Repeater index
	* @return {Number}       - Integer value
	* @private
	*/
	indexToValue: function(index) {
		return index * this.step + this.min;
	},

	/**
	* Sets up the repeater to render the rows between `old` and
	* [value]{@link module:moonstone/IntegerPicker~IntegerPicker#value} and scrolls to reveal the current value. If `old`
	* is specified, the scroll will be animated. If [wrap]{@link module:moonstone/IntegerPicker~IntegerPicker#wrap} is
	* `true`, the scroll will travel the shortest distance to `value`, which may result in
	* wrapping.
	*
	* @param  {Number} [old] - Prior value from which to scroll.
	* @private
	*/
	scrollToValue: function(old) {
		var newIndex = this.valueToIndex(this.value);

		if(this.animate && old !== undefined) {
			var oldIndex = this.valueToIndex(old);
			var delta = newIndex - oldIndex;

			if(this.wrap && Math.abs(delta) >= this.range/2) {

				// when range is 2, we need special logic so scrolling matches the user's action
				// (e.g. tapping the up arrow always scrolls up). If direction (set in next()
				// and previous()) === delta (which will always be +/- 1), the natural rendering
				// is correct even though we're wrapping around the boundary so don't adjust.
				if(!(this.range === 2 && this.direction !== delta)) {
					// if wrapping and wrapping is a shorter distance, adjust the lesser index by the
					// range so the distance is the shortest possible
					if(newIndex > oldIndex) {
						oldIndex += this.range;
					} else {
						newIndex += this.range;
					}
				}
			}

			// rowOffset should be the lesser of the indices and count is the difference + 1
			var index = Math.min(oldIndex, newIndex);
			var count = Math.abs(newIndex - oldIndex) + 1;
			this.updateRepeater(index, count);

			this.scrollToIndex(oldIndex, false);
			this.startJob('valueChanged-Scroller', this.bindSafely('scrollToIndex', newIndex, true), 16);
		} else {
			// if old isn't specified, setup the repeater with only this.value and jump to it
			this.updateRepeater(newIndex);
			this.scrollToIndex(newIndex, false);
		}
	},

	/**
	* @private
	*/
	hideTopOverlay: function () {
		this.$.nextOverlay.removeClass('selected');
	},

	/**
	* @private
	*/
	hideBottomOverlay: function () {
		this.$.previousOverlay.removeClass('selected');
	},

	/**
	* @fires module:moonstone/IntegerPicker~IntegerPicker#onChange
	* @private
	*/
	fireChangeEvent: function (old) {
		this.doChange({
			name: this.name,
			value: this.value,
			old: old,
			content: this.labelForValue(this.value)
		});
	},

	/**
	* @private
	*/
	resetOverlay: function () {
		this.hideTopOverlay();
		this.hideBottomOverlay();
	},

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	spotlightFocused: function () {
		this.bubble('onRequestScrollIntoView');
	},

	/**
	* @private
	*/
	spotlightBlur: function () {
		this.hideTopOverlay();
		this.hideBottomOverlay();
	},

	/**
	* Cache scroll bounds in [scrollBounds]{@link module:moonstone/IntegerPicker~IntegerPicker#scrollBounds} so we
	* don't have to call {@link module:enyo/Scroller~Scroller#stop} to retrieve them later.
	*
	* @private
	*/
	updateScrollBounds: function () {
		this.scrollBounds = this.$.scroller.getStrategy()._getScrollBounds();
	},

	/**
	* Silently scrolls to the `inValue` y-position without animating.
	*
	* @private
	*/
	setScrollTop: function (inValue) {
		this.$.scroller.setScrollTop(inValue);
	},

	/**
	* Ensures scroll position is in bounds.
	*
	* @private
	*/
	stabilize: function () {
		this.$.scroller.stabilize();
	},

	/**
	* @private
	*/
	mousewheel: function (inSender, inEvent) {
		// Make sure scrollers that container integer pickers don't scroll
		inEvent.preventDefault();
		return true;
	},

	/**
	* @private
	*/
	minWidthChanged: function() {
		this.applyStyle('min-width', dom.unit(this.minWidth));
	},

	/**
	* @method
	* @private
	*/
	showingChangedHandler: function () {
		Control.prototype.showingChangedHandler.apply(this, arguments);

		// Only force a scroll to the item corresponding to the current value if it is not
		// already displayed.
		if (this.showing && !this.$.repeater.fetchRowNode(this.valueToIndex(this.value))) {
			this.scrollToValue();
		}
	}
});
