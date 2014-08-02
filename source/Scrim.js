(function (enyo, scope) {
	/**
	* `moon.Scrim` is a Moonstone-styled {@link enyo.Scrim}
	*
	* @class moon.Scrim
	* @extends enyo.Scrim
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  moon.Scrim.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Scrim',

		/**
		* @private
		*/
		kind: 'enyo.Scrim',

		/**
		* @private
		*/
		classes: 'moon-scrim'
	});

	new enyo.scrimSingleton('moon.scrim', {floating: true, classes: 'moon-scrim moon-scrim-translucent'});
	new enyo.scrimSingleton('moon.scrimTransparent', {floating: true, classes: 'moon-scrim moon-scrim-transparent'});

})(enyo, this);
