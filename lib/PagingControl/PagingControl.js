require('moonstone');

var
	kind = require('enyo/kind'),
	dev = require('enyo/dev'),
	animation = require('enyo/animation');

var
	Spotlight = require('spotlight');

var
	IconButton = require('../IconButton');

/**
* Fires when page boundary is reached.
*
* @event moon.PagingControl#onPaginate
* @type {Object}
* @property {Number} scrollDelta - The distance of the scroll.
* @public
*/

/**
* Fires when we've determined how large the bounceback effect should be.
*
* @event moon.PagingControl#onPaginateScroll
* @type {Object}
* @property {Number} scrollDelta - The magnitude of the scroll bounceback.
* @public
*/

/**
* {@link moon.PagingControl} is a paging control button derived from
* {@link moon.IconButton}. This control is not intended for use outside of
* {@link moon.Scroller}.
*
* @class moon.PagingControl
* @extends moon.IconButton
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.PagingControl.prototype */ {

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
	* @lends moon.PagingControl.prototype
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
	noBackground: true,

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocused: 'noop',
		onSpotlightKeyDown: 'depress',
		onSpotlightKeyUp: 'undepress',
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
		* {@link moon.PagingControl#onPaginate}
		*/
		onPaginate: '',

		/**
		* {@link moon.PagingControl#onPaginateScroll}
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
	create: function() {
		IconButton.prototype.create.apply(this, arguments);
		this.sideChanged();
	},

	/**
	* Stops scrolling animation and triggers
	* [onPaginate]{@link moon.PagingControl#onPaginate} event with a delta
	* value for the bounceback effect.
	*
	* @fires moon.PagingControl#onPaginate
	* @public
	*/
	hitBoundary: function() {
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
	* Set this control's CSS class based on its [side]{@link moon.PagingControl#side}
	* value.
	*
	* @private
	*/
	sideChanged: function(old) {
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
	down: function(sender, event) {
		if (this.disabled) {
			return;
		}

		this.downTime = dev.bench();
		this.delta = this.initialDelta;
	},

	/**
	* @private
	*/
	hold: function(sender, event) {
		if (this.disabled) {
			return;
		}

		this.startHoldJob();
	},

	/**
	* @private
	*/
	depress: function(sender, event) {
		IconButton.prototype.depress.apply(this, arguments);
		// keydown events repeat (while mousedown/hold does not); simulate
		// hold behavior with mouse by catching the second keydown event
		if (event.keyCode === 13) {
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
	undepress: function(sender, event) {
		IconButton.prototype.undepress.apply(this, arguments);
		this.downCount = 0;
		this.endHold(sender, event);
	},

	/**
	* @private
	*/
	endHold: function(sender, event) {
		if (!this.downTime) {
			return;
		}

		this.stopHoldJob();
		this.sendPaginateEvent();
		this.downTime = null;
	},

	/**
	* @fires moon.PagingControl#onPaginateScroll
	* @private
	*/
	startHoldJob: function() {
		this.stopHoldJob();

		var t0 = dev.bench(),
			t = 0
		;

		var fn = this.bindSafely(function() {
			this.job = animation.requestAnimationFrame(fn);

			t = (dev.bench() - t0)/1000;
			this.delta = Math.min(this.maxDelta, this.delta + (0.1 * Math.pow(t, 1.1)));

			this.doPaginateScroll({scrollDelta: this.delta});
		});

		this.job = animation.requestAnimationFrame(fn);
	},

	/**
	* @private
	*/
	stopHoldJob: function() {
		this.job = animation.cancelRequestAnimationFrame(this.job);
	},

	/**
	* @fires moon.PagingControl#onPaginate
	* @private
	*/
	sendPaginateEvent: function() {
		var tapThreshold = 200,
			timeElapsed = dev.bench() - this.downTime,
			delta = (timeElapsed <= tapThreshold) ? this.tapDelta : this.delta;

		this.doPaginate({scrollDelta: delta});
	},

	/**
	* Overrides default focused handling to make sure scroller doesn't scroll to
	* this button.
	*
	* @private
	*/
	noop: function() { return true; }
});