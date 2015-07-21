require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandableListItem~ExpandableListItem} kind.
* @module moonstone/ExpandableListItem
*/

var
	kind = require('enyo/kind'),
	Component = require('enyo/Component'),
	Control = require('enyo/Control'),
	Group = require('enyo/Group'),
	options = require('enyo/options');

var
	Spotlight = require('spotlight');

var
	ExpandableListDrawer = require('../ExpandableListDrawer'),
	Item = require('../Item'),
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text,
	ExpandableListItemAccessibilitySupport = require('./ExpandableListItemAccessibilitySupport');

/**
* {@link module:moonstone/ExpandableListItem~ExpandableListItem}, which extends {@link module:moonstone/Item~Item}, displays a header
* while also allowing additional content to be stored in an {@link module:enyo/Drawer~Drawer}. When
* the header is selected, the drawer opens below. To close the drawer, tap on the
* header text or navigate (via 5-way) back to the top of the drawer.
*
* The control's child components may be of any kind; by default, they are
* instances of `moon.Item`.
*
* ```
* 		{kind: 'moon.ExpandableListItem', content: 'A Countries', components: [
* 			{content: 'Algeria'},
* 			{content: 'Argentina'},
* 			{content: 'Australia'}
* 		]},
* 		{kind: 'moon.ExpandableListItem', content: 'B Countries', components: [
* 			{content: 'Belgium'},
* 			{content: 'Bolivia'},
* 			{content: 'Brazil'}
* 		]}
*
* When multiple ExpandableListItems are used in a group, only one may be open at
* a given time.
*
* ```
* 		{kind: 'enyo.Group', highlander: true, components: [
* 			{kind: 'moon.ExpandableListItem',  open: true,
* 			content: 'This is a grouped ExpandableListItem', components: [
* 				{content: 'Item One'},
* 				{content: 'Item Two'}
* 			]},
* 			{kind: 'moon.ExpandableListItem',
* 				content: 'This is another grouped ExpandableListItem', components: [
* 					{content: 'Item Three'},
* 					{content: 'Item Four'}
* 				]
* 			},
* 			{kind: 'moon.ExpandableListItem',
* 				content: 'This is yet another grouped ExpandableListItem', components: [
* 					{content: 'Item Five'},
* 					{content: 'Item Six'}
* 				]
* 			}
* 		]}
* ```
*
* @class ExpandableListItem
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandableListItem~ExpandableListItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableListItem',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	mixins: options.accessibility ? [ExpandableListItemAccessibilitySupport] : null,

	/**
	* @private
	* @lends module:moonstone/ExpandableListItem~ExpandableListItem.prototype
	*/
	published: {

		/**
		* If `true`, the drawer automatically closes when the user navigates to the top of the
		* control; if `false`, the user must select/tap the header to close the drawer.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		autoCollapse: false,

		/**
		* If `true`, the drawer is expanded, showing this item's contents. Use this property
		* (rather than [active]{@link module:moonstone/ExpandableListItem~ExpandableListItem#active}) to set the item's
		* initial state.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		open: false,

		/**
		* Boolean that reflects the value of the [open]{@link module:moonstone/ExpandableListItem~ExpandableListItem#open}
		* property; it is used to support the {@link module:enyo/Group~Group} API for grouping a set of
		* ExpandableListItems in which only one is expanded at a time. Note that the `open`
		* property (not the `active` property) controls the initial state of the picker.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		active: false,

		/**
		* If `true`, the user is prevented from moving {@glossary Spotlight} past the bottom
		* of the drawer (when open) using 5-way controls.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		lockBottom: false,

		/**
		* If `true`, item is shown as disabled and does not generate tap events.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false
	},

	/**
	* @private
	*/
	classes: 'moon-expandable-list-item',

	/**
	* @private
	*/
	spotlight: false,

	/**
	* @private
	*/
	defaultKind: Item,

	/**
	* @private
	*/
	drawerComponents: [
		{name: 'client', kind: Group, tag: null}
	],

	/**
	* @private
	*/
	handlers: {
		onSpotlightDown: 'spotlightDown',
		onDrawerAnimationEnd: 'drawerAnimationEnd'
	},

	/**
	* @private
	*/
	components: [
		// headerContainer required to avoid bad scrollWidth returned in RTL for certain text
		// widths (webkit bug)
		{name: 'headerWrapper', kind: Item, onSpotlightFocus: 'headerFocus', ontap: 'headerTapped', components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
			{name: 'headerContainer', kind: Control, classes: 'moon-expandable-list-item-header', components: [
				{name: 'header', kind: MarqueeText, accessibilityDisabled: true}
			]},
			{name: 'currentValue', kind: MarqueeText, classes: 'moon-expandable-list-item-current-value', accessibilityDisabled: true}
		]},
		{name: 'drawer', kind: ExpandableListDrawer, resizeContainer: false, classes: 'moon-expandable-list-item-client'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'active', to: 'open'},
		{from: 'allowHtml', to: '$.header.allowHtml'},
		{from: 'allowHtml', to: '$.currentValue.allowHtml'},
		{from: 'disabled', to: '$.headerWrapper.disabled'},
		{from: 'currentValueShowing', to: '$.currentValue.showing'},
		{from: 'currentValueText', to: '$.currentValue.content'}
	],

	/**
	* @private
	*/
	computed: {
		'currentValueShowing': ['open', 'value'],
		'currentValueText': ['value']
	},

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.openChanged();
		this.disabledChanged();
	},

	/**
	* @private
	*/
	initComponents: function () {
		var override = {drawer: {components: this.drawerComponents}};
		this.kindComponents = Component.overrideComponents(this.kindComponents, override);
		Control.prototype.initComponents.apply(this, arguments);
	},

	/**
	* Facade for header content.
	*
	* @private
	*/
	contentChanged: function () {
		this.$.header.set('content', this.content);
	},

	/**
	* Facade for drawer.
	*
	* @private
	*/
	openChanged: function () {
		var open = this.open;
		this.bubble('onActivate', {allowHighlanderDeactivate: true});
		this.addRemoveClass('open', open);
		this.$.drawer.set('open', open);
		this.$.drawer.spotlightDisabled = !open;
		this.set('active', open);
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		var disabled = this.disabled;

		this.addRemoveClass('disabled', disabled);
		if (disabled) {
			this.set('active', false);
		}
	},

	/**
	* Returns `true` if the current value control should be displayed.
	*
	* Note: ExpandableListItem doesn't support currentValue but its subkinds do
	*
	* @private
	*/
	currentValueShowing: function () {
		// If drawer is open or value is blank, don't bother to show the value.
		return (!this.open && (this.$.currentValue.content || this.$.currentValue.content === 0));
	},

	/**
	* Returns the text to be displayed within the current value control
	*
	* Note: ExpandableListItem doesn't support currentValue but its subkinds do
	*
	* @private
	*/
	currentValueText: function () {
		return '';
	},

	/**
	* If closed, opens drawer and highlights first spottable child.
	*
	* @private
	*/
	expandContract: function () {
		var spot;
		if (this.open) {
			this.closeDrawerAndHighlightHeader();
		} else {
			this.toggleActive();
		}

		if (!Spotlight.getPointerMode()) {
			spot = this.active ? Spotlight.getFirstChild(this.$.drawer) : this.$.headerWrapper;
			Spotlight.spot(spot);
		}
	},

	/**
	* @private
	*/
	toggleActive: function () {
		this.set('active', !this.open);
	},

	/**
	* We manually set pointer mode to `false` as this seems to be the
	* least harmful method to re-highlight the header after the drawer
	* closes. The other options had side effects of resetting the
	* current spotted control to the root, or requiring a double-press to
	* subsequently move via 5-way.
	*
	* @private
	*/
	closeDrawerAndHighlightHeader: function () {
		var mode = Spotlight.getPointerMode();
		Spotlight.setPointerMode(false);
		Spotlight.unfreeze();
		Spotlight.spot(this.$.headerWrapper);
		Spotlight.setPointerMode(mode);
		this.toggleActive();
	},

	/**
	* @private
	*/
	headerTapped: function (sender, event) {
		this.expandContract();
	},

	/**
	* If drawer is currently open, and event was sent via keypress (i.e., it has a direction),
	* process header focus.
	*
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	headerFocus: function (inSender, inEvent) {
		var direction = inEvent && inEvent.dir;

		if (this.open && this.autoCollapse && direction == 'UP') {
			this.set('active', false);
		}

		if (inEvent.originator == this.$.header) {
			this.bubble('onRequestScrollIntoView');
		}
	},

	/**
	* Check for the last item in the client area, and prevent 5-way focus movement below it,
	* per UX specs.
	*
	* @private
	*/
	spotlightDown: function (inSender, inEvent) {
		var children = Spotlight.getChildren(this.$.client);
		if (this.lockBottom && this.open && children.length && inEvent.originator == children[children.length - 1]) {
			return true;
		}
	},

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	drawerAnimationEnd: function () {
		this.bubble('onRequestScrollIntoView', {scrollInPointerMode: true});
		return true;
	}
});
