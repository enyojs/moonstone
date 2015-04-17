(function (enyo, moon, scope) {
	moon.Scrollable = {

		// We make ourselves a Spotlight container so that 5-way
		// navigation stays within our bounds by default...
		spotlight: 'container',

		// But when focus enters us, we should spot the nearest
		// child, not whichever one was previously focused
		spotlightRememberFocus: false,

		handlers: {
			onRequestScrollIntoView: 'handleRequestScrollIntoView'
		},

		scrollMath: {kind: 'enyo.ScrollMath', kFrictionDamping: 0.93},

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
			if (!enyo.Spotlight.getPointerMode() || event.scrollInPointerMode === true) {
				if (this.canScrollX || this.canScrollY) {
					this.scrollToControl(event.originator, opts);
				} else {
					// If we don't need to scroll, bubble onRequestScrollIntoView so that
					// any scrollers above us in the control hierarchy can scroll as needed
					bubble = true;
				}
			}
			return !bubble;
		}
	};
})(enyo, moon, this);