require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Accordion~Accordion} kind.
* @module moonstone/Accordion
*/

var
	kind = require('enyo/kind');

var
	ExpandableListItem = require('./ExpandableListItem');

/**
* {@link module:moonstone/Accordion~Accordion} is a {@link module:moonstone/ExpandableListItem~ExpandableListItem} with an arrow button
* to the right of the header and additional margin space to the left of the item list.
*
* To open or close the drawer, tap on the header text or navigate (via 5-way)
* back to the top of the drawer.
*
* The control's child components may be of any kind; by default, they are
* instances of {@link module:moonstone/Item~Item}.
*
* ```javascript
* var
* 	kind = require('enyo/kind'),
* 	Accordion = require('moonstone/Accordion');
*
* {kind: Accordion, content: 'This is an accordion', components: [
* 	{content: 'Item One'},
* 	{content: 'Item Two'}
* ]},
* {kind: Accordion, content: 'This is another accordion', components: [
* 	{content: 'Item Three'},
* 	{content: 'Item Four'}
* ]}
* ```
*
* When multiple Accordions are used in a group, only one may be open at a given time.
*
* ```
* var
* 	kind = require('enyo/kind'),
* 	Group = require('enyo/Group'),
* 	Accordion = require('moonstone/Accordion');
*
* {kind: Group, highlander: true, components: [
* 	{kind: Accordion, open: true, content: 'This is a grouped accordion', components: [
* 		{content: 'Item One'},
* 		{content: 'Item Two'}
* 	]},
* 	{kind: Accordion, content: 'This is another grouped accordion', components: [
* 		{content: 'Item Three'},
* 		{content: 'Item Four'}
* 	]},
* 	{kind: Accordion, content: 'This is yet another grouped accordion', components: [
* 		{content: 'Item Five'},
* 		{content: 'Item Six'}
* 	]}
* ]}
* ```
*
* @class Accordion
* @extends module:moonstone/ExpandableListItem~ExpandableListItem
* @ui
* @public
* @deprecated Identical to {@link module:moonstone/ExpandableListItem~ExpandableListItem}
*/
module.exports = kind(
	/** @lends module:moonstone/Accordion~Accordion.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Accordion',

	/**
	* @private
	*/
	kind: ExpandableListItem,

	/**
	* @private
	*/
	classes: 'moon-accordion'
});
