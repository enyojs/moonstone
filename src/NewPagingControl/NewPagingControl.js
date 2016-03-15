/**
* Contains the declaration for the {@link module:moonstone/NewPagingControl~PagingControl} kind.
* @wip
* @module moonstone/NewPagingControl
*/

var
	animation = require('enyo/animation'),
	kind = require('enyo/kind'),
	utils = require('enyo/utils');

var
	Spotlight = require('spotlight'),
	$L = require('../i18n');

var
	IconButton = require('../IconButton');

// TODO: Document the fact that this sends simulated mousewheel events

/**
* {@link module:moonstone/NewPagingControl~PagingControl} is a paging control button derived from
* {@link module:moonstone/IconButton~IconButton}. This control is not intended for use outside of
* {@link module:moonstone/Scroller~Scroller}.
*
* @class PagingControl
* @extends module:moonstone/IconButton~IconButton
* @wip
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/NewPagingControl~PagingControl.prototype */ {

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
	* @lends module:moonstone/NewPagingControl~PagingControl.prototype
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
		onSpotlightKeyDown: 'down',
		onSpotlightKeyUp: 'release',
		ondown: 'down',
		onhold: 'hold',
		onrelease: 'release',
		onActivate: 'noop'
	},

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
	create: function() {
		IconButton.prototype.create.apply(this, arguments);
		this.sideChanged();
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		if (this.disabled && Spotlight.Accelerator.isAccelerating()) {
			this.stopHoldJob();
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
	* Set this control's CSS class based on its [side]{@link module:moonstone/NewPagingControl~PagingControl#side}
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

		if (event.keyCode === undefined || event.keyCode === 13) {
			this.set('pressed', true);
			event.configureHoldPulse({
				endHold: 'onLeave',
				preventTap: true
			});
		}
	},

	/**
	* @private
	*/
	hold: function (sender, event) {
		if (this.disabled) {
			return;
		}
		this.delta = this.initialDelta;
		this.startHoldJob();
	},

	/**
	* @private
	*/
	release: function (sender, event) {
		this.set('pressed', false);
		this.endHold(sender, event);
	},

	/**
	* @private
	*/
	endHold: function (sender, event) {
		this.stopHoldJob();
		// Restore the scroller's previous setting `suppressMouseEvents`
		// setting -- see startHoldJob() for an explanation.
		this.scroller.suppressMouseEvents = this._suppressMouseEvents;
	},

	/**
	* @private
	*/
	startHoldJob: function () {
		// Scroller may be set up to suppress mouse events during
		// scrolling, but we don't want that when scrolling is driven
		// by holding a paging control, since we rely on mouse
		// movements to detect whether the hold is still in progress.
		//
		// We therefore use the scroller's `suppressMouseEvents` API
		// to disable event suppression for the duration of the hold.
		// We store the previous value of `suppressMouseEvents` so that
		// we can restore it when the hold is done.
		this._suppressMouseEvents = this.scroller.suppressMouseEvents;
		this.scroller.suppressMouseEvents = false;

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

			if (this.rtl && (side === 'left' || side === 'right')) {
				dir = -dir;
			}

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
		this.job = animation.cancelAnimationFrame(this.job);
	},

	/**
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
	* Overrides default focused handling to make sure scroller doesn't scroll to
	* this button.
	*
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
				this.set('accessibilityAlert', true);
				switch(side) {
					case 'top':
						this.set('accessibilityLabel', $L('UP'));
						break;
					case 'bottom':
						this.set('accessibilityLabel', $L('DOWN'));
						break;
					case 'left':
						this.set('accessibilityLabel', $L('LEFT'));
						break;
					case 'right':
						this.set('accessibilityLabel', $L('RIGHT'));
						break;
				}
			} else {
				this.set('accessibilityAlert', null);
				this.set('accessibilityLabel', null);
			}
		}}
	]
});
