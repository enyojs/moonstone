/**
* Contains the declaration for the {@link module:moonstone/ExpandableListItem~ExpandableListItemHeader} kind.
* @module moonstone/ExpandableListItem
*/

var
	kind = require('enyo/kind'),
	Component = require('enyo/Component');

var
	Marquee = require('../Marquee'),
	LabeledTextItem = require('../LabeledTextItem');

/**
* @class ExpandableListItemHeader
* @extends module:moonstone/LabeledTextItem~LabeledTextItem
* @ui
* @private
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandableListItem~ExpandableListItemHeader.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableListItemHeader',

	/**
	* @private
	*/
	kind: LabeledTextItem,

	/**
	* When `true`, the value of {@link module:moonstone/LabeledTextItem~LabeledTextItem#text}
	* will be displayed
	*
	* @type {Boolean}
	* @default true
	* @public
	*/
	textShowing: true,

	/**
	* @private
	*/
	bindings: [
		{from: 'textShowing', to: '$.text.showing'},
		{from: 'allowHtml', to: '$.text.allowHtml'}
	],

	/**
	* @private
	*/
	initComponents: function () {
		this.kindComponents = Component.overrideComponents(this.kindComponents, {text: {kind: Marquee.Text}});
		LabeledTextItem.prototype.initComponents.apply(this, arguments);
	},

	// Accessibility

	/**
	* @private
	*/	
	ariaObservers: [
		{from: 'textShowing', method: function () {
			this.$.text.set('accessibilityDisabled', !this.textShowing);
		}}
	]
});
