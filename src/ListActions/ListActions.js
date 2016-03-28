require('moonstone');

/**
* Contains the declarations for the {@link module:moonstone/ListActions~ListActions}
* and {@link module:moonstone/ListActions~ListActionsPopup} kinds, and the
* {@link module:moonstone/ListActions~ListActionActivationSupport} mixin.
* @module moonstone/ListActions
*/

var
	dom = require('enyo/dom'),
	ri = require('enyo/resolution');

var
	ContextualPopup = require('moonstone/ContextualPopup'),
	ContextualPopupDecorator = require('moonstone/ContextualPopupDecorator'),
	IconButton = require('moonstone/IconButton');

/**
* An internally-used support mixin added to a {@link module:moonstone/ListActions~ListActions}
* menu, which decorates `activate` events with the menu's `action` property.
*
* @mixin ListActionActivationSupport
* @private
*/
var ListActionActivationSupport = {

	/**
	* @private
	*/
	name: 'ListActionActivationSupport',

	/**
	* @private
	*/
	handlers: {
		onActivate: 'activate'
	},

	/**
	* @private
	*/
	activate: function (sender, e) {
		e.action = this.action;
	}
};

/**
* {@link module:moonstone/ListActions~ListActionsPopup} is a
* [control]{@link module:moonstone/ContextualPopup~ContextualPopup} used by
* {@link module:moonstone/ListActions~ListActions} to house a menu of selectable options.
*
* @class ListActionsPopup
* @extends module:moonstone/ContextualPopup~ContextualPopup
* @ui
* @private
*/
var ListActionsPopup = ContextualPopup.kind(
	/** @lends module:moonstone/ListActions~ListActionsPopup */ {

	/**
	* @private
	*/
	classes: 'moon-list-actions-popup below',

	/**
	* @see moonstone/ContextualPopup~ContextualPopup#spotlightModal
	*/
	spotlightModal: true,

	/**
	* @see moonstone/ContextualPopup~ContextualPopup#showCloseButton
	*/
	showCloseButton: true,

	/**
	* @private
	*/
	resetDirection: function () {
		this.removeClass(this.arrowClasses);
		this.removeClass('right');
		this.removeClass('left');
	},

	/**
	* Adjust popup direction, anchor to the edge of screen if it goes over, and adjust arrow
	* positions.
	*
	* @private
	* @override
	*/
	alterDirection: function () {
		if (this.showing) {
			var clientRect = this.getBoundingRect(this.node),
				viewPortWidth = dom.getWindowWidth(),
				offsetWidth = (clientRect.width - this.activatorOffset.width) / 2,
				popupMargin = ri.scale(24),
				iconButtonWidth = this.activatorOffset.width + popupMargin,
				bounds = {top: null, left: null},
				c;

			this.resetDirection();

			if(this.activatorOffset.left < offsetWidth) {
				// flip towards right-side
				this.addClass('right');

				// adjust arrow position
				c = Math.round((this.activatorOffset.left - popupMargin) / iconButtonWidth);
				this.arrowClasses = 'list-actions-' + (c + 1) + 'h';
				this.addClass(this.arrowClasses);

				// anchor to the far left
				bounds.left = popupMargin;
			} else if(viewPortWidth - this.activatorOffset.right < offsetWidth) {
				// flip towards left-side
				this.addClass('left');

				// adjust arrow position
				c = Math.round((viewPortWidth - this.activatorOffset.right - popupMargin) / iconButtonWidth);
				this.arrowClasses = 'list-actions-' + (c + 1) + 'h';
				this.addClass(this.arrowClasses);

				// anchor to the far right
				bounds.left = viewPortWidth - clientRect.width - popupMargin;
			} else {
				bounds.left = this.activatorOffset.left - offsetWidth;
			}

			bounds.top = this.activatorOffset.bottom;

			this.setBounds(bounds);
		}
	}
});

/**
* {@link module:moonstone/ListActions~ListActions} is a [control]{@link module:enyo/Control~Control}
* designed to live within a {@link module:moonstone/Header~Header}. It is used to perform actions on
* an associated list of items. A ListActions [object]{@glossary Object} combines an activating
* control with a drawer containing a user-defined menu of selectable options for acting on items in
* the list. When a menu item is selected, an action--such as filtering, sorting, moving, or
* deleting--may be invoked in the application by handling change events from the selected
* items.
*
* @class ListActions
* @extends module:moonstone/ContextualPopupDecorator~ContextualPopupDecorator
* @ui
* @public
*/
var ListActions = ContextualPopupDecorator.kind({

	/**
	* @private
	*/
	classes: 'moon-list-actions',

	/**
	* If `true`, the popup will automatically close when the user selects a menu item.
	*
	* Note: There is a known issue where {@link module:enyo/DataList~DataList} is used in
	* `listActions` block and want to set `autoCollapse` to `true`, it will close the popup as it
	* resizes. In case you need to use the data-bound list in `listActions` block, please use
	* {@link module:enyo/DataRepeater~DataRepeater} instead.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	autoCollapse: false,

	/**
	* A block of one or more controls to be displayed inside the list actions menu. It should
	* typically contain a {@link module:moonstone/Divider~Divider} identifying the category and a
	* {@link module:moonstone/Scroller~Scroller}, containing instances of
	* {@link module:moonstone/CheckboxItem~CheckboxItem}, 
	* {@link module:moonstone/ToggleItem~ToggleItem}, or
	* {@link module:moonstone/SelectableItem~SelectableItem} for setting options for the underlying
	* [panel]{@link module:moonstone/Panel~Panel}. Alternatively, a
	* {@link module:enyo/DataRepeater~DataRepeater} or a {@link module:moonstone/DataList~DataList}
	* may be used for populating a data-bound list of options.
	* {@link module:enyo/DataRepeater~DataRepeater} is preferrable as performance gain from
	* pagination starts when you have more than two pages worth of items, 11 or more in ListActions
	* case, in the list.
	*
	* More than one option group may be added to the `listActions` block, in which options
	* are laid out horizontally.
	*
	* Each group should have a string value set for the `action` property, as this will
	* be passed in all events that bubble from the `ListActions`, to allow the user to
	* identify which category changed.
	*
	* @type {Object[]}
	* @default null
	* @public
	*/
	listActions: null,

	/**
	* Icon name to be used by the activator button (as in {@link module:moonstone/Icon~Icon} and
	* {@link module:moonstone/IconButton~IconButton}).
	*
	* @type {String}
	* @default ''
	* @public
	*/
	icon: '',

	/**
	* Source URL for icon image.
	*
	* @type {String|module:enyo/resolution#selectSrc~src}
	* @default ''
	* @public
	*/
	iconSrc: '',

	/**
	* The background-color opacity of the {@link module:moonstone/ListActions~ListActions}' activator
	* (which is a {@link module:moonstone/IconButton~IconButton}). Please see the valid values defined by
	* {@link module:moonstone/Button~Button#backgroundOpacity}.
	*
	* @type {String}
	* @default 'opaque'
	* @public
	*/
	backgroundOpacity: 'opaque',

	/**
	* @private
	*/
	components: [
		{name: 'activator', kind: IconButton},
		{name: 'listActionsPopup', kind: ListActionsPopup, accessibilityReadAll: false, components: [
			{name: 'listActionsWrapper', classes: 'moon-hspacing top moon-list-actions-scroller', controlClasses: 'moon-list-actions-popup-width', onActivate: 'optionSelected'}
		]}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'iconSrc', to: '$.activator.src'},
		{from: 'icon', to: '$.activator.icon'},
		{from: 'disabled', to: '$.activator.disabled', oneWay: false},
		{from: 'backgroundOpacity', to: '$.activator.backgroundOpacity'}
	],

	/**
	* @private
	*/
	create: function() {
		ContextualPopupDecorator.prototype.create.apply(this, arguments);
		this.disabledChanged();
		this.listActionsChanged();
	},

	/**
	* @private
	*/
	disabledChanged: function () {
		this.addRemoveClass('disabled', this.disabled);
	},

	/**
	* @private
	*/
	listActionsChanged: function() {
		var i,
			listAction;

		for (i = 0; (listAction = this.listActions[i]); i++) {
			listAction.mixins = this.addListActionMixin(listAction);
			this.$.listActionsWrapper.createComponent(
				listAction, {
					owner: this.hasOwnProperty('listActions') ? this.getInstanceOwner() : this
				});
		}

		if (this.hasNode()) {
			this.$.listActionsWrapper.render();
		}
	},

	/**
	* Adds a mixin to each list action menu that decorates `activate` events with the menu's
	* `action` property.
	*
	* @private
	*/
	addListActionMixin: function (listAction) {
		var mixins = listAction.mixins || [];
		if (mixins.indexOf(ListActionActivationSupport) === -1) {
			mixins.push(ListActionActivationSupport);
		}
		return mixins;
	},

	/**
	* @private
	*/
	optionSelected: function() {
		if (this.autoCollapse && this.$.listActionsPopup.getAbsoluteShowing()) {
			this.startJob('hidePopupJob', function() {
				this.$.listActionsPopup.hide();
			}, 300);
		}
	},

	/**
	* @override
	* @private
	*/
	popupShown: function() {
		ContextualPopupDecorator.prototype.popupShown.apply(this,arguments);
		this.bubble('onRequestMuteTooltip');
	},

	/**
	* @override
	* @private
	*/
	popupHidden: function() {
		ContextualPopupDecorator.prototype.popupHidden.apply(this,arguments);
		this.bubble('onRequestUnmuteTooltip');
	}
});

module.exports = ListActions;