require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Checkbox = require('../Checkbox');

/**
* {@link moon.ToggleText}, which extends {@link moon.Checkbox}, is a control that
* looks like a switch with labels for an 'on' state and an 'off' state. When tapped,
* it switches its state and fires an [onChange]{@link enyo.Checkbox#onChange}
* event.
*
* **Note:** {@link moon.Checkbox#icon} and {@link moon.Checkbox#src} are not supported.
*
* @class moon.ToggleText
* @extends moon.Checkbox
* @deprecated Replaced by {@link moon.ToggleButton} and {@link moon.ToggleItem}
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ToggleText.prototype */ {

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
	* @lends moon.ToggleText.prototype
	*/
	published: {
		/**
		* Text label for the 'on' state.
		*
		* @type {String}
		* @default 'moon.$L('on')'
		* @public
		*/
		onContent: moon.$L('on'),   // i18n 'ON' label in moon.ToggleText widget

		/**
		* Text label for the 'off' state.
		*
		* @type {String}
		* @default 'moon.$L('off')'
		* @public
		*/
		offContent: moon.$L('off'), // i18n 'OFF' label in moon.ToggleText widget

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