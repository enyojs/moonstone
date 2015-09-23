require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ToggleText~ToggleText} kind.
* @module moonstone/ToggleText
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	$L = require('../i18n'),
	Checkbox = require('../Checkbox');

/**
* {@link module:moonstone/ToggleText~ToggleText}, which extends {@link module:moonstone/Checkbox~Checkbox}, is a control that
* looks like a switch with labels for an 'on' state and an 'off' state. When tapped,
* it switches its state and fires an [onChange]{@link module:enyo/Checkbox~Checkbox#onChange}
* event.
*
* **Note:** {@link module:moonstone/Checkbox~Checkbox#icon} and {@link module:moonstone/Checkbox~Checkbox#src} are not supported.
*
* @class ToggleText
* @extends module:moonstone/Checkbox~Checkbox
* @deprecated Replaced by {@link module:moonstone/ToggleButton~ToggleButton} and {@link module:moonstone/ToggleItem~ToggleItem}
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ToggleText~ToggleText.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ToggleText',

	/**
	* @private
	*/
	kind: Checkbox,

	/**
	* @private
	* @lends module:moonstone/ToggleText~ToggleText.prototype
	*/
	published: {
		/**
		* Text label for the 'on' state.
		*
		* @type {String}
		* @default 'moon.$L('on')'
		* @public
		*/
		onContent: $L('on'),   // i18n 'ON' label in moon.ToggleText widget

		/**
		* Text label for the 'off' state.
		*
		* @type {String}
		* @default 'moon.$L('off')'
		* @public
		*/
		offContent: $L('off'), // i18n 'OFF' label in moon.ToggleText widget

		/**
		* When `true`, the content will have locale-safe uppercasing applied.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		uppercase: true
	},

	/**
	* @private
	*/
	icon: null,

	/**
	* @private
	*/
	src: null,

	/**
	* @private
	*/
	classes: 'moon-toggle-text',

	/**
	* @private
	*/
	components: [
		{name: 'label', kind: Control, classes: 'moon-toggle-text-text'}
	],

	/**
	* @private
	*/
	create: function () {
		Checkbox.prototype.create.apply(this, arguments);
		this.checkedChanged();
	},

	/**
	* @private
	*/
	checkedChanged: function () {
		Checkbox.prototype.checkedChanged.apply(this, arguments);
		this.$.label.setContent(this.getChecked() ? this.onContent : this.offContent);
	},

	/**
	 * src is not supported
	 *
	 * @private
	 */
	srcChanged: function () {},

	/**
	 * icon is not supported
	 *
	 * @private
	 */
	iconChanged: function () {},

	/**
	* @private
	*/
	uppercaseChanged: function () {
		this.checkedChanged();
	}
});
