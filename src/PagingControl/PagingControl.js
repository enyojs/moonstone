require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/PagingControl~PagingControl} kind.
* @module moonstone/PagingControl
*/

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	animation = require('enyo/animation');

var
	Spotlight = require('spotlight'),
	$L = require('../i18n');

var
	IconButton = require('../IconButton');

/**
* Fires when page boundary is reached.
*
* @event module:moonstone/PagingControl~PagingControl#onPaginate
* @type {Object}
* @property {Number} scrollDelta - The distance of the scroll.
* @public
*/

/**
* Fires when we've determined how large the bounceback effect should be.
*
* @event module:moonstone/PagingControl~PagingControl#onPaginateScroll
* @type {Object}
* @property {Number} scrollDelta - The magnitude of the scroll bounceback.
* @public
*/

/**
* {@link module:moonstone/PagingControl~PagingControl} is a paging control button derived from
* {@link module:moonstone/IconButton~IconButton}. This control is not intended for use outside of
* {@link module:moonstone/Scroller~Scroller}.
*
* @class PagingControl
* @extends module:moonstone/IconButton~IconButton
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/PagingControl~PagingControl.prototype */ {

	/**
	* @private
	*/
	name: 'moon.PagingControl',

	/**
	* @private
	*/
	kind: IconButton,

	/**
	* @private
	*/
	classes: 'moon-paging-button no-background',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	* @lends module:moonstone/PagingControl~PagingControl.prototype
	*/
	published: {
		/**
		* The side of the control where the button will be.
		*
		* Supported values are `'top'`, `'right'`, `'bottom'`, and `'left'`.
		*
		* @type {String}
		* @default null
		* @public
		*/
		side: null
	},

	/**
	* @private
	*/
	backgroundOpacity: 'transparent',

	/**
	* @private
	*/
	handlers: {
		ondown: 'down',
		onup: 'endHold',
		onleave: 'endHold',
		onhold: 'hold',
		onActivate: 'noop'
	},

	/**
	* @private
	*/
	events: {
		/**
		* {@link module:moonstone/PagingControl~PagingControl#onPaginate}
		*/
		onPaginate: '',

		/**
		* {@link module:moonstone/PagingControl~PagingControl#onPaginateScroll}
		*/
		onPaginateScroll: ''
	},

	/**
	* @private
	*/
	downTime: 0,

	/**
	* @private
	*/
	initialDelta: 2.5,

	/**
	* @private
	*/
	delta: 0,

	/**
	* @private
	*/
	maxDelta: 45,

	/**
	* @private
	*/
	tapDelta: 15,

	/**
	* @private
	*/
	bumpDeltaMultiplier: 3,

	/**
	* @private
	*/
	create: function () {
		IconButton.prototype.create.apply(this, arguments);
		this.sideChanged();
	},

	/**
	* Stops scrolling animation and triggers
	* [onPaginate]{@link module:moonstone/PagingControl~PagingControl#onPaginate} event with a delta
	* value for the bounceback effect.
	*
	* @fires module:moonstone/PagingControl~PagingControl#onPaginate
	* @public
	*/
	hitBoundary: function () {
		this.stopHoldJob();
		this.downTime = null;
		this.doPaginate({scrollDelta: this.delta * this.bumpDeltaMultiplier});
		Spotlight.Accelerator.cancel();
	},

	/**
	* @private
	*/
	_iconMappings: {
		'top': 'arrowlargeup',
		'bottom': 'arrowlargedown',
		'left': 'arrowlargeleft',
		'right': 'arrowlargeright'
	},

	/**
	* Set this control's CSS class based on its [side]{@link module:moonstone/PagingControl~PagingControl#side}
	* value.
	*
	* @private
	*/
	sideChanged: function (old) {
		var s = this.side;
		if(old) {
			this.removeClass(old);
		}
		this.addClass(s);
		this.setIcon(this._iconMappings[s]);
	},

	/**
	* @private
	*/
	down: function (sender, event) {
		if (this.disabled) {
			return;
		}

		this.downTime = utils.perfNow();
		this.delta = this.initialDelta;
	},

	/**
	* @private
	*/
	hold: function (sender, event) {
		if (this.disabled) {
			return;
		}

		this.startHoldJob();
	},

	/**
	* @private
	*/
	depress: function (sender, event) {
		IconButton.prototype.depress.apply(this, arguments);
		// keydown events repeat (while mousedown/hold does not); simulate
		// hold behavior with mouse by catching the second keydown event
		if (event.keyCode === 13) {
			this.set('pressed', true);
			if (!this.downCount) {
				this.down();
				this.downCount = 1;
			} else {
				this.downCount++;
			}
			if (this.downCount == 2) {
				this.hold();
			}
		}
	},

	/**
	* @private
	*/
	undepress: function (sender, event) {
		this.set('pressed', false);
		IconButton.prototype.undepress.apply(this, arguments);
		this.downCount = 0;
		this.endHold(sender, event);
	},

	/**
	* @private
	*/
	endHold: function (sender, event) {
		if (!this.downTime) {
			return;
		}

		this.stopHoldJob();
		this.sendPaginateEvent();
		this.downTime = null;
	},

	/**
	* @fires module:moonstone/PagingControl~PagingControl#onPaginateScroll
	* @private
	*/
	startHoldJob: function () {
		this.stopHoldJob();

		var t0 = utils.perfNow(),
			t = 0
		;

		var fn = this.bindSafely(function () {
			this.job = animation.requestAnimationFrame(fn);

			t = (utils.perfNow() - t0)/1000;
			this.delta = Math.min(this.maxDelta, this.delta + (0.1 * Math.pow(t, 1.1)));

			this.doPaginateScroll({scrollDelta: this.delta});
		});

		this.job = animation.requestAnimationFrame(fn);
	},

	/**
	* @private
	*/
	stopHoldJob: function () {
		this.job = animation.cancelRequestAnimationFrame(this.job);
	},

	/**
	* @fires module:moonstone/PagingControl~PagingControl#onPaginate
	* @private
	*/
	sendPaginateEvent: function () {
		var tapThreshold = 200,
			timeElapsed = utils.perfNow() - this.downTime,
			delta = (timeElapsed <= tapThreshold) ? this.tapDelta : this.delta;

		this.doPaginate({scrollDelta: delta});
	},

	/**
	* Overrides default focused handling to make sure scroller doesn't scroll to
	* this button.
	*
	* @private
	*/
	spotlightFocused: function () {
		this.set('spotted', true);
	},

	/**
	* @private
	*/
	spotlightBlurred: function () {
		IconButton.prototype.spotlightBlurred.apply(this, arguments);
		this.set('spotted', false);
	},

	/**
	* @private
	*/
	noop: function () { return true; },

	// Accessibility

	/*
	* @private
	*/
	spotted: false,

	/*
	* @private
	*/
	pressed: false,

	/**
	* @private
	*/
	accessibilityLive: 'off',

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['side', 'spotted'], method: function () {
			var side = this.get('side');
			if (this.spotted) {
				switch(side) {
					case 'top':
						this.set('accessibilityLabel', $L('scroll up'));
						break;
					case 'bottom':
						this.set('accessibilityLabel', $L('scroll down'));
						break;
					case 'left':
						this.set('accessibilityLabel', $L('scroll left'));
						break;
					case 'right':
						this.set('accessibilityLabel', $L('scroll right'));
						break;
				}
			}
		}},
		{path: 'pressed', method: function () {
			var side = this.get('side');
			if (this.pressed) {
				switch(side) {
					case 'top':
						this.set('accessibilityLabel', $L('up'));
						break;
					case 'bottom':
						this.set('accessibilityLabel', $L('down'));
						break;
					case 'left':
						this.set('accessibilityLabel', $L('left'));
						break;
					case 'right':
						this.set('accessibilityLabel', $L('right'));
						break;
				}
				this.set('accessibilityAlert', true);
			} else {
				this.set('accessibilityAlert', null);
				this.set('accessibilityLabel', null);
			}
		}}
	]
});
