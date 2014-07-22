(function (enyo, scope) {
	/**
	* _moon.ContextualPopupButton_ is a {@link moon.Button} with additional
	* styling applied.
	*
	* For more information, see the documentation on
	* [Buttons](building-apps/controls/buttons.html) in the Enyo Developer Guide.
	*
	* @ui
	* @class moon.ContextualPopupButton
	* @extends moon.Button
	* @public
	*/

	enyo.kind(
		/** @lends moon.ContextualPopupButton.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ContextualPopupButton',

		/**
		* @private
		*/
		kind: 'moon.Button',

		/**
		* @private
		*/
		classes: 'contextual-popup-button'
	});

})(enyo, this);
