require('moonstone');

/**
* Contains the declaration for the {@link moon.RadioItemGroup} kind.
* @module moonstone/RadioItemGroup
*/

var
	kind = require('enyo/kind'),
	Group = require('enyo/Group');

var
	RadioItem = require('../RadioItem');

/**
* {@link moon.RadioItemGroup} is a container in which a group of {@link moon.RadioItem}
* objects are laid out horizontally. Within a group, only one item may be active at a
* time; tapping on an item will deactivate any previously-tapped item.
*
* ```
* {kind: 'moon.RadioItemGroup', onActivate: 'buttonActivated', components: [
*	{content: 'Lions', selected: true},
*	{content: 'Tigers'},
*	{content: 'Bears'}
* ]}
* ```
*
* @namespace moon
* @class moon.RadioItemGroup
* @extends enyo.Group
* @ui
* @definedby module:moonstone/RadioItemGroup
* @public
*/
module.exports = kind(
	/** @lends  moon.RadioItemGroup.prototype */ {

	/**
	* @private
	*/
	name: 'moon.RadioItemGroup',

	/**
	* @private
	*/
	kind: Group,

	/**
	* @private
	*/
	classes: 'moon-radio-item-group',

	/**
	* @private
	*/
	defaultKind: RadioItem
});
