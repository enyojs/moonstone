(function (enyo, scope) {
	/**
	* _moon.ImageBadge_, which derives from [moon.Icon]{@link moon.Icon}, is a simple
	* control designed for use inside of [moon.Image]{@link moon.Image}.
	*
	* @ui
	* @class moon.ImageBadge
	* @extends moon.Icon
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
