(function (enyo, scope) {
	/**
	* {@link moon.Divider} is a simply styled component that may be used as a separator
	* between groups of components.
	*
	* @class moon.Divider
	* @mixes moon.MarqueeSupport
	* @mixes moon.MarqueeItem
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Divider.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Divider',

		/**
		* @private
		*/
		classes: 'moon-divider moon-divider-text',

		/**
		* @private
		*/
		mixins: ['moon.MarqueeSupport', 'moon.MarqueeItem'],

		/**
		* @private
		*/
		marqueeOnSpotlight: false,

		/**
		* @private
		*/
		marqueeOnRender: true
	});

})(enyo, this);
