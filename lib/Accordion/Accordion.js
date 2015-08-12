require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Accordion~Accordion} kind.
* @module moonstone/Accordion
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Drawer = require('enyo/Drawer'),
	Group = require('enyo/Group'),
	options = require('enyo/options');

var
	ExpandableListItem = require('../ExpandableListItem'),
	Item = require('../Item'),
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text,
	AccordionAccessibilitySupport = require('./AccordionAccessibilitySupport');

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
* ```
* {kind: 'moon.Accordion', content: 'This is an accordion', components: [
* 	{content: 'Item One'},
* 	{content: 'Item Two'}
* ]},
* {kind: 'moon.Accordion', content: 'This is another accordion', components: [
* 	{content: 'Item Three'},
* 	{content: 'Item Four'}
* ]}
* ```
*
* When multiple Accordions are used in a group, only one may be open at a given time.
*
* ```
* {kind: 'Group', highlander: true, components: [
* 	{kind: 'moon.Accordion',  open: true, content: 'This is a grouped accordion', components: [
* 		{content: 'Item One'},
* 		{content: 'Item Two'}
* 	]},
* 	{kind: 'moon.Accordion', content: 'This is another grouped accordion', components: [
* 		{content: 'Item Three'},
* 		{content: 'Item Four'}
* 	]},
* 	{kind: 'moon.Accordion', content: 'This is yet another grouped accordion', components: [
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
	mixins: options.accessibility ? [AccordionAccessibilitySupport] : null,	

	/**
	* @private
	*/
	classes: 'moon-accordion',

	/**
	* @private
	*/
	components: [
		{name: 'headerWrapper', kind: Item, classes: 'moon-accordion-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths
			// (webkit bug)
			{name: 'headerContainer', kind: Control, classes: 'moon-expandable-list-item-header moon-accordion-header', components: [
				{name: 'header', kind: MarqueeText, accessibilityDisabled: true}
			]}
		]},
		{name: 'drawer', kind: Drawer, resizeContainer:false, classes: 'moon-expandable-list-item-client', components: [
			{name: 'client', kind: Group, tag: null}
		]}
	],

	/**
	* @private
	*/
	bindings: [
		{from: '.disabled', to: '.$.headerWrapper.disabled'}
	]
});
