require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/CheckboxItem~CheckboxItem} kind.
* @module moonstone/CheckboxItem
*/

var
	kind = require('enyo/kind'),
	options = require('enyo/options');

var
	Checkbox = require('../Checkbox'),
	Item = require('../Item'),
	Marquee = require('../Marquee'),
	MarqueeItem = Marquee.Item;

var
	CheckboxItemAccessibilitySupport = require('./CheckboxItemAccessibilitySupport');

/**
* Fires when the control is either checked or unchecked.
*
* @event module:moonstone/CheckboxItem~CheckboxItem#onActivate
* @type {Object}
* @property {Boolean} checked - Whether the checkbox is currently checked.
* @property {Object} toggledControl - A reference to the
*	{@link module:moonstone/CheckboxItem~CheckboxItem} whose state changed. (Note that the
*	originator of this event is actually the {@link module:moonstone/Checkbox~Checkbox} contained
*	within the CheckboxItem, so use this property
* to reference the CheckboxItem itself.)
*
* @public
*/

/**
* {@link module:moonstone/CheckboxItem~CheckboxItem} is a control that combines a
* {@link module:moonstone/Checkbox~Checkbox} with a text label. The label text may be set via the
* [content]{@link module:enyo/Control~Control#content} property. The state of the checkbox may be
* retrieved by querying the [checked]{@link module:moonstone/CheckboxItem~CheckboxItem#checked}
* property.
*
* ```
*		{kind: 'moon.CheckboxItem', content: 'San Francisco',
*			onchange: 'checkedChanged'},
*		...
*		checkedChanged: function (sender, ev) {
*			var checked = sender.get('checked');
*		}
* ```
*
* You may place CheckboxItem objects inside an {@link module:enyo/Group~Group} to create a group
* of checkboxes in which only one may be checked at any given time (similar to how a
* [RadioItemGroup]{@link module:moonstone/RadioItemGroup~RadioItemGroup} behaves):
*
* ```
*		{kind: 'Group', components: [
*			{kind: 'moon.CheckboxItem', content: 'New York'},
*			{kind: 'moon.CheckboxItem', content: 'London'},
*			{kind: 'moon.CheckboxItem', content: 'San Francisco'},
*			{kind: 'moon.CheckboxItem', content: 'Beijing'}
*		]}
* ```
*
* @class CheckboxItem
* @extends module:enyo/Control~Control
* @mixes moonstone/CheckboxItem/CheckboxItemAccessibilitySupport~CheckboxItemAccessibilitySupport
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/CheckboxItem~CheckboxItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.CheckboxItem',

	/**
	* @private
	*/
	kind: Item,

	/**
	* @private
	*/
	mixins: options.accessibility ? [CheckboxItemAccessibilitySupport] : null,

	/**
	* @private
	* @lends module:moonstone/CheckboxItem~CheckboxItem.prototype
	*/
	published: {

		/**
		* Boolean value indicating whether checkbox is currently checked.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		checked: false,

		/**
		* Boolean value indicating whether checkbox is currently active item in group.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		active: false,

		/**
		* If `true`, checkbox will be displayed on the right side of the checkbox item;
		* otherwise, it will be displayed on the left side.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		checkboxOnRight: false,

		/**
		* If `true`, the value of the
		* [checked]{@link module:moonstone/CheckboxItem~CheckboxItem#checked} property cannot be
		* changed through user input.
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
		* @type {String|module:enyo/resolution#selectSrc~src}
		* @default ''
		* @public
		*/
		src: '',

		/**
		* If used as the base control within a {@link module:moonstone/DataList~DataList} or
		* {@glossary subkind}, this should be set to `false` so that selection support can be
		* synchronized to the checked state of this control.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		handleTapEvent: true
	},

	/**
	* @private
	*/
	events: {

		/**
		* {@link module:moonstone/CheckboxItem~CheckboxItem#onActivate}
		*/
		onActivate: ''
	},

	/**
	* @private
	*/
	classes: 'moon-checkbox-item',

	/**
	* @private
	*/
	handlers: {
		ontap: 'tap',
		onActivate: 'decorateActivateEvent'
	},

	/**
	* @private
	*/
	components: [
		{name: 'client', accessibilityDisabled: true, mixins: [MarqueeItem], classes: 'moon-checkbox-item-label-wrapper'},
		{name: 'input', kind: Checkbox, accessibilityDisabled: true, spotlight: false}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'allowHtml', to: '$.client.allowHtml'},
		{from: 'active', to: '$.input.active', oneWay: false}
	],

	/**
	* @private
	*/
	create: function () {
		Item.prototype.create.apply(this, arguments);
		this.disabledChanged();
		this.checkboxOnRightChanged();
		this.lockedChanged();
	},

	/**
	* @private
	*/
	rendered: function () {
		Item.prototype.rendered.apply(this, arguments);
		if (this.get('src') != null || this.get('icon') != null) {
			this.srcChanged();
			this.iconChanged();
		}
		this.checkedChanged();
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		Item.prototype.disabledChanged.apply(this, arguments);
		this.$.input.set('disabled', this.disabled);
	},

	/**
	* @private
	*/
	checkedChanged: function () {
		this.$.input.set('checked', this.checked);
	},

	/**
	* @private
	*/
	checkboxOnRightChanged: function () {
		this.addRemoveClass('left-handed', !this.checkboxOnRight);
	},

	/**
	* waterfall event
	* @fires module:enyo/Control~Control#ontap
	* @private
	*/
	tap: function (sender, ev) {
		if (this.disabled) return true;
		if (this.handleTapEvent) {
			if (sender != this.$.input) {
				this.waterfallDown('ontap', ev, sender);
			}
		}
	},

	/**
	* @fires module:moonstone/CheckboxItem~CheckboxItem#onActivate
	* @private
	*/
	decorateActivateEvent: function (sender, ev) {
		ev.toggledControl = this;
		this.set('checked', this.$.input.checked);
		ev.checked = this.checked;
	},

	/**
	* @private
	*/
	contentChanged: function () {
		this.$.client.set('content', this.content);
	},

	/**
	* @private
	*/
	lockedChanged: function() {
		this.$.input.set('locked', this.locked);
	},

	/**
	* @private
	*/
	iconChanged: function() {
		this.$.input.set('icon', this.icon);
	},

	/**
	* @private
	*/
	srcChanged: function() {
		this.$.input.set('src', this.src);
	}
});
