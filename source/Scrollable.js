(function (enyo, moon, scope) {
	moon.Scrollable = {
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
				//showVertical, showHorizontal;
			if (!enyo.Spotlight.getPointerMode() || event.scrollInPointerMode === true) {
				// showVertical = this.showVertical();
				// showHorizontal = this.showHorizontal();
				// this.scrollBounds = this._getScrollBounds();
				// this.setupBounds();
				// this.scrollBounds = null;
				if (this.canScrollX || this.canScrollY) {
					this.scrollToControl(event.originator, opts);
					// if ((showVertical && this.$.scrollMath.bottomBoundary) || (showHorizontal && this.$.scrollMath.rightBoundary)) {
					// 	this.alertThumbs();
					// }
				} else {
					// Scrollers that don't need to scroll bubble their onRequestScrollIntoView,
					// to allow items in nested scrollers to be scrolled
					bubble = true;
				}
			}
			return !bubble;
		},

		// TODO: Figure out if there's something better than making every Scrollable a container
		spotlight: 'container'
	};
})(enyo, moon, this);