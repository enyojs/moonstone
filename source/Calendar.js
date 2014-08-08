(function (enyo, scope) {
	/**
	* Fires when a date is selected. No additional data is passed in this event.
	*
	* @event moon.CalendarDate#onDateSelected
	* @type {Object}
	* @public
	*/

	/**
	* Fires when [value]{@link moon.Calendar#value} changes.
	*
	* @event moon.Calendar#onChange
	* @type {Object}
	* @property {Date} value - A standard JavaScript {@glossary Date} object
	* @public
	*/

	/**
	* {@link moon.CalendarDate} implements a control representing a single day, used by
	* the monthly calendar kind {@link moon.Calendar}.
	*
	* @class moon.CalendarDate
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.CalendarDate.prototype */ {

		/**
		* @private
		*/
		name: 'moon.CalendarDate',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* @private
		* @lends moon.CalendarDate.prototype
		*/
		published: {

			/**
			* {@glossary Date} object
			*
			* @type {Date}
			* @default null
			* @public
			*/
			value: null,

			/**
			* Whether this date's coloring should be different from normal.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			color: false,

			/**
			* Used when the CalendarDate is part of an {@link enyo.Group}. A value of
			* `true` indicates that this is the active button of the group; false,
			* that it is not the active button.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			active: false
		},

		/**
		* @private
		*/
		events: {
			onDateSelected:''
		},

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		small: true,

		/**
		* @private
		*/
		marquee: false,

		/**
		* @private
		*/
		minWidth: false,

		/**
		* @private
		*/
		classes: 'moon-calendar-picker-date enyo-unselectable',

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			if (typeof ilib !== 'undefined' && arguments.length > 0 && typeof(arguments[0].formatter) !== 'undefined') {
				// re-use this formatter to avoid creating a new one for each calendar date instance
				this._tf = arguments[0].formatter;
			}
		},

		/**
		* @private
		*/
		colorChanged: function () {
			this.addRemoveClass('moon-calendar-picker-date-shadow', this.color);
		},

		/**
		* @private
		*/
		valueChanged: function () {
			if (this.value) {
				if (typeof ilib !== 'undefined') {
					this.localeValue = ilib.Date.newInstance({
						unixtime: this.value.getTime(),
						timezone: 'local'
					});
					this.setContent(this._tf.format(this.localeValue));
				} else {
					this.setContent(this.value.getDate());
				}
			}
		},

		/**
		* Only called when [iLib]{@glossary ilib} is available. Allows the same
		* formatter to be shared across all calendar date instances, which is more
		* efficient than having each one make its own formatter. 
		* @private
		*/
		setDateFormatter: function (formatter) {
			// need to recreate the local value because
			// the new locale may have a different time
			// zone or calendar, so the date components
			// (year/month/day) may be different than before
			this.localeValue = ilib.Date.newInstance({
				unixtime: this.value.getTime(),
				timezone: 'local'
			});

			// reformat the number with the new timezone/calendar/locale
			this._tf = formatter;
			this.setContent(this._tf.format(this.localeValue));
		},
		
		/**
		* @private
		* @fires moon.CalendarDate#onDateSelected
		*/
		tap: function () {
			this.doDateSelected();
		}
	});

	/**
	* {@link moon.SimpleMonthPicker} implements a control representing the month picker,
	* used by the monthly calendar kind {@link moon.Calendar}, which can represent
	* internationalized months when [iLib]{@glossary iLib} is available.
	*
	* @ui
	* @class moon.SimpleMonthPicker
	* @extends moon.SimplePicker
	* @public
	*/
	enyo.kind(
		/** @lends moon.SimpleMonthPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.SimpleMonthPicker',

		/**
		* @private
		*/
		kind: 'moon.SimplePicker',

		/**
		* @private
		*/
		published: /** @lends moon.SimpleMonthPicker.prototype */ {

			/**
			* How many months to show. A few international calendars
			* have more than 12 months in some years, but by default,
			* we will use the Gregorian calendar with 12 months.
			* 
			* @type {Number}
			* @default 12
			* @public
			*/
			months: 12
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
		},

		/** 
		* Shows/hides previous/next buttons based on current index.
		*
		* @private
		* @override
		*/
		showHideNavButtons: function() {
			var index = this.getSelectedIndex(),
				maxIndex = Math.max(this.months, enyo.filter(this.getClientControls(), function(val, idx, arr) { return val.content; }).length) - 1;
			var prevButton = this.rtl ? this.$.buttonRight : this.$.buttonLeft;
			var nextButton = this.rtl ? this.$.buttonLeft : this.$.buttonRight;

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
		* Cycles the selected item to the one after the currently selected item.
		* Make sure not to cycle past the last month in the picker for this
		* calendar.
		*
		* @public
		* @override
		*/
		next: function(sender, e) {
			if (!this.disabled) {
				var idx = this.selectedIndex + 1;
				var max = Math.min(this.getClientControls().length, this.months);
				if (idx > max - 1) {
					idx = this.wrap ? 0 : max - 1;
				}
				if (!this.wrap && idx === max - 1 
					&& e && e.cancelHoldPulse) {
					e.cancelHoldPulse();
				}
				this.setSelectedIndex(idx);
			}
		}

	});

	/**
	* {@link moon.Calendar} is a control that displays a monthly calendar, with the
	* month name at the top and a grid of days, grouped into rows by week, below.
	*
	* The header buttons are used to navigate to the desired month; the desired day
	* is selected by tapping on it.
	*
	* ```
	* {kind: 'moon.Calendar', content: 'Calendar Title'}
	* ```
	*
	* @class moon.Calendar
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Calendar.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Calendar',


		/**
		* @private
		* @lends moon.Calendar.prototype
		*/
		published: {

			/**
			*
			* Current locale used for formatting. May be set after the control is
			* created, in which case the control will be updated to reflect the
			* new value.  Only valid if [iLib]{@glossary ilib} is loaded.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			locale: '',

			/**
			*
			* The current {@glossary Date} object.
			*
			* @type {Date}
			* @default null
			* @public
			*/
			value: null,

			/**
			*
			* The first day of the week in the current locale.
			* Valid values are `0` (i.e., Sunday) through `6` (Saturday). Default is `0`.
			*
			* @type {Number}
			* @default 0
			* @public
			*/
			firstDayOfWeek: 0,

			/**
			*
			* Maximum number of weeks to display on a screen.
			* If this value is greater than `9`, dates two months in the future may be
			* shown. Unexpected input may result in errors.
			*
			* @type {Number}
			* @default 6
			* @public
			*/
			maxWeeks: 6,

			/**
			*
			* Start value for range of years displayed in year picker.
			*
			* @type {Number}
			* @default 1900
			* @public
			*/
			startYear: 1900,

			/**
			*
			* End value for range of years displayed in year picker.
			*
			* @type {Number}
			* @default 2200
			* @public
			*/
			endYear: 2200,

			/**
			*
			* CSS classes used to decorate day labels (e.g., `'moon-divider'`).
			*
			* @type {String}
			* @default ''
			* @public
			*/
			dayOfWeekClasses: '',

			/**
			*
			* Length of abbreviation to use for day of the week.
			* Accepted values are `'short'`, `'medium'`, `'long'`, and `'full'`.
			* Only valid if [iLib]{@glossary ilib} is loaded.
			*
			* @type {String}
			* @default 'short'
			* @public
			*/
			dayOfWeekLength: 'short'
		},

		/**
		* @private
		*/
		events: {
			/**
				Fires when the date changes.

				`inEvent.value` contains a standard JavaScript Date object representing
				the current date.
			*/
			onChange: ''
		},

		/**
		* @private
		*/
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

		/**
		* @private
		*/
		days: ['S','M','T','W','T','F','S'],

		/**
		* @private
		*/
		classes: 'moon-calendar-picker',

		/**
		* @private
		*/
		components: [
			{name: 'monthPicker', kind: 'moon.SimpleMonthPicker', classes: 'moon-calendar-picker-month', onChange: 'selectMonthPicker'},
			{name: 'yearPicker', kind: 'moon.SimplePicker', classes: 'moon-calendar-picker-year', onChange: 'selectYearPicker'},
			{name: 'days', classes: 'moon-calendar-picker-days moon-neutral', kind: 'enyo.Group'},
			{name: 'dates', kind: 'enyo.Group'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.initCalendar();
			this.set('value', this.value || new Date(), true);
			if (typeof ilib !== 'undefined') {
				this._tf = new ilib.DateFmt({
					type: 'date',	//only format the date component, not the time
					date: 'w',		//'w' is the day of the week
					useNative: false,
					length: this.dayOfWeekLength,
					timezone: 'local'
				});
				this.setLocale(new ilib.LocaleInfo().locale);
			}
		},

		/**
		* Creates picker contents with default `(en-US)` values.
		*
		* @private
		*/
		initCalendar: function () {
			var i;
			var startYear = this.getStartYear(),
				endYear = this.getEndYear(),
				numberOfMonths = 12; // in the Gregorian calendar

			if (typeof ilib !== 'undefined') {
				this.cal = ilib.Cal.newInstance();
				this.localeValue = ilib.Date.newInstance({timezone: 'local'});
				this._dateFormatter = new ilib.DateFmt({
					type: 'date',	// only format the date component, not the time
					date: 'd',		// 'd' is the date of month
					useNative: false,
					length: 'short',	//it uses 2 chars to abbreviate properly
					timezone: 'local'
				});
				// Create 13 months components in the month picker to take care of 
				// the Hebrew calendar, but only show the last month in those Hebrew
				// years that actually have 13 months
				numberOfMonths = 13;
			}

			//Populates SimplePicker with years.
			for (i = startYear; i <= endYear; i++) {
				this.$.yearPicker.createComponent({content: i, classes: 'picker-content'});
			}
			//Populates SimplePicker with months of the year, from JAN to DEC.
			var months = this.months;
			for (i = 0; i < numberOfMonths; i++) {
				this.$.monthPicker.createComponent({content: months[i], classes: 'picker-content'});
			}
			//Initializes days of the week. SUN is the first and SAT is the last.
			for(i = 0; i < 7; i++) {
				this.$.days.createComponent({
					content: this.days[i],
					classes: 'moon-calendar-picker-day-base ' + (this.dayOfWeekClasses || 'moon-calendar-picker-day'),
					disabled: true
				});
			}
			//Populates Calendar with CalendarDate objects.
			if (!this.$.dates.controls.length) {
				for (i = 1; i <= this.maxWeeks * 7; i++) {
					this.$.dates.createComponent({
						kind: 'moon.CalendarDate', 
						onDateSelected:'selectDate',
						formatter: this._dateFormatter // undefined if ilib is not available
					}, {owner:this});
				}
			}
		},

		/**
		 * When [iLib]{@glossary ilib} is supported, calculates the start year in
		 * the current calendar. Otherwise, returns the value of the 
		 * [startYear]{@link moon.Calendar#startYear} published property.
		 * 
		 * @private
		 */
		getStartYear: function() {
			if (typeof ilib !== 'undefined') {
				var greg = ilib.Date.newInstance({
					type: "gregorian",
					year: this.startYear,
					month: 1,
					day: 1,
					timezone: 'local'
				});
				var localCalendarDate = ilib.Date.newInstance({
					julianday: greg.getJulianDay(),
					timezone: "local"
				});
				return localCalendarDate.getYears();
			} else {
				return this.startYear;
			}
		},
		
		/**
		 * When [iLib]{@glossary ilib} is supported, calculates the end year in
		 * the current calendar. Otherwise, returns the value of the
		 * [endYear]{@link moon.Calendar#endYear} property.
		 * 
		 * @private
		 */
		getEndYear: function() {
			if (typeof ilib !== 'undefined') {
				var greg = ilib.Date.newInstance({
					type: "gregorian",
					year: this.endYear,
					month: 1,
					day: 1,
					timezone: 'local'
				});
				var localCalendarDate = ilib.Date.newInstance({
					julianday: greg.getJulianDay(),
					timezone: "local"
				});
				return localCalendarDate.getYears();
			} else {
				return this.endYear;
			}
		},
		
		/**
		* When [iLib]{@glossary ilib} is supported, `this.locale` is taken from the
		* value passed in at Calendar instantiation time, or retrieved from the
		* default locale `(en-US)`.
		*
		* @fires moon.Calendar#onChange
		* @private
		*/
		localeChanged: function () {
			if (typeof ilib !== 'undefined') {
				ilib.setLocale(this.locale);
				// the new locale may use a different calendar, so
				// redo the local date in that new calendar. The this.value
				// does not change, but the local date does.
				this.localeValue = ilib.Date.newInstance({
					unixtime: this.value.getTime(),
					timezone: 'local'
				});

				this._monthFmt = undefined; // force it to recreate the formatter
				this.calendarChanged();
				this.firstDayOfWeek = -1; // Force change handler when locale changes
				this.setFirstDayOfWeek(new ilib.LocaleInfo(this.locale).getFirstDayOfWeek());

				// notify each date instance as well
				var dates = this.$.dates.getControls();
				this._dateFormatter = new ilib.DateFmt({
					type: 'date',	// only format the date component, not the time
					date: 'd',		// 'd' is the date of month
					useNative: false,
					length: 'short',	//it uses 2 chars to abbreviate properly
					timezone: 'local'
				});
				for (var i = 0; i < this.$.dates.controls.length; i++) {
					dates[i].setDateFormatter(this._dateFormatter);
				}
			}
			this.updateYearPicker();
			this.updateMonthPicker();
			this.dayOfWeekLengthChanged();
			this.doChange({value: this.value});
		},

		/**
		* Sometimes the first day of week changes because of a locale change.
		* When this happens, we destroy the day label and reconstruct it.
		* We create a new {@link ilib.Date} instance with the time of the given day, and get
		* a Gregorian date instance that represents the first day of the week.
		*
		* @private
		*/
		firstDayOfWeekChanged: function () {
			this.updateDays();
			this.updateDates();
		},

		/**
		* We were previously relying on a non-guaranteed ordering of calls (change handlers
		* on bindings, transformation of binding values) to perform validation on the
		* Date value before updating a control with this value. Though this ordering was
		* non-guaranteed, it has since changed and can possibly affect any code that is
		* improperly relying on the specific ordering of these calls. We instead handle the
		* validation in the generic setter and facade this via the `setValue()` method.
		*
		* @private
		*/
		setValue: function (inValue) {
			this.set('value', inValue);
		},

		/**
		* @method
		* @private
		*/
		set: enyo.inherit(function (sup) {
			return function (path, value) {
				if (path == 'value') {
					if(isNaN(value) || value === null) {
						value = new Date();
					}
				}
				sup.apply(this, arguments);
			};
		}),

		/**
		* @fires moon.Calendar#onChange
		* @private
		*/
		valueChanged: function (inOld) {
			var month, year;
			
			if (typeof ilib !== 'undefined') {
				this.localeValue = ilib.Date.newInstance({
					unixtime: this.value.getTime(),
					timezone: 'local'
				});
				month = this.localeValue.getMonths() - 1;
				year = this.localeValue.getYears();
			} else {
				month = this.value.getMonth();
				year = this.value.getFullYear();
			}
				
			if (!this.generated || this.$.monthPicker.getSelectedIndex() != month) {
				this.$.monthPicker.setSelectedIndex(month);
			}
			if (!this.generated || this.$.yearPicker.getSelected().getContent() != year) {
				this.$.yearPicker.setSelectedIndex(year - this.getStartYear());
			}
			this.updateDates();
			if (this.value) {
				this.doChange({value: this.value});
			}
		},

		/**
		* Updates year picker.
		*
		* @private
		*/
		updateYearPicker: function () {
			var yearPickerControls = this.$.yearPicker.getClientControls(),
				startYear = this.getStartYear(),
				endYear = this.getEndYear();
			for (var i = 0; i < endYear - startYear; i++) {
				yearPickerControls[i].setContent(i + startYear);
			}
			var year = (typeof ilib !== 'undefined') ? this.localeValue.getYears() : this.value.getFullYear();
			this.$.yearPicker.setSelectedIndex(year - this.getStartYear());
		},

		/**
		* Updates month name displayed in month picker.
		*
		* @private
		*/
		updateMonthPicker: function () {
			var month;
			if (typeof ilib !== 'undefined') {
				if (typeof(this._monthFmt) === 'undefined') {
					this._monthFmt = new ilib.DateFmt({
						locale: this.locale,
						type: 'date',	//only format the date component, not the time
						date: 'm',		//'m' is the month of year
						useNative: false,
						length: 'long'
					});
				}
				var numberOfMonths = this.cal.getNumMonths(this.localeValue.getYears());
				var monthPickerControls = this.$.monthPicker.getClientControls();
				
				// show the 13th month for those calendars that use it, and only in those
				// years that use it
				this.$.monthPicker.setMonths(numberOfMonths);
				
				// this depends on the year because some calendars have 12 or 13 months, 
				// depending on which year it is 
				var monthNames = this._monthFmt.getMonthsOfYear({
					year: this.localeValue.getYears(),
					length: 'long'
				});
				for (var i = 0; i < monthNames.length - 1; i++) {
					monthPickerControls[i].setContent(monthNames[i+1]);
				}
				month = this.localeValue.getMonths() - 1;
			} else {
				month = this.value.getMonth();
			}
			this.$.monthPicker.setSelectedIndex(month);
		},

		/**
		* Updates days of the week from first day to last day.
		* If [iLib]{@glossary ilib} is loaded, a `'0'` value for `this.firstDayOfweek`
		* means Sunday and `'1'` means Monday.
		* An offset is applied to make the displayed day names behave as expected.
		*
		* @private
		*/
		updateDays: function () {
			var daysControls = this.$.days.getClientControls();
			var dayOfWeekNames = (typeof ilib !== 'undefined') ? 
					this._tf.getDaysOfWeek({length: this.dayOfWeekLength}) : 
					this.days;
			for(var i = 0; i < 7; i++) {
				var dow = (this.firstDayOfWeek + i) % 7;
				daysControls[i].setContent(dayOfWeekNames[dow]);
			}
		},

		/**
		* Sets up first week of this month.
		* Before the first day of this month, days from the previous month will be
		* used to fill the calendar.
		*
		* @private
		*/
		updatePrevMonth: function () {
			var dt,
				dates,
				i;
			if (typeof ilib !== 'undefined') {
				// get the first of this month
				dt = ilib.Date.newInstance({
					year: this.localeValue.getYears(),
					month: this.localeValue.getMonths(),
					day: 1,
					timezone: 'local'
				});
				
				// find the week-start day on or before the first of the month
				var sunday = dt.onOrBefore(this.firstDayOfWeek);
				
				// if the sunday is before the current date
				var sunJD = sunday.getJulianDay();
				var daysBefore = Math.floor(dt.getJulianDay() - sunJD); 
				if (daysBefore > 0) {
					dates = this.$.dates.getControls();
					var temp;
					for (i = 0; i <= daysBefore; i++) {
						temp = ilib.Date.newInstance({
							julianday: sunJD + i,
							timezone: 'local'
						});
						dates[i].setValue(temp.getJSDate());
						dates[i].setColor(true);
					}
					return daysBefore;
				}
			} else {
				var value = this.value;
				dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
				dt.setDate(0);
				var thisYear = dt.getFullYear(),
					datesOfPrevMonth = dt.getDate(),
					dayOfLastDate = dt.getDay() - this.firstDayOfWeek,
					prevMonth = dt.getMonth();
				if (dayOfLastDate < 0) {
					dayOfLastDate += 7;
				}
				if (dayOfLastDate !== 6) {
					dates = this.$.dates.getControls();
					for (i = 0; i <= dayOfLastDate; i++) {
						dates[i].setValue(new Date(thisYear, prevMonth, datesOfPrevMonth - dayOfLastDate + i));
						dates[i].setColor(true);
					}
				}
			}
			return 0;
		},

		/**
		* Sets up last week of this month.
		* After the last day of this month, days from the next month will be used to
		* fill the calendar.
		*
		* @private
		*/
		updateNextMonth: function (datesOfPrevMonth, monthLength) {
			var startIndex = datesOfPrevMonth + monthLength,
				dates = this.$.dates.getControls(),
				i;
			
			if (typeof ilib !== 'undefined') {
				var lastDay = ilib.Date.newInstance({
					year: this.localeValue.getYears(),
					month: this.localeValue.getMonths(),
					day: monthLength,
					timezone: 'local'
				});

				// get the first day of the next month
				var jd = lastDay.getJulianDay() + 1;
				var temp;
				for (i = 0; i < this.$.dates.controls.length - startIndex; i++) {
					temp = ilib.Date.newInstance({
						julianday: jd + i,
						timezone: 'local'
					});
					dates[startIndex + i].setValue(temp.getJSDate());
					dates[startIndex + i].setColor(true);
				}
			} else {
				var value = this.value;
				var dt = new Date(value.getFullYear(), value.getMonth(), value.getDate());
				dt.setMonth(dt.getMonth() + 1);
				var thisYear = dt.getFullYear(),
					nextMonth = dt.getMonth();
				for (i = 0; i < this.$.dates.controls.length - startIndex; i++) {
					dates[startIndex + i].setValue(new Date(thisYear, nextMonth, i + 1));
					dates[startIndex + i].setColor(true);
				}
			}
		},

		/**
		* @private
		*/
		updateDates: function () {
			var datesOfPrevMonth = this.updatePrevMonth(),
				monthLength,
				thisYear,
				thisMonth,
				dates,
				temp,
				i;
			
			if (typeof ilib !== 'undefined') {
				thisYear = this.localeValue.getYears();
				thisMonth = this.localeValue.getMonths();
				monthLength = this.getMonthLength(thisYear, thisMonth);
				dates = this.$.dates.getControls();
				for (i = 0; i < monthLength; i++) {
					temp = ilib.Date.newInstance({
						year: thisYear,
						month: thisMonth,
						day: i + 1,
						timezone: 'local'
					});
					dates[datesOfPrevMonth + i].setValue(temp.getJSDate());
					dates[datesOfPrevMonth + i].setColor(false);
				}
				this.$.dates.setActive(dates[datesOfPrevMonth - 1 + this.localeValue.getDays()]);
			} else {
				thisYear = this.value.getFullYear();
				thisMonth = this.value.getMonth();
				monthLength = this.getMonthLength(thisYear, thisMonth);
				dates = this.$.dates.getControls();
				for (i = 0; i < monthLength; i++) {
					dates[datesOfPrevMonth + i].setValue(new Date(thisYear, thisMonth, i + 1));
					dates[datesOfPrevMonth + i].setColor(false);
				}
				this.$.dates.setActive(dates[datesOfPrevMonth - 1 + this.value.getDate()]);
			}
			this.updateNextMonth(datesOfPrevMonth, monthLength);
		},

		/**
		* @private
		*/
		setYear: function (newYear) {
			var month,
				day,
				newMonthLength;

			if (typeof ilib !== 'undefined') {
				if (this.localeValue.getYears() != newYear) {
					month = this.localeValue.getMonths();
					day = this.localeValue.getDays();
					
					newMonthLength = this.getMonthLength(newYear, month);
					
					this.localeValue = ilib.Date.newInstance({
						year: newYear,
						month: month,
						day: (day > newMonthLength) ? newMonthLength : day,
						timezone: 'local'
					});
					
					this.setValue(this.localeValue.getJSDate());
					
					// Some years have a different number of months in other calendars,
					// so we need to make sure to update the month names in the picker
					this.updateMonthPicker(); 
				}
			} else {
				if (this.value.getFullYear() != newYear) {
					month = this.value.getMonth();
					day = this.value.getDate();
					
					newMonthLength = this.getMonthLength(newYear, month);
					var newValue = new Date(newYear, month, (newMonthLength < day) ? newMonthLength : day);
					this.setValue(newValue);
				}
			}
		},

		/**
		* @private
		*/
		setMonth: function (newMonth) {
			var year, 
				day,
				newMonthLength,
				value,
				newValue;

			if (typeof ilib !== 'undefined') {
				newMonth++; // convert to ilib month
				if (this.localeValue.getMonths() != newMonth) {
					year = this.localeValue.getYears();
					day = this.localeValue.getDays();
					
					newMonthLength = this.getMonthLength(year, newMonth);
					
					this.localeValue = ilib.Date.newInstance({
						year: year,
						month: newMonth,
						day: (day > newMonthLength) ? newMonthLength : day,
						timezone: 'local'
					});
					
					this.setValue(this.localeValue.getJSDate());
				}
			} else {
				if (this.value.getMonth() != newMonth) {
					value = this.value;
					newMonthLength = this.getMonthLength(value.getFullYear(), newMonth);
					newValue = new Date(value.getFullYear(), newMonth, (newMonthLength < value.getDate()) ? newMonthLength : value.getDate());
					this.setValue(newValue);
				}
			}
		},

		/**
		* @private
		*/
		setDate: function (newDate) {
			var year, 
				month,
				newMonthLength,
				value,
				newValue;

			if (typeof ilib !== 'undefined') {
				year = this.localeValue.getYears();
				month = this.localeValue.getMonths();
				
				newMonthLength = this.getMonthLength(year, month);
				
				this.localeValue = ilib.Date.newInstance({
					year: year,
					month: month,
					day: (newDate > newMonthLength) ? newMonthLength : newDate,
					timezone: 'local'
				});
				
				this.setValue(this.localeValue.getJSDate());
			} else {
				value = this.value;
				newMonthLength = this.getMonthLength(value.getFullYear(), value.getMonth());
				newValue = new Date(value.getFullYear(), value.getMonth(), (newMonthLength < newDate) ? newMonthLength : newDate);
				this.setValue(newValue);
			}
		},

		/**
		* Responds to selection of a particular [CalendarDate]{@link moon.CalendarDate}.
		*
		* @private
		*/
		selectDate: function (inSender, inEvent) {
			var newValue = inEvent.originator.value;
			this.setValue(newValue);
			if (typeof ilib !== 'undefined') {
				this.localeValue = ilib.Date.newInstance({
					unixtime: newValue.getTime(),
					timezone: 'local'
				});
			}
			return true;
		},

		/**
		* Responds to change of year in year picker.
		*
		* @private
		*/
		selectYearPicker: function (inSender, inEvent) {
			var year = this.$.yearPicker.getSelected().getContent();
			this.setYear(year);
			// some calendars have a different number of months and different
			// names of months depending on the year
			this.updateMonthPicker();
		},

		/**
		* Responds to change of month in month picker.
		*
		* @private
		*/
		selectMonthPicker: function (inSender, inEvent) {
			var month = this.$.monthPicker.getSelectedIndex();
			this.setMonth(month);
		},

		/**
		* Returns number of days in a particular month/year.
		*
		* @private
		*/
		getMonthLength: function (inYear, inMonth) {
			if (typeof ilib !== 'undefined') {
				return this.cal.getMonLength(inMonth, inYear);
			} else {
				return 32 - new Date(inYear, inMonth, 32).getDate();
			}
		},

		/**
		* When [iLib]{@glossary ilib} is supported, and type of calendar is changed
		* (e.g., from gregorian to thaisolar, julian, arabic, hebrew or chinese),
		* calendar should check for any differences in year, month and day.
		*
		* @private
		*/
		calendarChanged: function () {
			var newCalendar = ilib.Cal.newInstance();
			if (newCalendar.getType() !== this.cal.getType()) {
				this.cal = newCalendar;
				this._monthFmt = undefined; // force it to recreate the formatter
				this.updateMonthPicker();
				this.updateYearPicker();
			}
		},

		/**
		* Switches CSS classes when the user (or developer) changes the day label
		* style dynamically.
		*
		* @private
		*/
		dayOfWeekClassesChanged: function (inOld) {
			var dayControls = this.$.days.getClientControls();
			for (var i = 0; i < dayControls.length; i++) {
				dayControls[i].removeClass(inOld || 'moon-calendar-picker-day');
				dayControls[i].addClass(this.dayOfWeekClasses || 'moon-calendar-picker-day');
			}
		},

		/**
		* @private
		*/
		dayOfWeekLengthChanged: function () {
			if (typeof ilib !== 'undefined') {
				this._tf = new ilib.DateFmt({
					type: 'date',	//only format the date component, not the time
					date: 'w',		//'w' is the day of the week
					useNative: false,
					length: this.dayOfWeekLength,
					timezone: "local"
				});
				this.updateDays();
			}
		}
	});

})(enyo, this);
