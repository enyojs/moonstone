require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ExpandableInput~ExpandableInput} kind.
* @module moonstone/ExpandableInput
*/

var
	kind = require('enyo/kind');

var
	Spotlight = require('spotlight');

var
	$L = require('../i18n'),
	ExpandableListItem = require('../ExpandableListItem'),
	Input = require('../Input'),
	InputDecorator = require('../InputDecorator');

/**
* Fires when the current text changes. This passes through {@link module:enyo/Input~Input#onChange}.
*
* @event moon.ExpandableInput#onChange
* @type {Object}
* @property {String} value - The value of the input.
* @public
*/

/**
* {@link module:moonstone/ExpandableInput~ExpandableInput}, which extends {@link module:moonstone/ExpandableListItem~ExpandableListItem}, is a
* drop-down input that prompts the user to enter text.
*
* @class ExpandableInput
* @extends module:moonstone/ExpandableListItem~ExpandableListItem
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ExpandableInput~ExpandableInput.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ExpandableInput',

	/**
	* @private
	*/
	kind: ExpandableListItem,

	/**
	* @private
	*/
	classes: 'moon-expandable-input',

	/**
	* @private
	*/
	events: {

		/** {@link module:moonstone/ExpandableInput~ExpandableInput#onChange} */
		onChange: ''
	},

	/**
	* @private
	* @lends module:moonstone/ExpandableInput~ExpandableInput.prototype
	*/
	published: {

		/**
		* Text to be displayed as the current value if no item is currently selected.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		noneText: '',

		/**
		* Text to be displayed in the input if no text has been entered.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		placeholder: '',

		/**
		* Type of [input]{@link module:enyo/Input~Input}; if not specified, it's treated as `'text'`.
		* This may be anything specified for the `type` attribute in the HTML
		* specification, including `'url'`, `'email'`, `'search'`, or `'number'`.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		type: '',

		/**
		* Initial value of the input.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		value: ''
	},

	/**
	* @private
	*/
	autoCollapse: true,

	/**
	* @private
	*/
	lockBottom: false,

	/**
	* @private
	*/
	drawerComponents: [
		{name: 'inputDecorator', kind: InputDecorator, onSpotlightBlur: 'inputSpotBlurred', onSpotlightFocus: 'inputFocus', onSpotlightDown: 'inputSpotDown', onkeyup: 'inputKeyUp', defaultSpotlightUp: 'drawer', components: [
			{name: 'clientInput', kind: Input, onchange: 'doChange', dismissOnEnter: true}
		]}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'value', to: '$.clientInput.value', oneWay: false},
		{from: 'placeholder', to: '$.clientInput.placeholder'},
		{from: 'type', to: '$.clientInput.type'}
	],

	/**
	* @private
	*/
	computed: {
		'currentValueShowing': ['open', 'currentValueText', 'type'],
		'currentValueText': ['value', 'noneText']
	},

	/**
	* @private
	*/
	create: function () {
		ExpandableListItem.prototype.create.apply(this, arguments);
		// attach an ondown handler to unfreeze Spotlight
		this.$.header.ondown = 'headerDown';
	},

	/**
	* Computed property
	*
	* @private
	*/
	currentValueShowing: function () {
		return !this.open && this.currentValueText() !== '' && this.type != 'password';
	},

	/**
	* Assigns an attribute to a {@link module:moonstone/Input~Input}
	* @param {String} name - Attribute name to assign/remove.
	* @param {(String|Number|null)} value - The value to assign to `name`
	* @public
	*/
	setInputAttribute: function (name, value) {
		this.$.clientInput.setAttribute(name, value);
	},

	/**
	* Computed property
	*
	* @private
	*/
	currentValueText: function () {
		return (this.value === '') ? this.noneText : this.value;
	},

	/**
	* @private
	*/
	openChanged: function () {
		ExpandableListItem.prototype.openChanged.apply(this, arguments);
		if (this.open) {
			Spotlight.unspot();
			this.focusInput();
		} else {
			this.$.clientInput.blur();
		}
	},

	/**
	* Focuses the {@link module:moonstone/Input~Input} when the input decorator receives focus.
	*
	* @private
	*/
	inputFocus: function (inSender, inEvent) {
		var direction = inEvent && inEvent.dir;
		if (this.open && direction) {
			this.focusInput();
		}
	},

	/**
	* Value should be submitted if user clicks outside control. We check for
	* `onSpotlightFocus` and `mouseover` to avoid contracting the input on an event
	* fired from itself.
	*
	* @private
	*/
	inputSpotBlurred: function (inSender, inEvent) {
		var eventType = Spotlight.getLastEvent().type;
		if (Spotlight.getPointerMode() && eventType !== 'onSpotlightFocus' && eventType !== 'mouseover') {
			this.expandContract();
		}
	},

	/**
	* @private
	*/
	inputKeyUp: function (sender, event) {
		if (event.keyCode == 13) {
			this.closeDrawerAndHighlightHeader();
			return true;
		}
	},

	/**
	* @private
	*/
	headerDown: function () {
		Spotlight.unfreeze();
	},

	/**
	* Focuses the input field.
	*
	* @private
	*/
	focusInput: function () {
		this.$.clientInput.focus();
	},

	/**
	* If [lockBottom]{@link module:moonstone/ExpandableInput~ExpandableInput#lockBottom} is `true`, don't allow user
	* to navigate down from the input field; if `false`, close the drawer and return
	* `true` to keep {@glossary Spotlight} on header.
	*
	* @private
	*/
	inputSpotDown: function (inSender, inEvent) {
		if (this.lockBottom) {
			this.focusInput();
		} else {
			this.expandContract();
		}
		return true;
	},

	// Accessibility

	/**
	* @default $L('edit box')
	* @type {String}
	* @see enyo/AccessibilitySupport~AccessibilitySupport#accessibilityHint
	* @public
	*/
	accessibilityHint: $L('edit box')
});
