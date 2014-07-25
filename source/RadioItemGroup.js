(function (enyo, scope) {
	/**
	 * _moon.RadioItemGroup_ is a container in which a group of [moon.RadioItem]{@link moon.RadioItem} objects are
	 * laid out horizontally. Within a group, only one item may be active at a time; tapping on an item will
	 * deactivate any previously-tapped item.
	 *
	 * ```
	 * {kind: 'moon.RadioItemGroup', onActivate: 'buttonActivated', components: [
	 *	{content: 'Lions', selected: true},
	 *	{content: 'Tigers'},
	 *	{content: 'Bears'}
	 * ]}
	 * ```
	 *
	 * @class moon.RadioItemGroup
	 * @extends enyo.Group
	 * @public
	 * @ui
	 */
	enyo.kind(
		/** @lends  moon.RadioItemGroup.prototype */ {

		/**
		 * @private
		 */
		name: 'moon.RadioItemGroup',

		/**
		 * @private
		 */
		kind: 'enyo.Group',

		/**
		 * @private
		 */
		classes: 'moon-radio-item-group',

		/**
		 * @private
		 */
		defaultKind: 'moon.RadioItem'
	});

})(enyo, this);
