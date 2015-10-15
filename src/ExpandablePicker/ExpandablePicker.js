require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandablePicker~ExpandablePicker} kind.
* @module moonstone/ExpandablePicker
*/

var
	kind = require('enyo/kind'),
	Component = require('enyo/Component'),
	Group = require('enyo/Group');

var
	BodyText = require('../BodyText'),
	CheckboxItem = require('../CheckboxItem'),
	ExpandableListItem = require('../ExpandableListItem');

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
* ```javascript
* var
* 	kind = require('enyo/kind'),
* 	ExpandablePicker = require('moonstone/ExpandablePicker');
*
* {kind: ExpandablePicker, noneText: 'None Selected', content: 'Choose City', components: [
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
* ```javascript
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
	drawerComponents: [
		{name: 'client', tag: null, kind: Group, onActivate: 'activated', highlander: true},
		{name: 'helpText', kind: BodyText, canGenerate: false, classes: 'moon-expandable-picker-help-text'}
	],

	bindings: [
		{from: 'selected.content', to: 'selectedText'},

		// Accessibility
		{from: 'selected.accessibilityLabel', to: '$.header._accessibilityText'}
	],

	computed: {
		'currentValueText': ['selected', 'noneText', 'selectedText']
	},

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
		this.helpTextChanged();
	},

	/**
	* @private
	*/
	initComponents: function() {
		var override = {client: {highlander: !this.multipleSelection}};
		this.drawerComponents = Component.overrideComponents(this.drawerComponents, override);
		ExpandableListItem.prototype.initComponents.apply(this, arguments);
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
		var controls = this.getCheckboxControls(),
			index = this.getSelectedIndex(),
			checked;

		if (this.multipleSelection) {
			for (var i = 0; i < controls.length; i++) {
				checked = index.indexOf(i) >= 0;
				controls[i].setChecked(checked);
			}
		} else {
			this.set('selected', index >= 0 ? controls[index] : null);
		}
	},

	/**
	* If there is no selected item, uses [noneText]{link @moon.ExpandablePicker#noneText}
	* as current value.
	*
	* @private
	*/
	currentValueText: function () {
		var multi = this.multipleSelection,
			sel = this.get('selected'),
			selIdx = this.get('selectedIndex');

		if (multi && sel.length && selIdx.length) {
			return this.multiSelectCurrentValue();
		}
		else if (!multi && sel && selIdx !== -1) {
			return sel.get('content');
		}
		return this.noneText;
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
	},

	/**
	* @method
	* @private
	*/
	removeControl: function (inControl) {
		var selectedChanged = false;
		// Skip extra work during panel destruction.
		if (!this.destroying) {
			// set currentValue, selected and selectedIndex to defaults value
			if (this.multipleSelection) {
				for (var i = 0; i < this.selected.length; i++) {
					if (this.selected[i] === inControl) {
						this.selected.splice(i, 1);
						selectedChanged = true;
						break;
					}
				}
				if (selectedChanged) {
					this.notifyObservers('selected');
				}
			} else {
				if (this.selected === inControl) {
					this.setSelected(null);
					this.setSelectedIndex(-1);
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
					this.notifyObservers('selected');
				}
				// if toggledControl is not checked but it is in this.selected, them pull it out
				if (!inEvent.checked && (this.selected.indexOf(toggledControl) >= 0)) {
					this.selected.splice(this.selected.indexOf(toggledControl), 1);
					this.notifyObservers('selected');
				}
			}
		} else {
			if (inEvent.checked && index >= 0) {
				this.setSelected(toggledControl);
			}
		}

		if (this.getAutoCollapseOnSelect() && this.$.drawer.hasRendered && this.getOpen()) {
			this.startJob('selectAndClose', 'expandContract', this.selectAndCloseDelayMS);
		}

		return true;
	},

	/**
	* @private
	*/
	openChanged: function () {
		ExpandableListItem.prototype.openChanged.apply(this, arguments);
		// cancel the job so the drawer isn't opened/closed inadvertently
		this.stopJob('selectAndClose');
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
	multipleSelectionChanged: function (inOldValue) {
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
		this.notifyObservers('selected');
	},

	// Accessibility

	/**
	* @private
	*/
	ariaObservers: [
		{path: 'multipleSelection', method: function () {
			this.$.header.setAriaAttribute('aria-multiselectable', this.multipleSelection);
		}}
	]
});
