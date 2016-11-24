/**
* Contains the declaration for the {@link module:moonstone/DaySelector~DaySelector} kind.
* @module moonstone/DaySelector
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	Signals = require('enyo/Signals');

var
	ilib = require('enyo-ilib'),
	DateFmt = require('enyo-ilib/DateFmt'),
	LocaleInfo = require('enyo-ilib/LocaleInfo');

var
	FormCheckbox = require('moonstone/FormCheckbox'),
	$L = require('../i18n');

/**
* Fires when the current selection changes.
*
* @event moonstone/DaySelector~DaySelector#onChange
* @type {Object}
* @property {Object | Object[]} selected - The array of the currently selected items.
* @property {String} content -  The content of the currently selected items' representative values .
* @property {Number | Number[]} index - Index of the currently selected items.
*
* @public
*/

/**
* {@link module:moonstone/DaySelector~DaySelector},  is a day selector menu
*  that solicits day of the week from the user.
*
* Fires an [onChange]{@link module:enyo/DaySelector~DaySelector#onChange} event.
*
* ```
* var DaySelector = require('moonstone/DaySelector');
* ...
* {kind: DaySelector}
* ```
*
* When the user selects every weekday, subtext will be changed 'Every Weekday' automatically.
*
* The content of representative value can be changed.
* ```
* {kind: DaySelector, everyWeekdayText:'Weekdays', everyWeekendText:'Weekends', everyDayText:'Daily'}
* ```
*
* @class DaySelector
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/DaySelector~DaySelector.prototype */ {

	/**
	* @private
	*/
	name: 'moon.DaySelector',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	* @lends module:moonstone/DaySelector~DaySelector.prototype
	*/
	published: {

		/**
		* Text to be displayed when all of the day are selected.
		*
		* @type {String}
		* @default 'Every Day'
		* @public
		*/
		everyDayText: $L('Every Day'),

		/**
		* Text to be displayed when all of the weekday are selected.
		*
		* @type {String}
		* @default 'Every Weekday'
		* @public
		*/
		everyWeekdayText: $L('Every Weekday'),

		/**
		* Text to be displayed when all of the weekend are selected.
		*
		* @type {String}
		* @default 'Every Weekend'
		* @public
		*/
		everyWeekendText: $L('Every Weekend'),

		/**
		* Text to be displayed as the current value if no item is currently selected.
		*
		* @type {String}
		* @default 'Nothing selected'
		* @public
		*/
		noneText: $L('Nothing selected'),

		/**
		* Day text type to be displayed in the component.
		* If `true` short text will be displayed for the the days (Sun,Mon..)
		* if `false`, long text will be displayed (Sunday,Monday..)
		*
		* @type {Boolean}
		* @default true
		* @public
		*/

		shortDayText: true,

		/**
		* Reference to currently selected item, or an array of selected items.
		*
		* @type {Object | Object[]}
		* @default null
		* @public
		*/

		selected: null,

		/**
		* Index of the currently selected item, or `-1` if nothing is selected.
		* This will be array of the selected items' index values, or an empty array if
		* nothing is selected.
		*
		* @type {Number | Number[]}
		* @default -1
		* @public
		*/
		selectedIndex: -1
	},

	/**
	* @private
	*/
	firstDayOfWeek: 0,

	/**
	* @private
	*/
	weekEndStart: 6,

	/**
	* @private
	*/
	weekEndEnd: 0,

	events: {
		/**
		* {@link module:moonstone/DaySelector~DaySelector#onChange}
		*/
		onChange: ''
	},
	/**
	* @private
	*/
	handlers: {
		ontap: 'tap'
	},

	/**
	* @private
	*/
	tools: [
		{kind: Signals, onlocalechange: 'handleLocaleChangeEvent'}
	],

	/**
	* @private
	*/
	daysComponents: [
		{content: 'Sunday'},
		{content: 'Monday'},
		{content: 'Tuesday'},
		{content: 'Wednesday'},
		{content: 'Thursday'},
		{content: 'Friday'},
		{content: 'Saturday'}
	],

	/**
	* @private
	*/
	days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],

	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function() {
			// super initialization
			sup.apply(this, arguments);
			this.createChrome(this.tools);
			this.initILib();
			this.selected=[];
			this.createComponents(this.daysComponents);
		};
	}),

	/**
	* @private
	*/
	initILib: function () {
		var i, index;
		if (typeof ilib !== 'undefined') {
			var df = new DateFmt({length: 'full'});
			var sdf = new DateFmt({length: 'long'});
			var li = new LocaleInfo(ilib.getLocale());
			var daysOfWeek = df.getDaysOfWeek();
			var days = sdf.getDaysOfWeek();

			this.firstDayOfWeek = li.getFirstDayOfWeek();
			this.weekEndStart = li.getWeekEndStart ? li.getWeekEndStart() : this.weekEndStart;
			this.weekEndEnd = li.getWeekEndEnd ? li.getWeekEndEnd() : this.getWeekEndEnd;

			// adjust order of days
			this.daysComponents = [];
			this.days = [];
			for (i = 0; i < 7; i++) {
				index = (i + this.firstDayOfWeek) % 7;
				this.daysComponents[i] = {kind: FormCheckbox, content: this.shortDayText ? days[index] : daysOfWeek[i], classes:"moon-day-picker-control"};
				this.days[i] = days[index];
			}
		}
	},

	/**
	* @private
	*/
	handleLocaleChangeEvent: function () {
		this.destroyClientControls();
		this.initILib();
		this.createComponents(this.daysComponents);
		this.render();
	},

	/**
	* @private
	*/
	tap: function (sender, ev) {
		if (sender.checked && this.selected.indexOf(sender) < 0 )
			this.selected.push(sender);
		else if(this.selected.indexOf(sender) >= 0)
			this.selected.splice(this.selected.indexOf(sender), 1);

		this.rebuildSelectedIndices(this.selected,this.getClientControls());
		if(this.hasNode()) {
			this.fireChangeEvent();
		}
		var str = this.getRepresentativeString();
		if (str) {
			return str;
		}
	},

	/**
	* @method
	* @private
	*/
	rebuildSelectedIndices: function(selected, controls) {
		this.selectedIndex = [];
		for (var i = 0; i < controls.length; i++) {
			if (selected.indexOf(controls[i]) >= 0) {
				this.selectedIndex.push(i);
			}
		}
		this.selectedIndex.sort();
	},

	/**
	* Fires an `onChange` event.
	*
	* @fires module:moonstone/DaySelector~DaySelector#onChange
	* @private
	*/
	fireChangeEvent: function () {
		var contentStr = this.multiSelectCurrentValue();
		this.doChange({
			selected: this.getSelected(),
			content: contentStr,
			index: this.getSelectedIndex()
		});
	},

	/**
	* @private
	*/
	multiSelectCurrentValue: function () {
		var str = this.getRepresentativeString();
		if (str) {
			return str;
		}

		for (var i=0; i < this.selectedIndex.length; i++) {
			if (!str) {
				str = this.days[this.selectedIndex[i]];
			} else {
				str = str + ', ' + this.days[this.selectedIndex[i]];
			}
		}
		return str || this.getNoneText();
	},

	/**
	* @private
	*/
	getRepresentativeString: function () {
		var bWeekEndStart = false,
			bWeekEndEnd = false,
			length = this.selectedIndex.length,
			weekendLength = this.weekEndStart === this.weekEndEnd ? 1 : 2,
			index, i;

		if (length == 7) return this.everyDayText;

		for (i = 0; i < 7; i++) {
			// convert the control index to day index
			index = (this.selectedIndex[i] + this.firstDayOfWeek) % 7;
			bWeekEndStart = bWeekEndStart || this.weekEndStart == index;
			bWeekEndEnd = bWeekEndEnd || this.weekEndEnd == index;
		}

		if (bWeekEndStart && bWeekEndEnd && length == weekendLength) {
			return this.everyWeekendText;
		} else if (!bWeekEndStart && !bWeekEndEnd && length == 7 - weekendLength) {
			return this.everyWeekdayText;
		}
	}
});
