require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Checkbox~Checkbox} kind.
* @module moonstone/Checkbox
*/

var
	kind = require('enyo/kind'),
	ri = require('enyo/resolution'),
	Checkbox = require('enyo/Checkbox');

var
	Icon = require('../Icon');

/**
* {@link module:moonstone/Checkbox~Checkbox} is a box that, when tapped, shows or hides a checkmark
* and fires an [onChange]{@link module:enyo/Checkbox~Checkbox#onChange} event. It derives from
* {@link module:enyo/Checkbox~Checkbox} and is designed to be used with {@link module:moonstone/CheckboxItem~CheckboxItem}.
*
* @class Checkbox
* @extends module:enyo/Checkbox~Checkbox
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Checkbox~Checkbox.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Checkbox',

	/**
	* @private
	*/
	kind: Checkbox,

	/**
	* @private
	*/
	classes: 'moon-checkbox',

	/**
	* @private
	* @lends module:moonstone/Checkbox~Checkbox.prototype
	*/
	published: {
		/**
		* If `true`, the `checked` property cannot be changed through user input.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		locked: false,

		/**
		* Name of a font-based icon to use when displaying the checkbox. Consult
		* {@link module:moonstone/Icon~Icon} for valid values.
		*
		* @type {String}
		* @default 'check'
		* @public
		*/
		icon: 'check',

		/**
		* Optional path to an image asset. May be used to customize checkbox appearance.
		*
		* @type {String|moon.ri.selectSrc~src}
		* @default ''
		* @public
		*/
		src: ''
	},

	/**
	* @private
	*/
	tag: 'div',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	handlers: {

		/**
		* prevent double onchange bubble in IE
		* @private
		*/
		onclick: ''
	},

	/**
	* @private
	*/
	components: [
		{name: 'checkboxIcon', kind: Icon, icon: 'check'}
	],

	/**
	* @private
	*/
	rendered: function () {
		Checkbox.prototype.rendered.apply(this, arguments);
		this.srcChanged();
		this.iconChanged();
	},

	/**
	* @fires module:enyo/Checkbox~Checkbox#onChange
	* @private
	*/
	tap: function (inSender, e) {
		if (!this.disabled && !this.locked) {
			this.setChecked(!this.getChecked());
			this.bubble('onchange');
		} else {
			return true;
		}
	},

	/**
	* @private
	*/
	dragstart: function () {
		// Override enyo.Input dragstart handler, to allow drags to propagate for Checkbox
	},

	/**
	* @private
	*/
	iconChanged: function() {
		this.$.checkboxIcon.setIcon(this.icon);
	},

	/**
	* @private
	*/
	srcChanged: function() {
		this.$.checkboxIcon.setSrc(ri.selectSrc(this.src));
	}
});
