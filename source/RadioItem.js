(function (enyo, scope) {
	/**
	 * _moon.RadioItem_ is a modified [moon.Item]{@link moon.Item} control designed for use inside
	 * a [moon.RadioItemGroup]{@link moon.RadioItemGroup}.
	 *
	 * For more information, see the documentation on [Radio Items]{@link building-apps/controls/radio-items.html}
	 * in the Enyo Developer Guide.
	 *
	 * @class moon.RadioItem
	 * @extends moon.SelectableItem
	 * @public
	 * @ui
	 */
	enyo.kind(
		/** @lends  moon.RadioItem.prototype */ {

		/**
		 * @private
		 */
		name: 'moon.RadioItem',

		/**
		 * @private
		 */
		kind: 'moon.SelectableItem',

		/**
		 * @private
		 */
		classes: 'moon-radio-item',

		/**
		 * @private
		 */
		componentOverrides: {
			indicator: {kind: 'moon.RadioItemIndicator'}
		}
	});

	/**
	 * _moon.RadioItemIndicator_ is a control designed for use with [moon.RadioItem]{@link moon.RadioItem}. It is used
	 * to display the indicator dot that appears when a RadioItem is selected.
	 *
	 * @class moon.RadioItemIndicator
	 * @extends enyo.Control
	 * @public
	 * @ui
	 */
	enyo.kind(
		/** @lends  moon.RadioItemIndicator.prototype */ {

		/**
		 * @private
		 */
		name: 'moon.RadioItemIndicator',

		/**
		 * @private
		 */
		kind: 'enyo.Control',

		/**
		 * @private
		 */
		classes: 'moon-radio-item-indicator',

		/**
		 * @private
		 */
		components: [
			{classes: 'moon-radio-item-indicator-center-dot'}
		]
	});

})(enyo, this);
