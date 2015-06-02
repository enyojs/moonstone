require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/CheckboxItem~CheckboxItem} kind.
* @module moonstone/CheckboxItem
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Checkbox = require('../Checkbox'),
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeItem = Marquee.Item;

/**
* Fires when the control is either checked or unchecked.
*
* @event module:moonstone/CheckboxItem~CheckboxItem#onActivate
* @type {Object}
* @property {Boolean} checked - Whether the checkbox is currently checked.
* @property {Object} toggledControl - A reference to the {@link module:moonstone/CheckboxItem~CheckboxItem}
*	whose state changed. (Note that the originator of this event is actually the
*	{@link module:moonstone/Checkbox~Checkbox} contained within the CheckboxItem, so use this property
* to reference the CheckboxItem itself.)
*
* @public
*/

/**
* {@link module:moonstone/CheckboxItem~CheckboxItem} is a control that combines a {@link module:moonstone/Checkbox~Checkbox} with
* a text label. The label text may be set via the [content]{@link module:enyo/Control~Control#content}
* property. The state of the checkbox may be retrieved by querying the
* [checked]{@link module:moonstone/CheckboxItem~CheckboxItem#checked} property.
*
* ```
*		{kind: 'moon.CheckboxItem', content: 'San Francisco',
*			onchange: 'checkedChanged'},
*		...
*		checkedChanged: function (inSender, inEvent) {
*			var checked = inSender.get('checked');
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
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
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
	kind: Control,

	/**
	* @private
	*/
	mixins: [MarqueeSupport],


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
		* If `true`, checkbox is shown as disabled and does not generate tap events.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false,

		/**
		* If `true`, the value of the [checked]{@link module:moonstone/CheckboxItem~CheckboxItem#checked} property
		* cannot be changed through user input.
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
		* If used as the base control within a {@link module:moonstone/DataList~DataList} or {@glossary subkind},
		* this should be set to `false` so that selection support can be synchronized to the
		* checked state of this control.
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
	classes: 'moon-item moon-checkbox-item',

	/**
	* @private
	*/
	spotlight: true,

	/**
	* @private
	*/
	handlers: {
		ontap: 'tap',
		onActivate: 'decorateActivateEvent',
		onSpotlightFocused: 'spotlightFocused'
	},

	/**
	* @private
	*/
	components: [
		{name: 'client', mixins: [MarqueeItem], classes: 'moon-checkbox-item-label-wrapper'},
		{name: 'input', kind: Checkbox, spotlight: false}
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
		Control.prototype.create.apply(this, arguments);
		this.disabledChanged();
		this.checkboxOnRightChanged();
		this.lockedChanged();
	},

	/**
	* @private
	*/
	rendered: function () {
		Control.prototype.rendered.apply(this, arguments);
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
		this.addRemoveClass('disabled', this.disabled);
		this.$.input.setDisabled(this.disabled);
	},

	/**
	* @private
	*/
	checkedChanged: function () {
		this.$.input.setChecked(this.getChecked());
	},

	/**
	* @private
	*/
	checkboxOnRightChanged: function () {
		this.addRemoveClass('left-handed', !this.getCheckboxOnRight());
	},

	/**
	* waterfall event
	* @fires module:enyo/Control~Control#ontap
	* @private
	*/
	tap: function (inSender, inEvent) {
		if (this.handleTapEvent) {
			if (inSender != this.$.input) {
				this.waterfallDown('ontap', inEvent, inSender);
			}
		}
	},

	/**
	* @fires module:moonstone/CheckboxItem~CheckboxItem#onActivate
	* @private
	*/
	decorateActivateEvent: function (inSender, inEvent) {
		inEvent.toggledControl = this;
		this.setChecked(this.$.input.getChecked());
		inEvent.checked = this.checked;
	},

	/**
	* @fires module:moonstone/Scroller~Scroller#onRequestScrollIntoView
	* @private
	*/
	spotlightFocused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble('onRequestScrollIntoView');
		}
	},

	/**
	* @private
	*/
	contentChanged: function () {
		this.$.client.setContent(this.getContent());
	},

	/**
	* @private
	*/
	lockedChanged: function() {
		this.$.input.setLocked(this.locked);
	},

	/**
	* @private
	*/
	iconChanged: function() {
		this.$.input.setIcon(this.icon);
	},

	/**
	* @private
	*/
	srcChanged: function() {
		this.$.input.setSrc(this.src);
	}
});
