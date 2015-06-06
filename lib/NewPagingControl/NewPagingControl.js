var
	animation = require('enyo/animation'),
	kind = require('enyo/kind'),
	utils = require('enyo/utils');

var
	Spotlight = require('spotlight');

var
	IconButton = require('../IconButton');

// TODO: Document the fact that this sends simulated mousewheel events

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
	name: 'moon.NewPagingControl',

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
	backgroundOpacity: 'transparent',

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocused: 'noop',
		onSpotlightKeyDown: 'depress',
		onSpotlightKeyUp: 'undepress',
		onSpotlightSelect: 'noop',
		ondown: 'down',
		onup: 'endHold',
		onleave: 'endHold',
		onhold: 'hold',
		onActivate: 'noop'
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
	tapThreshold: 200,

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
	* @private
	*/
	disabledChanged: function () {
		if (this.disabled && Spotlight.Accelerator.isAccelerating()) {
			this.stopHoldJob();
			this.downTime = null;
			Spotlight.Accelerator.cancel();
		}
		IconButton.prototype.disabledChanged.apply(this, arguments);
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
	sideChanged: function (old) {
		var s = this.side;
		if(old) {
			this.removeClass(old);
		}
		this.addClass(s);
		this.setIcon(this._iconMappings[s]);
		this.deltaProp = (s === 'top' || s === 'bottom') ? 'wheelDeltaY' : 'wheelDeltaX';
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
		IconButton.prototype.undepress.apply(this, arguments);
		this.downCount = 0;
		this.endHold(sender, event);
	},

	/**
	* @private
	*/
	endHold: function (sender, event) {
		var downTime = this.downTime,
			elapsed;

		if (!downTime) {
			return;
		}

		elapsed = utils.perfNow() - downTime;
		if (elapsed < this.tapThreshold) {
			this.bubble('ontap');
		}

		this.stopHoldJob();
		this.downTime = null;
	},

	/**
	* @private
	*/
	startHoldJob: function () {
		this.stopHoldJob();

		var t0 = utils.perfNow(),
			t = 0
		;

		var fn = this.bindSafely(function () {
			var evt = {
					simulated: true,
					preventDefault: this.noop
				},
				side = this.side,
				dir = (side === 'top' || side === 'left') ? 1 : -1;

			this.job = animation.requestAnimationFrame(fn);

			t = (utils.perfNow() - t0)/1000;
			this.delta = Math.min(this.maxDelta, this.delta + (0.1 * Math.pow(t, 1.1)));

			evt[this.deltaProp] = dir * this.delta;

			this.bubble('onmousewheel', evt);

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
	* Overrides default focused handling to make sure scroller doesn't scroll to
	* this button.
	*
	* @private
	*/
	noop: function () { return true; }
});