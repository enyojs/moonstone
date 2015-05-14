var
	kind = require('enyo/kind'),
	ScrollMath = require('enyo/ScrollMath');

var
	Spotlight = require('spotlight');

module.exports = {
	// We make ourselves a Spotlight container so that 5-way
	// navigation stays within our bounds by default...
	spotlight: 'container',
	// But when focus enters us, we should spot the nearest
	// child, not whichever one was previously focused
	spotlightRememberFocus: false,

	handlers: {
		onRequestScrollIntoView: 'handleRequestScrollIntoView'
	},

	scrollMath: {kind: ScrollMath, kFrictionDamping: 0.93},

	/**
	* Responds to child components' requests to be scrolled into view.
	*
	* @private
	*/
	handleRequestScrollIntoView: function(sender, event) {
		var bubble = false,
			opts = {
				block: event.scrollFullPage ? 'farthest' : 'farthest'
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

	suppressMouseEvents: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			if (Spotlight.getPointerMode()) {
				Spotlight.unspot();
			}
		};
	})

};
