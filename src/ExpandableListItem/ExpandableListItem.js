require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandableListItem~ExpandableListItem} kind.
* @module moonstone/ExpandableListItem
*/

var
	kind = require('enyo/kind'),
	Component = require('enyo/Component'),
	Control = require('enyo/Control'),
	Group = require('enyo/Group');

var
	Spotlight = require('spotlight');

var
	Item = require('../Item');

var
	ExpandableListItemHeader = require('./ExpandableListItemHeader'),
	ExpandableListItemDrawer = require('./ExpandableListItemDrawer');

/**
* {@link module:moonstone/ExpandableListItem~ExpandableListItem}, which extends {@link module:moonstone/Item~Item}, displays a header
* while also allowing additional content to be stored in an {@link module:enyo/Drawer~Drawer}. When
* the header is selected, the drawer opens below. To close the drawer, tap on the
* header text or navigate (via 5-way) back to the top of the drawer.
*
* The control's child components may be of any kind; by default, they are
* instances of `moon.Item`.
*
* ```javascript
* var
* 	kind = require('enyo/kind'),
* 	ExpandableListItem = require('moonstone/ExpandableListItem');
*
* {kind: ExpandableListItem, content: 'A Countries', components: [
* 	{content: 'Algeria'},
* 	{content: 'Argentina'},
* 	{content: 'Australia'}
* ]},
* {kind: ExpandableListItem, content: 'B Countries', components: [
* 	{content: 'Belgium'},
* 	{content: 'Bolivia'},
* 	{content: 'Brazil'}
* ]}
* ```
*
* When multiple ExpandableListItems are used in a group, only one may be open at
* a given time.
*
* ```javascript
* var
* 	kind = require('enyo/kind'),
*	Group = require('enyo/Group'),
* 	ExpandableListItem = require('moonstone/ExpandableListItem');
*
* {kind: Group, highlander: true, components: [
* 	{kind: ExpandableListItem,  open: true,
* 		content: 'This is a grouped ExpandableListItem', components: [
* 			{content: 'Item One'},
* 			{content: 'Item Two'}
* 		]
* 	},
* 	{kind: ExpandableListItem,
* 		content: 'This is another grouped ExpandableListItem', components: [
* 			{content: 'Item Three'},
* 			{content: 'Item Four'}
* 		]
* 	},
* 	{kind: ExpandableListItem,
* 		content: 'This is yet another grouped ExpandableListItem', components: [
* 			{content: 'Item Five'},
* 			{content: 'Item Six'}
* 		]
* 	}
* ]}
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
	components: [
		{name: 'header', kind: ExpandableListItemHeader, ontap: 'headerTapped'},
		{name: 'drawer', kind: ExpandableListItemDrawer, resizeContainer: false, classes: 'moon-expandable-list-item-client', defaultSpotlightUp: 'header', onSpotlightUp: 'drawerSpotUp', onSpotlightDown: 'drawerSpotDown', onDrawerAnimationEnd: 'drawerAnimationEnd'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'active', to: 'open'},
		{from: 'allowHtml', to: '$.header.allowHtml'},
		{from: 'disabled', to: '$.header.disabled'},
		{from: 'content', to: '$.header.label'},
		{from: 'currentValueShowing', to: '$.header.textShowing'},
		{from: 'currentValueText', to: '$.header.text'},

		// Accessibility
		{from: 'accessibilityHint', to: '$.header.accessibilityHint'},
		{from: 'accessibilityLabel', to: '$.header.accessibilityLabel'},
		{from: 'accessibilityDisabled', to: '$.header.accessibilityDisabled'}
	],

	/**
	* @private
	*/
	computed: {
		'currentValueShowing': ['open', 'currentValueText'],
		'currentValueText': ['value']
	},

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.openChanged();
		this.disabledChanged();
		this.notifyObservers('value');
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
	* @fires module:enyo/GroupItem~GroupItem#onActivate
	* @private
	*/
	activeChanged: function () {
		this.bubble('onActivate', {allowHighlanderDeactivate:true});
		this.set('open', this.active);
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
		var text = this.get('currentValueText');
		// If drawer is open or value is blank, don't bother to show the value.
		return (!this.open && (text || text === 0));
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
		if (this.open) {
			this.closeDrawerAndHighlightHeader();
		} else {
			this.toggleActive();
			if (!Spotlight.getPointerMode() && !Spotlight.isFrozen()) {
				var first = Spotlight.getFirstChild(this.$.drawer);
				Spotlight.spot(first);
			}
		}
	},

	/**
	* @private
	*/
	toggleActive: function () {
		this.set('active', !this.open);
	},

	/**
	* @private
	*/
	closeDrawerAndHighlightHeader: function () {
		var current = Spotlight.getCurrent();

		// If the spotlight is elsewhere, we don't want to hijack it (e.g. after the delay in
		// ExpandablePicker)
		if (!current || current.isDescendantOf(this)) {
			if (Spotlight.getPointerMode()) Spotlight.unspot();
			else Spotlight.spot(this.$.header);
		}
		this.set('active', false);
	},

	/**
	* @private
	*/
	drawerSpotUp: function (sender, event) {
		if (this.autoCollapse && event.originator == this.$.drawer) {
			this.closeDrawerAndHighlightHeader();
			return true;
		}
	},

	/**
	* @private
	*/
	drawerSpotDown: function (sender, event) {
		if (this.lockBottom && event.originator == this.$.drawer && event._originator) {
			// Spotlight containers redispatch 5-way events with the original event originator
			// saved as _originator which we'll use to respot if lockBottom === true
			Spotlight.spot(event._originator);
			return true;
		}
	},

	/**
	* @private
	*/
	headerTapped: function (sender, event) {
		this.expandContract();
	},

	/**
	* When an expandable is in a group, we only want the opening control to scroll into view so that
	* event only fires when the drawer is open. Otherwise, we just request the scroller update its
	* bounds so that an expandable at the bottom of a scroller does not leave extra whitespace when
	* it closes.
	*
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @fires module:moonstone/Scroller~Scroller#onRequestSetupBounds
	* @private
	*/
	drawerAnimationEnd: function () {
		if (this.$.drawer.open) {
			this.bubble('onRequestScrollIntoView', {scrollInPointerMode: true});
		} else {
			this.bubble('onRequestSetupBounds');
		}
		return true;
	}
});
