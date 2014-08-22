(function (enyo, scope) {
	/**
	* {@link moon.ToggleItem} is a control that combines a {@link moon.ToggleSwitch}
	* with a text label.
	*
	* @class moon.ToggleItem
	* @extends moon.CheckboxItem
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ToggleItem.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ToggleItem',

		/**
		* @private
		*/
		kind: 'moon.CheckboxItem',

		/**
		* @private
		*/
		icon: 'circle',

		/**
		* @private
		*/
		classes: 'moon-toggle-item',

		/**
		* @private
		*/
		checkboxOnRight: true,

		/**
		* @private
		*/
		componentOverrides: {
			client: {classes: 'moon-toggle-item-label-wrapper'},
			input: {kind: 'moon.ToggleSwitch', spotlight: false}
		}
	});

})(enyo, this);
