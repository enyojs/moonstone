(function (enyo, scope) {
	/**
	* `moon.ImageBadge`, which derives from [`moon.Icon`]{@link moon.Icon}, is a simple
	* control designed for use inside of [`moon.Image`]{@link moon.Image}.
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
