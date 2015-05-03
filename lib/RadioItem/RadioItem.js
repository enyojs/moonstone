require('moonstone');

var
	kind = require('enyo/kind');

var
	SelectableItem = require('../SelectableItem');

/**
* {@link moon.RadioItem} is a modified {@link moon.Item} designed for use inside
* a {@link moon.RadioItemGroup}.
*
* For more information, see the documentation on
* [Radio Items]{@linkplain $dev-guide/building-apps/controls/radio-items.html}
* in the Enyo Developer Guide.
*
* @class moon.RadioItem
* @extends moon.SelectableItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.RadioItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.RadioItem',

	/**
	* @private
	*/
	kind: SelectableItem,

	/**
	* @private
	*/
	create: function() {
		SelectableItem.prototype.create.apply(this, arguments);
		this.removeClass('moon-selectable-item');
		this.addClass('moon-radio-item');
	}
});