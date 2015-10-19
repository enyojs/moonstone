/**
* Exports the {@link module:moonstone/Scrollable~Scrollable} mixin
* @module moonstone/Scrollable
*/
var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	resolution = require('enyo/resolution'),
	ScrollMath = require('enyo/ScrollMath');

var
	Spotlight = require('spotlight');

/**
* The Scrollable mixin
* @mixin
*/
var Scrollable = {
	// We make ourselves a Spotlight container so that 5-way
	// navigation stays within our bounds by default...
	spotlight: 'container',
	// But when focus enters us, we should spot the nearest
	// child, not whichever one was previously focused
	spotlightRememberFocus: false,

	suppressMouseEvents: true,

	/**
	* Specifies scrolling options to be used when scrolling an
	* item into view. Defaults:
	*
	*	{
	*		block: 'farthest',
	*		behavior: 'smooth'
	*	}
	*
	* @public
	*/
	scrollIntoViewOptions: null,

	// TODO: At least in the case of onSpotlightFocus, we
	// probably need to do something to ensure that we don't
	// have a conflict between the handler declared in the mixin
	// and any handler that might be declared in the kind that
	// uses the mixin. Possibilities include a) a hack like the
	// one currently employed in MarqueeSupport; b) a generalized
	// mechanism based on the same approach; or c) support in
	// general for multiple handlers for the same event, so that
	// base kinds, subkinds and instances can all register for
	// handlers independently.
	handlers: {
		onRequestScrollIntoView: 'handleRequestScrollIntoView',
		onSpotlightFocus: 'filterFocus'
	},

	// Override ScrollMath params
	scrollMath: {kind: ScrollMath, kFrictionDamping: 0.93, boundarySnapThreshold: resolution.scale(100)},

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			var opts = {
				block: 'farthest',
				behavior: 'smooth'
			};

			sup.apply(this, arguments);

			this.scrollIntoViewOptions = this.scrollIntoViewOptions ? utils.mixin(opts, this.scrollIntoViewOptions) : opts;
			// Save original options so they can be restored after runtime changes
			this._scrollIntoViewOptions = utils.clone(this.scrollIntoViewOptions);
		};
	}),

	/**
	* Responds to child components' requests to be scrolled into view.
	*
	* @private
	*/
	handleRequestScrollIntoView: function (sender, event) {
		var bubble = false,
			def = this.scrollIntoViewOptions,
			opts;
		// Only scroll in 5-way mode or when explicitly requested to scroll in pointer mode
		if (!Spotlight.getPointerMode() || event.scrollInPointerMode === true) {
			if (this.canScrollX || this.canScrollY) {
				opts = {
					// If the event explicitly requests a full-page scroll, then we do so...
					block: event.scrollFullPage ? 'farthest' : (
						// ...otherwise, we honor the option set on the scroller for one-off
						// requests, but force smaller scroll increments when Spotlight
						// accelerating, since this produces smoother continuous scrolling
						// in 5-way mode.
						Spotlight.Accelerator.isAccelerating() ? 'nearest' : def.block
					),
					behavior: def.behavior
				};
				this.scrollToControl(event.originator, opts);
			} else {
				// If we don't need to scroll, bubble onRequestScrollIntoView so that
				// any scrollers above us in the control hierarchy can scroll as needed
				bubble = true;
			}
		}
		return !bubble;
	},

	/**
	* @private
	*/
	filterFocus: function (sender, event) {
		var prev,
			defBlock;

		switch (event.focusType) {
			case 'point':
				break;
			case '5-way':
				// If 5-way focus is coming from outside the scroller or from a scroll control,
				// we want to scroll the smallest distance possible to avoid a jarring experience;
				// otherwise, we respect the provided options
				if ((prev = event.previous)) {
					defBlock = this._scrollIntoViewOptions.block;
					this.scrollIntoViewOptions.block = (this.isScrollingChild(prev)) ? defBlock : 'nearest';
				}
				break;
			case 'default':
				// When focusType is 'default', Spotlight is trying to focus
				// a Control in response to something other than a point or a
				// 5-way move. For example, this can happen during
				// initialization, when the pointer is hidden, or when the app
				// regains focus.
				//
				// In the case where a scroller child is being focused by
				// default, we short-circuit the action because the child is
				// potentially not in view, and focusing would cause it to
				// scroll it into view for no reason apparent to the user.
				// Instead, we should focus a child we know to be visible.
				if (this.eventIsFromScrollingChild(event)) {
					return this.spotFirstVisibleChild();
				}
				break;
			default:
				return false;
		}
	},

	/**
	* This check is factored out of `filterFocus()` so that the logic can be
	* overridden by the kind that includes the `Scrollable` mixin. For example,
	* NewDataList can perform this check more efficiently than we can do it here
	* in the general case.
	*
	* @private
	*/
	eventIsFromScrollingChild: kind.inherit(function (sup) {
		return function (event) {
			if (sup === utils.nop) {
				return this.isScrollingChild(event.originator);
			}
			else {
				return sup.apply(this, arguments);
			}
		};
	}),

	/**
	* This behavior is factored out of `filterFocus()` so that the logic can be
	* overridden by the kind that includes the `Scrollable` mixin. For example,
	* NewDataList can identify the first visible child more efficiently than we
	* can do it here in the general case.
	*
	* @private
	*/
	spotFirstVisibleChild: kind.inherit(function (sup) {
		return function () {
			if (sup === utils.nop) {
				// TODO: Implement. For now, only handling the more specific
				// case in moonstone/NewDataList.
				return false;
			}
			else {
				return sup.apply(this, arguments);
			}
		};
	}),

	/**
	* Extends the base implementation provided by the enyo Scrollable mixin
	* with Moonstone-specific functionality.
	*
	* @private
	*/
	_suppressMouseEvents: kind.inherit(function (sup) {
		return function () {
			var c;

			sup.apply(this, arguments);

			if (
				// If we're in pointer mode...
				Spotlight.getPointerMode() &&
				// ...and something is currently spotted...
				(c = Spotlight.getCurrent()) &&
				// ...and that thing is a scrolling child of ours...
				this.isScrollingChild(c)
			) {
				// ...then we unspot it, since the fact that we're suppressing
				// mouse events will prevent it from unspotting on its own
				Spotlight.unspot();
			}
		};
	})
};

module.exports = Scrollable;
