require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/SimplePicker~SimplePicker} kind.
* @module moonstone/SimplePicker
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	Control = require('enyo/Control');

var
	IconButton = require('../IconButton'),
	Marquee = require('../Marquee'),
	MarqueeSupport = Marquee.Support,
	MarqueeText	= Marquee.Text;

/**
* Fires when the currently selected item changes.
*
* @event module:moonstone/SimplePicker~SimplePicker#onChange
* @type {Object}
* @property {module:enyo/Control~Control} selected - A reference to the currently selected item.
* @property {String} content - The content of the currently selected item.
* @property {Number} index - The index of the currently selected item.
* @public
*/

/**
* {@link module:moonstone/SimplePicker~SimplePicker} is a [control]{@link module:enyo/Control~Control} that solicits a
* choice from the user by cycling through a list of options. The picker's child
* [components]{@link module:enyo/Component~Component}, {@link module:moonstone/Marquee~MarqueeText}
* [objects]{@glossary Object} by default, become the options for the picker.
*
* ```javascript
* {kind: 'moon.SimplePicker', onChange: 'changed', selectedIndex: 1, components: [
*	{content: 'San Francisco'},
*	{content: 'Boston'},
*	{content: 'Tokyo'}
* ]}
* ```
*
* The picker may be changed programmatically by calling
* [previous()]{@link module:moonstone/SimplePicker~SimplePicker#previous} or [next()]{@link module:moonstone/SimplePicker~SimplePicker#next},
* or by modifying the [selectedIndex]{@link module:moonstone/SimplePicker~SimplePicker#selectedIndex} published
* property by calling `set('selectedIndex', <value>)`.
*
* The picker options may be modified programmatically in the standard manner, by calling
* `createComponent().render()` or `destroy()`.
*
* ```javascript
* // Add new items to picker
* this.$.picker.createComponent({'New York'}).render();
* this.$.picker.createComponent({'London'}).render();
*
* // Remove currently selected item from picker
* this.$.picker.getSelected().destroy();
* ```
*
* @class SimplePicker
* @extends module:enyo/Control~Control
* @mixes module:moonstone/Marquee~MarqueeSupport
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/SimplePicker~SimplePicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.SimplePicker',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-simple-picker',

	/**
	* @private
	*/
	mixins: [MarqueeSupport],

	/**
	* @private
	*/
	events: {
		onChange: ''
	},

	/**
	* @private
	* @lends module:moonstone/SimplePicker~SimplePicker.prototype
	*/
	published: {

		/**
		* Reference to currently selected item, if any.
		*
		* @type {module:enyo/Control~Control}
		* @default ''
		* @public
		*/
		selected: '',

		/**
		* Index of currently selected item, if any.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		selectedIndex: 0,

		/**
		* When `true`, picker transitions animate left/right.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		animate: true,

		/**
		* When `true`, buttons are shown as disabled and do not generate tap events.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		disabled: false,

		/**
		* When `true`, picker will wrap around from last item to first.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		wrap: false,

		/**
		* By default, {@link module:moonstone/SimplePicker~SimplePicker} is an inline-block element;
		* setting `block: true` makes it a block element.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		block: false
	},

	/**
	* @private
	*/
	defaultKind: MarqueeText,

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocused: 'scrollIntoView'
	},

	/**
	* @private
	*/
	components: [
		{name: 'buttonLeft',  kind: IconButton, noBackground:true, classes: 'moon-simple-picker-button left', icon:'arrowlargeleft', onSpotlightSelect: 'left', ondown: 'downLeft', onholdpulse:'left', defaultSpotlightDisappear: 'buttonRight'},
		{name: 'clientWrapper', kind: Control, classes:'moon-simple-picker-client-wrapper', components: [
			{name: 'client', kind: Control, classes: 'moon-simple-picker-client'}
		]},
		{name: 'buttonRight', kind: IconButton, noBackground:true, classes: 'moon-simple-picker-button right', icon:'arrowlargeright', onSpotlightSelect: 'right', ondown: 'downRight', onholdpulse:'right', defaultSpotlightDisappear: 'buttonLeft'}
	],

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.animateChanged();
		this.initializeActiveItem();
		this.disabledChanged();
		this.selectedIndexChanged();
		this.updateMarqueeDisable();
		this.blockChanged();
		this.showHideNavButtons();
	},

	/**
	* @private
	*/
	scrollIntoView: function() {
		this.bubble('onRequestScrollIntoView');
	},

	/**
	* @fires module:moonstone/SimplePicker~SimplePicker#onChange
	* @private
	*/
	fireChangedEvent: function() {
		if (!this.generated) {
			return;
		}

		this.doChange({
			selected:   this.selected,
			content:    this.selected && this.selected.content,
			index:      this.selected && this.selectedIndex
		});
	},

	/**
	* @private
	*/
	blockChanged: function() {
		this.addRemoveClass('block', this.block);
	},

	/**
	* Shows/hides previous/next buttons based on current index.
	*
	* @private
	*/
	showHideNavButtons: function() {
		var index = this.getSelectedIndex(),
			maxIndex = this.getClientControls().length - 1;
		var prevButton = this.$.buttonLeft;
		var nextButton = this.$.buttonRight;

		if (this.disabled) {
			this.hideNavButton(prevButton);
			this.hideNavButton(nextButton);
		// Always show buttons if _this.wrap_ is _true_
		} else if (this.wrap) {
			this.showNavButton(prevButton);
			this.showNavButton(nextButton);
		// If we have one or less options, always show no buttons
		} else if (maxIndex <= 0) {
			this.hideNavButton(prevButton);
			this.hideNavButton(nextButton);
		// If we are on the first option, hide the left button
		} else if (index <= 0) {
			this.showNavButton(nextButton);
			this.hideNavButton(prevButton);
		// If we are on the last item, hide the right button
		} else if (index >= maxIndex) {
			this.showNavButton(prevButton);
			this.hideNavButton(nextButton);
		// Otherwise show both buttons
		} else {
			this.showNavButton(prevButton);
			this.showNavButton(nextButton);
		}
	},

	/**
	* @private
	*/
	destroy: function() {
		this.destroying = true;
		Control.prototype.destroy.apply(this, arguments);
	},

	/**
	* @private
	*/
	addControl: function(ctl) {
		Control.prototype.addControl.apply(this, arguments);
		var addedIdx = this.getClientControls().indexOf(ctl),
			selectedIdx = this.selectedIndex;
		if (this.generated) {
			if ((selectedIdx < 0) || (addedIdx < selectedIdx)) {
				this.setSelectedIndex(selectedIdx + 1);
			} else if (selectedIdx == addedIdx) {
				// Force change handler, since the currently selected item actually changed
				this.selectedIndexChanged();
			}
			this.showHideNavButtons();
		}
	},

	/**
	* @private
	*/
	removeControl: function(ctl) {
		if (!this.destroying) {
			var removedIdx = this.getClientControls().indexOf(ctl),
				selectedIdx = this.selectedIndex,
				wasLast = (removedIdx == this.getClientControls().length-1);

			Control.prototype.removeControl.apply(this, arguments);

			// If removedIdx is -1, that means that the Control being removed is
			// not one of our picker items, so we don't need to update our state.
			// Probably, we're being torn down.
			if (removedIdx !== -1) {
				if ((removedIdx < selectedIdx) || ((selectedIdx == removedIdx) && wasLast)) {
					this.setSelectedIndex(selectedIdx - 1);
				} else if (selectedIdx == removedIdx) {
					// Force change handler, since the currently selected item actually changed
					this.selectedIndexChanged();
				}
				this.showHideNavButtons();
			}
		} else {
			this.inherited(arguments);
		}
	},

	/**
	* Hides passed-in [control]{@link module:enyo/Control~Control} and disables {@glossary Spotlight}
	* functionality.
	*
	* @private
	*/
	hideNavButton: function(ctl) {
		ctl.setDisabled(true);
	},

	/**
	* Shows passed-in [control]{@link module:enyo/Control~Control} and enables {@glossary Spotlight}
	* functionality.
	*
	* @private
	*/
	showNavButton: function(ctl) {
		ctl.setDisabled(false);
	},

	/**
	* @private
	*/
	disabledChanged: function() {
		this.$.client.addRemoveClass('disabled', this.disabled);
		if (this.generated) {
			this.showHideNavButtons();
		}
	},

	/**
	* @private
	*/
	animateChanged: function() {
		this.$.client.addRemoveClass('animated', this.animate);
	},

	/**
	* @private
	*/
	selectedChanged: function() {
		var idx = this.getClientControls().indexOf(this.selected);
		if (idx >= 0) {
			this.setSelectedIndex(idx);
		}
	},
	/*
	* When the picker is initialized, looks for any items with the `active` flag set to
	* `true`; if one is found, it is set as the currently selected item. This is done
	* without triggering an [onChange]{@link module:moonstone/SimplePicker~SimplePicker#onChange} event, as
	* it happens during initialization.
	*
	* @private
	*/
	initializeActiveItem: function() {
		var i,
			controls = this.getClientControls();
		for (i = 0; i < controls.length; i++) {
			if (controls[i].active) {
				this.selectedIndex = i;
				this.selected = controls[i];
				return;
			}
		}
	},

	/**
	* @private
	*/
	selectedIndexChanged: function() {
		dom.transform(this.$.client, {translateX: (this.selectedIndex * -100) + '%'});
		this.updateMarqueeDisable();
		this.setSelected(this.getClientControls()[this.selectedIndex]);
		this.fireChangedEvent();
		this.showHideNavButtons();
		this.startMarquee();
	},

	/**
	* @private
	*/
	updateMarqueeDisable: function() {
		this.stopMarquee();
		var i,
			c = this.getClientControls();
		for (i = 0; i < c.length; i++) {
			if (i == this.selectedIndex) {
				c[i].disabled = false;
			} else {
				c[i].disabled = true;
			}
		}
	},

	/**
	* @private
	*/
	left: function(sender, e) {
		if (e && e.sentHold) { return; }
		this.previous(sender, e);
	},

	/**
	* @private
	*/
	right: function(sender, e) {
		if (e && e.sentHold) { return; }
		this.next(sender, e);
	},

	/**
	* @private
	*/
	downLeft: function(sender, e) {
		this.left(sender, e);
	},

	/**
	* @private
	*/
	downRight: function(sender, e) {
		this.right(sender, e);
	},

	/**
	* Cycles the selected item to the one before the currently selected item. If chained from
	* an event, {@link Spotlight} hold pulse events will be canceled once the first item is
	* reached, unless [wrap]{@link module:moonstone/SimplePicker~SimplePicker#wrap} is `true`. When calling this method
	* directly, no arguments are required.
	*
	* @param {Object} sender - (unused) Sender, if chained from event.
	* @param {Object} e - Event object, if chained from event.
	* @public
	*/
	previous: function(sender, e) {
		if (!this.disabled) {
			var idx = this.selectedIndex - 1;
			if (idx < 0) {
				idx = this.wrap ? this.getClientControls().length - 1 : 0;
			}
			if (!this.wrap && idx === 0 && e && e.cancelHoldPulse) {
				e.cancelHoldPulse();
			}
			this.setSelectedIndex(idx);
		}
	},

	/**
	* Cycles the selected item to the one after the currently selected item. If chained from
	* an event, {@link Spotlight} hold pulse events will be canceled once the last item is
	* reached, unless [wrap]{@link module:moonstone/SimplePicker~SimplePicker#wrap} is `true`. When calling this method
	* directly, no arguments are required.
	*
	* @param {Object} sender - (unused) Sender, if chained from event.
	* @param {Object} e - Event object, if chained from event.
	* @public
	*/
	next: function(sender, e) {
		if (!this.disabled) {
			var idx = this.selectedIndex + 1;
			if (idx > this.getClientControls().length - 1) {
				idx = this.wrap ? 0 : this.getClientControls().length - 1;
			}
			if (!this.wrap && idx === this.getClientControls().length - 1
				&& e && e.cancelHoldPulse) {
				e.cancelHoldPulse();
			}
			this.setSelectedIndex(idx);
		}
	}
});
