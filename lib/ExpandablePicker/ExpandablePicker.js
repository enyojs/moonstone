require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandablePicker~ExpandablePicker} kind.
* @module moonstone/ExpandablePicker
*/

var
	kind = require('enyo/kind'),
	options = require('enyo/options'),
	Component = require('enyo/Component'),
	Control = require('enyo/Control'),
	Group = require('enyo/Group');

var
	Spotlight = require('spotlight');

var
	BodyText = require('../BodyText'),
	CheckboxItem = require('../CheckboxItem'),
	ExpandableListDrawer = require('../ExpandableListDrawer'),
	ExpandableListItem = require('../ExpandableListItem'),
	Item = require('../Item'),
	Marquee = require('../Marquee'),
	MarqueeText = Marquee.Text,
	ExpandablePickerAccessibilitySupport = require('./ExpandablePickerAccessibilitySupport');

/**
* Fires when the currently selected item changes.
*
* @event module:moonstone/ExpandablePicker~ExpandablePicker#onChange
* @type {Object}
* @property {Object|Object[]} selected - A reference to the currently selected item,
*	or (if [multipleSelection]{@link module:moonstone/ExpandablePicker~ExpandablePicker#multipleSelection} is `true`),
*	an array of selected items.
* @property {String} content - The content of the currently selected item, or (if
*	[multipleSelection]{@link module:moonstone/ExpandablePicker~ExpandablePicker#multipleSelection} is `true`), a comma
*	(plus space) separated list of the selected items' content.
* @property {Number} index - The index of the currently selected item, or (if
*	[multipleSelection]{@link module:moonstone/ExpandablePicker~ExpandablePicker#multipleSelection} is `true`), an array
* of the index values of the selected items.
* @public
*/

/**
* {@link module:moonstone/ExpandablePicker~ExpandablePicker}, which extends {@link module:moonstone/ExpandableListItem~ExpandableListItem}, is
* a drop-down picker menu that solicits a choice from the user. The picker's child
* components, which are instances of {@link module:moonstone/CheckboxItem~CheckboxItem} by default, provide
* the options for the picker.
*
* ```
* {kind: 'moon.ExpandablePicker', noneText: 'None Selected', content: 'Choose City',
* components: [
*	{content: 'San Francisco'},
*	{content: 'Boston'},
*	{content: 'Tokyo'}
* ]}
* ```
*
* The currently selected item is available in the picker's
* [selected]{@link module:moonstone/ExpandablePicker~ExpandablePicker#selected} property and may be accessed in
* the normal manner, by calling `get('selected')` and `set('selected', <value>)`.
* Similarly, the index of the current selection is available in
* [selectedIndex]{@link module:moonstone/ExpandablePicker~ExpandablePicker#selectedIndex}. When the
* [multipleSelection]{@link module:moonstone/ExpandablePicker~ExpandablePicker#multipleSelection} property is set
* to `true`, `selected` contains an array of selected items, and `selectedIndex`
* contains an array of the selected items' index values.
*
* The [onChange]{@link module:moonstone/ExpandablePicker~ExpandablePicker#onChange} event is fired when the
* selected item changes.
*
* The picker's options may be modified programmatically in the standard manner, by
* calling `createComponent().render()` or `destroy()`.
*
* ```
* // Add new items to picker
* this.$.expandablePicker.createComponent({'New York'}).render();
* this.$.expandablePicker.createComponent({'London'}).render();
*
* // Remove currently selected item from picker
* this.$.expandablePicker.getSelected().destroy();
* ```
*
* When the picker is minimized, the content of the currently selected item is
* displayed as subtext below the picker label. If multiple selection is enabled,
* the content of all selected items will be displayed as a comma-separated list.
*
* @class ExpandablePicker
* @extends module:moonstone/ExpandableListItem~ExpandableListItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandablePicker~ExpandablePicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandablePicker',

	/**
	* @private
	*/
	kind: ExpandableListItem,

	/**
	* @private
	*/
	mixins: options.accessibility ? [ExpandablePickerAccessibilitySupport] : null,

	/**
	* @private
	*/
	classes: 'moon-expandable-picker',

	/**
	* @private
	*/
	events: {
		/**
		* {@link module:moonstone/ExpandablePicker~ExpandablePicker#onChange}
		*/
		onChange: ''
	},

	/**
	* @private
	* @lends module:moonstone/ExpandablePicker~ExpandablePicker.prototype
	*/
	published: {

		/**
		* Reference to currently selected item, if any, or (when
		* [multipleSelection]{@link module:moonstone/ExpandablePicker~ExpandablePicker#multipleSelection} is `true`),
		* an array of selected items.
		*
		* @type {Object | Object[]}
		* @default null
		* @public
		*/
		selected: null,

		/**
		* Index of the currently selected item, or `-1` if nothing is selected. If
		* [multipleSelection]{@link module:moonstone/ExpandablePicker~ExpandablePicker#multipleSelection} is `true`,
		* this will be array of the selected items' index values, or an empty array if
		* nothing is selected.
		*
		* @type {Number | Number[]}
		* @default -1
		* @public
		*/
		selectedIndex: -1,

		/**
		* Text to be displayed as the current value if no item is currently selected.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		noneText: '',

		/**
		* Text to be displayed when the drawer is opened.
		*
		* @type {String}
		* @default null
		* @public
		*/
		helpText: null,

		/**
		* If `true`, picker auto-collapses when an item is selected.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		autoCollapseOnSelect: true,

		/**
		* If `true`, multiple selection is allowed.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		multipleSelection: false
	},

	/**
	* @private
	*/
	autoCollapse: true,

	/**
	* @private
	*/
	lockBottom: true,

	/**
	* @private
	*/
	defaultKind: CheckboxItem,

	/**
	* @private
	*/
	selectAndCloseDelayMS: 600,

	/**
	* @private
	*/
	components: [
		{name: 'headerWrapper', kind: Item, classes: 'moon-expandable-picker-header-wrapper', onSpotlightFocus: 'headerFocus', ontap: 'expandContract', components: [
			// headerContainer required to avoid bad scrollWidth returned in RTL for certain text widths (webkit bug)
			{name: 'headerContainer', kind: Control, classes: 'moon-expandable-list-item-header moon-expandable-picker-header', components: [
				{name: 'header', kind: MarqueeText, accessibilityDisabled: true}
			]},
			{name: 'currentValue', kind: MarqueeText, accessibilityDisabled: true, classes: 'moon-expandable-list-item-current-value'}
		]},
		{name: 'drawer', kind: ExpandableListDrawer, resizeContainer:false, classes:'moon-expandable-list-item-client', onDrawerAnimationEnd: 'handleDrawerAnimationEnd', components: [
			{name: 'client', tag: null, kind: Group, onActivate: 'activated', highlander: true},
			{name: 'helpText', kind: BodyText, canGenerate: false, classes: 'moon-expandable-picker-help-text'}
		]}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'allowHtml', to: '$.header.allowHtml'},
		{from: 'allowHtml', to: '$.currentValue.allowHtml'},
		{from: 'disabled', to: '$.headerWrapper.disabled'}
	],

	/**
	* @private
	*/
	create: function() {
		if (this.multipleSelection) {
			this.selected = (this.selected) ? this.selected : [];
			this.selectedIndex = (this.selectedIndex != -1) ? this.selectedIndex : [];
		}
		// super initialization
		ExpandableListItem.prototype.create.apply(this, arguments);

		this.selectedIndexChanged();
		this.noneTextChanged();
		this.helpTextChanged();
		this.openChanged();
	},

	/**
	* @private
	*/
	initComponents: function() {
		var override = {client: {highlander: !this.multipleSelection}};
		this.kindComponents = Component.overrideComponents(this.kindComponents, override);
		ExpandableListItem.prototype.initComponents.apply(this, arguments);
	},

	/**
	* @private
	*/
	rendered: function () {
		ExpandableListItem.prototype.rendered.apply(this, arguments);
		if (!this.$.drawer.renderOnShow || this.getOpen()) this.isDrawerRendered = true;
	},

	/**
	*  'multiSelectCurrentValue()' can be overridden by subkinds, such as moon.DayPicker
	*
	* @protected
	*/
	multiSelectCurrentValue: function () {
		if (!this.multipleSelection) {
			return;
		}
		var controls = this.getCheckboxControls();
		var str = '';
		this.selectedIndex.sort();
		for (var i=0; i < this.selectedIndex.length; i++) {
			if (!str) {
				str = controls[this.selectedIndex[i]].getContent();
			} else {
				str = str + ', ' + controls[this.selectedIndex[i]].getContent();
			}
		}
		if (!str) {
			str = this.getNoneText();
		}
		return str;
	},

	/**
	* When the [selected]{@link module:moonstone/ExpandablePicker~ExpandablePicker#selected} control changes,
	* updates [checked]{@link module:moonstone/CheckboxItem~CheckboxItem#checked} values appropriately and
	* fires an [onChange]{@link module:moonstone/ExpandablePicker~ExpandablePicker#onChange} event.
	*
	* @fires module:moonstone/ExpandablePicker~ExpandablePicker#onChange
	* @private
	*/
	selectedChanged: function (inOldValue) {
		var selected = this.getSelected(),
		controls = this.getCheckboxControls(),
		index = -1,
		i; //declaring i here to fix travis error

		if (this.multipleSelection) {
			this.rebuildSelectedIndices(selected, controls);
			if(this.hasNode()) {
				this.fireChangeEvent();
			}
		} else {
			for (i=0;i<controls.length;i++) {
				if(controls[i] === selected) {
					controls[i].setChecked(true);
					index = i;
				} else if (controls[i].checked) {
					controls[i].silence();
					controls[i].setChecked(false);
					controls[i].unsilence();
				}
			}
			if (index > -1 && selected !== inOldValue) {
				this.setSelectedIndex(index);
				this.$.currentValue.setContent(selected.getContent());
				if(this.hasNode()) {
					this.fireChangeEvent();
				}
			}
		}
	},

	/**
	* When the {@link module:moonstone/ExpandablePicker~ExpandablePicker#selectedIndex} changes, calls
	* `setChecked()` on the appropriate control.
	*
	* @private
	*/
	selectedIndexChanged: function () {
		var selected = this.getSelected(),
		controls = this.getCheckboxControls(),
		index = this.getSelectedIndex();

		if (this.multipleSelection) {
			for (var i = 0; i < controls.length; i++) {
				var selIndex = selected.indexOf(controls[i]);
				if (index.indexOf(i) >= 0) {
					controls[i].setChecked(true);
					if (selIndex == -1) {
						selected.push(controls[i]);
					}
				} else {
					controls[i].setChecked(false);
					if (selIndex >= 0) {
						selected.splice(selIndex, 1);
					}
				}
			}
			this.$.currentValue.setContent(this.multiSelectCurrentValue());
			if(this.hasNode()) {
				this.fireChangeEvent();
			}
		} else {
			if (controls[index] && controls[index] !== selected) {
				this.setSelected(controls[index]);
			}
		}
	},

	/**
	* If there is no selected item, uses [noneText]{link @moon.ExpandablePicker#noneText}
	* as current value.
	*
	* @private
	*/
	noneTextChanged: function () {
		if (this.multipleSelection) {
			if (!this.getSelected().length && !this.getSelectedIndex().length) {
				this.$.currentValue.setContent(this.getNoneText());
			}
		} else {
			if (!this.getSelected() && this.getSelectedIndex() == -1) {
				this.$.currentValue.setContent(this.getNoneText());
			}
		}
	},

	/**
	* When [open]{@link module:moonstone/ExpandablePicker~ExpandablePicker#open} changes, shows/hides `this.$.currentValue`.
	*
	* @private
	*/
	openChanged: function () {
		this.inherited(arguments);
		this.$.currentValue.setShowing(!this.open);
		this.setActive(this.getOpen());
	},

	/**
	* When drawer is opened/closed, shows/hides `this.$.helpText`.
	*
	* @private
	*/
	helpTextChanged: function () {
		if (this.helpText !== null && !this.$.helpText.canGenerate) {
			this.generateHelpText();
		}
		this.$.helpText.setContent(this.helpText);
		this.$.helpText.setShowing(!!this.helpText);
	},

	/**
	* @method
	* @private
	*/
	destroy: function () {
		// When the expandablePicker itself is going away, take note so we don't try and do
		// single-picker option remove logic such as setting some properties to default
		// value when each picker option is destroyed
		this.destroying = true;
		ExpandableListItem.prototype.destroy.apply(this, arguments);
	},

	/**
	* @method
	* @private
	*/
	rebuildSelectedIndices: function(selected, controls) {
		this.selectedIndex = [];
		selected = selected || this.getSelected();
		controls = controls || this.getCheckboxControls();

		for (var i = 0; i < controls.length; i++) {
			if (selected.indexOf(controls[i]) >= 0) {
				controls[i].setChecked(true);
				this.selectedIndex.push(i);
			} else {
				controls[i].silence();
				controls[i].setChecked(false);
				controls[i].unsilence();
			}
		}
		this.$.currentValue.setContent(this.multiSelectCurrentValue());
	},

	/**
	* @method
	* @private
	*/
	removeControl: function (inControl) {
		// Skip extra work during panel destruction.
		if (!this.destroying) {
			// set currentValue, selected and selectedIndex to defaults value
			if (this.multipleSelection) {
				for (var i = 0; i < this.selected.length; i++) {
					if (this.selected[i] === inControl) {
						this.selected.splice(i, 1);
						break;
					}
				}
				// in case of multipleSection, removing control could change
				// selected array.
				this.rebuildSelectedIndices();
			} else {
				if (this.selected === inControl) {
					this.setSelected(null);
					this.setSelectedIndex(-1);
					this.$.currentValue.setContent(this.getNoneText());
				}
			}
		}
		ExpandableListItem.prototype.removeControl.apply(this, arguments);
	},

	/**
	* @private
	*/
	generateHelpText: function () {
		this.$.helpText.canGenerate = true;
		this.$.helpText.render();
	},

	/**
	* When an item is chosen, marks it as checked and closes the picker.
	*
	* @private
	*/
	activated: function (inSender, inEvent) {
		var toggledControl = inEvent && inEvent.toggledControl, index;

		if (!toggledControl) {
			return;
		}

		index = this.getCheckboxControls().indexOf(toggledControl);

		if (this.multipleSelection) {
			if (index >= 0) {
				// if toggledControl is checked but it is out of this.selected, them push it
				if (inEvent.checked && (this.selected.indexOf(toggledControl) == -1)) {
					this.selected.push(toggledControl);
					this.selectedChanged();
				}
				// if toggledControl is not checked but it is in this.selected, them pull it out
				if (!inEvent.checked && (this.selected.indexOf(toggledControl) >= 0)) {
					this.selected.splice(this.selected.indexOf(toggledControl), 1);
					this.selectedChanged();
				}
			}
		} else {
			if (inEvent.checked && index >= 0) {
				this.setSelected(toggledControl);
			}
		}

		if (this.getAutoCollapseOnSelect() && this.isDrawerRendered && this.getOpen()) {
			this.startJob('selectAndClose', 'selectAndClose', this.selectAndCloseDelayMS);
		}

		return true;
	},

	/**
	* Returns the picker items. Override point for child kinds altering the source of the items.
	*
	* @private
	*/
	getCheckboxControls: function () {
		return this.getClientControls();
	},

	/**
	* Closes drawer and selects header.
	*
	* @private
	*/
	selectAndClose: function () {
		if (!Spotlight.getPointerMode() && Spotlight.getCurrent() && Spotlight.getCurrent().isDescendantOf(this)) {
			Spotlight.spot(this.$.headerWrapper);
		}
		this.setActive(false);
	},

	/**
	* Fires an `onChange` event.
	*
	* @fires module:moonstone/ExpandablePicker~ExpandablePicker#onChange
	* @private
	*/
	fireChangeEvent: function () {
		var contentStr = (this.multipleSelection) ? this.multiSelectCurrentValue() : this.getSelected().getContent();
		this.doChange({
			selected: this.getSelected(),
			content: contentStr,
			index: this.getSelectedIndex()
		});
	},

	/**
	* @private
	*/
	multipleSelectionChanged : function (inOldValue) {
		if (this.multipleSelection) {
			if (this.selected) {
				this.selected = [this.selected];
			} else {
				this.selected = [];
			}
			this.selectedIndex = [];
		} else {
			this.selected = (this.selected.length) ? this.selected[0] : null;
			this.selectedIndex = -1;
		}
		this.$.client.setHighlander(!this.multipleSelection);
		this.selectedChanged();
	},

	/**
	* @private
	*/
	handleDrawerAnimationEnd: function () {
		if (!this.isDrawerRendered) this.isDrawerRendered = true;
	}
});
