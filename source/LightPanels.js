(function (enyo, scope) {
	/**
	* A light-weight panels implementation that has basic support for side-to-side transitions
	* between child components.
	*
	* @class moon.LightPanels
	* @extends enyo.LightPanels
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.LightPanels.prototype */ {

		/**
		* @private
		*/
		name: 'moon.LightPanels',

		/**
		* @private
		*/
		kind: 'enyo.LightPanels',

		/**
		* @private
		*/
		defaultKind: 'moon.LightPanel',

		/**
		* @private
		*/
		handlers: {
			onSpotlightContainerEnter: 'enter',
			onSpotlightContainerLeave: 'leave'
		},

		/**
		* @private
		*/
		indexChanged: enyo.inherit(function (sup) {
			return function (previousIndex) {
				var panels = this.getPanels(),
					panelPrev = panels[previousIndex],
					panelNext = panels[this.index];

				if (panelPrev) {
					panelPrev.spotlightDisabled = true;
					if (this._hasSpotlightFocus) {
						enyo.Spotlight.unspot();
					}
				}
				if (panelNext) {
					panelNext.spotlightDisabled = false;
				}
				sup.apply(this, arguments);
			};
		}),

		/**
		* @private
		*/
		enter: function () {
			this._hasSpotlightFocus = true;
		},

		/**
		* @private
		*/
		leave: function () {
			this._hasSpotlightFocus = false;
		}

	});

})(enyo, this);