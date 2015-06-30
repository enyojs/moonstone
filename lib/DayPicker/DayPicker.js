/**
* Contains the declaration for the {@link module:moonstone/DayPicker~DayPicker} kind.
* @module moonstone/DayPicker
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	Signals = require('enyo/Signals');

var
	ilib = require('enyo-ilib');

var
	ExpandablePicker = require('../ExpandablePicker'),
	$L = require('../i18n');

/**
* {@link module:moonstone/DayPicker~DayPicker}, which extends {@link module:moonstone/ExpandablePicker~ExpandablePicker}, is
* a drop-down picker menu that solicits day of the week from the user.
*
* ```
* var DayPicker = require('moonstone/DayPicker');
* ...
* {kind: DayPicker}
* ```
*
* When the picker is minimized, the currently selected day are
* displayed as subtext below the picker label. And if the picker select every weekday,
* subtext will be changed 'Every Weekday' automatically.
*
* The content of representative value can be changed.
* ```
* {kind: DayPicker, everyWeekdayText:'Weekdays', everyWeekendText:'Weekends', everyDayText:'Daily'}
* ```
*
* @class DayPicker
* @extends module:moonstone/ExpandablePicker~ExpandablePicker
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/DayPicker~DayPicker.prototype */ {

	/**
	* @private
	*/
	name: 'moon.DayPicker',

	/**
	* @private
	*/
	kind: ExpandablePicker,

	/**
	* @private
	*/
	autoCollapseOnSelect: false,

	/**
	* @private
	*/
	multipleSelection: true,

	/**
	* @private
	*/
	content: $L('Select days'),

	/**
	* @private
	* @lends module:moonstone/DayPicker~DayPicker.prototype
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
		noneText: $L('Nothing selected')
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
			this.createComponents(this.daysComponents);
		};
	}),

	/**
	* @private
	*/
	initILib: function () {
		var i, index;
		if (typeof ilib !== 'undefined') {
			var df = new ilib.DateFmt({length: "full"});
			var sdf = new ilib.DateFmt({length: "long"});
			var li = new ilib.LocaleInfo(ilib.getLocale());
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
				this.daysComponents[i] = {content: daysOfWeek[index]};
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
