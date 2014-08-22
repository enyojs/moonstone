(function (enyo, scope) {
	/**
	* {@link moon.ImageBadge}, which derives from {@link moon.Icon}, is a simple
	* control designed for use inside of {@link moon.Image}.
	*
	* @class moon.ImageBadge
	* @extends moon.Icon
	* @ui
	* @public
	*/

	enyo.kind(
		/** @lends moon.ImageBadge.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ImageBadge',

		/**
		* @private
		*/
		kind: 'moon.Icon',

		/**
		* @private
		*/
		classes: 'moon-image-badge'
	});

})(enyo, this);
