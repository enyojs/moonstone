require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Drawer = require('enyo/Drawer'),
	Group = require('enyo/Group');

var
	ExpandableListItem = require('../ExpandableListItem'),
	Item = require('../Item'),
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text;

/**
* {@link moon.Accordion} is a {@link moon.ExpandableListItem} with an arrow button
* to the right of the header and additional margin space to the left of the item list.
*
* To open or close the drawer, tap on the header text or navigate (via 5-way)
* back to the top of the drawer.
*
* The control's child components may be of any kind; by default, they are
* instances of {@link moon.Item}.
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
* @class moon.Accordion
* @extends moon.ExpandableListItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.Accordion.prototype */ {

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
	classes: 'moon-accordion',

	/**
	* @private
	*/
	components: [
		{name: 'headerWrapper', kind: Item, classes: 'moon-accordion-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths
			// (webkit bug)
			{name: 'headerContainer', kind: Control, classes: 'moon-expandable-list-item-header moon-expandable-picker-header moon-accordion-header', components: [
				{name: 'header', kind: MarqueeText}
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