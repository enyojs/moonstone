require('moonstone');

/**
* Contains the declaration for the {@link moon.SelectableItem} kind.
* @module moonstone/SelectableItem
*/

var
	kind = require('enyo/kind'),
	utils = require('enyo/utils');

var
	Item = require('../Item');

/**
* Fires when the item is tapped. No event-specific data is sent with this event.
*
* @event moon.SelectableItem#onActivate
* @type {Object}
* @public
*/

/**
* {@link moon.SelectableItem} is a {@link moon.Item} with a flag to track
* selection state.  It is particularly useful within the context of the
* [Enyo Group API]{@link enyo.Group}.
*
* When selected, the item appears as underlined.
*
* If multiple SelectableItem objects are used in a group, only one of them
* may be in the selected state at a given time.
*
* @namespace moon
* @class moon.SelectableItem
* @extends moon.Item
* @ui
* @definedby module:moonstone/SelectableItem
* @public
*/
module.exports = kind(
	/** @lends moon.SelectableItem.prototype */ {

	/**
	* @private
	*/
	name: 'moon.SelectableItem',

	/**
	* @private
	*/
	kind: Item,
	
	/**
	* @private
	*/
	classes: 'moon-selectable-item',
	
	/**
	* @private
	*/
	events: {
		onActivate: ''
	},
	
	/**
	* @private
	*/
	handlers: {
		// Prevents double bubbling of _onchange_ in IE.
		onclick: ''
	},

	/**
	* @private
	* @lends moon.SelectableItem.prototype
	*/
	published: {

		/**
		* Will be `true` if this item is currently selected; otherwise, `false`.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		selected: false,

		/**
		* For use with the [Enyo Group API]{@link enyo.Group}. Will be `true` if this item
		* is the selected item in the group. Within this kind, the
		* [selected]{@link moon.SelectableItem#selected} and `active` properties appear to
		* behave similarly; however, `active` is meant to be used by {@link enyo.Group},
		* while `selected` is to be used for changing selection state.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		active: false,
		
		/**
		* If used as the base control within a {@link moon.DataList} or {@glossary subkind},
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
	* @method
	* @private
	*/
	create: function() {
		Item.prototype.create.apply(this, arguments);
		this.contentChanged();
		this.updateSelectedValue();
	},

	/**
	* @private
	*/
	rendered: function() {
		Item.prototype.rendered.apply(this, arguments);
		this.updateActiveValue();
	},

	/**
	* @private
	*/
	shouldDoTransition: function(selected) {
		return selected === true;
	},

	/**
	* @private
	*/
	tap: function(sender, e) {
		if (this.disabled) {
			return true;
		}
		if (this.handleTapEvent) {
			this.setActive(!this.getActive());
			this.bubble('onchange');
		}
	},

	/**
	* @private
	*/
	updateSelectedValue: function() {
		var selected = this.getSelected();
		this.addRemoveClass('selected', selected);
		this.setNodeProperty('selected', selected);
		this.setAttribute('selected', selected ? 'selected' : '');
		this.reflow();
	},

	/**
	* @private
	*/
	updateActiveValue: function() {
		this.setActive(this.getSelected());
	},

	/**
	* @private
	*/
	selectedChanged: function() {
		this.updateSelectedValue();
		this.updateActiveValue();
	},

	/**
	* For use with the [Enyo Group API]{@link enyo.Group}, which is supported by this object.
	* Called when the active item within the group changes. The
	* [active]{@link moon.SelectableItem#active} property and
	* [onActivate]{@link moon.SelectableItem#onActivate} event are both part of the
	* Group API.
	*
	* @private
	*/
	activeChanged: function() {
		this.active = utils.isTrue(this.active);
		this.setSelected(this.active);
		this.resetMarquee();
		this.bubble('onActivate');
	}
});
