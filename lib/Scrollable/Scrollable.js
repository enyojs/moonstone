/**
* Exports the {@link module:moonstone/Scrollable~Scrollable} mixin
* @module moonstone/Scrollable
*/
var
	kind = require('enyo/kind'),
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

	scrollIntoViewOptions: {
		block: 'farthest',
		behavior: 'smooth'
	},

	handlers: {
		onRequestScrollIntoView: 'handleRequestScrollIntoView'
		// TODO: See `avoidScrollOnDefaultFocus()`
		//onSpotlightFocus: 'avoidScrollOnDefaultFocus'
	},

	scrollMath: {kind: ScrollMath, kFrictionDamping: 0.93},

	/**
	* Responds to child components' requests to be scrolled into view.
	*
	* @private
	*/
	handleRequestScrollIntoView: function (sender, event) {
		var bubble = false,
			def = this.scrollIntoViewOptions,
			opts = {
				block: event.scrollFullPage ? 'farthest' : def.block,
				behavior: def.behavior
			};
		if (!Spotlight.getPointerMode() || event.scrollInPointerMode === true) {
			if (this.canScrollX || this.canScrollY) {
				this.scrollToControl(event.originator, opts);
			} else {
				// If we don't need to scroll, bubble onRequestScrollIntoView so that
				// any scrollers above us in the control hierarchy can scroll as needed
				bubble = true;
			}
		}
		return !bubble;
	},

	// TODO: Implement. For now, only handling the more specific
	//       case in moonstone/NewDataList
	/*avoidScrollOnDefaultFocus: function (sender, event) {
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
		if (event.focusType === 'default' !this.isScrollControl(event.originator)) {
			// Find and spot a suitable scroller child here.
			return true;
		}
	},*/

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
