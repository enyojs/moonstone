(function (enyo, scope) {
	/**
	* {@link moon.DayPicker}, which extends {@link moon.ExpandablePicker}, is
	* a drop-down picker menu that solicits day of the week from the user.
	*
	* ```
	* {kind: 'moon.DayPicker'}
	* ```
	*
	* When the picker is minimized, the currently selected day are
	* displayed as subtext below the picker label. And if the picker select every weekday,
	* subtext will be changed 'Every Weekday' automatically.
	*
	* The content of representative value can be changed.
	* ```
	* {kind: 'moon.DayPicker', everyWeekdayText:'Weekdays', everyWeekendText:'Weekends', everyDayText:'Daily'}
	* ```
	*
	* @class moon.DayPicker
	* @extends moon.ExpandablePicker
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.DayPicker.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DayPicker',

		/**
		* @private
		*/
		kind: 'moon.ExpandablePicker',

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
		content: moon.$L('Select days'),

		/**
		* @private
		* @lends moon.DayPicker.prototype
		*/
		published: {

			/**
			* Text to be displayed when all of the day are selected.
			*
			* @type {String}
			* @default 'Every Day'
			* @public
			*/
			everyDayText: moon.$L('Every Day'),

			/**
			* Text to be displayed when all of the weekday are selected.
			*
			* @type {String}
			* @default 'Every Weekday'
			* @public
			*/
			everyWeekdayText: moon.$L('Every Weekday'),

			/**
			* Text to be displayed when all of the weekend are selected.
			*
			* @type {String}
			* @default 'Every Weekend'
			* @public
			*/
			everyWeekendText: moon.$L('Every Weekend'),

			/**
			* Text to be displayed as the current value if no item is currently selected.
			*
			* @type {String}
			* @default 'Nothing selected'
			* @public
			*/
			noneText: moon.$L('Nothing selected'),

			/**
			*
			* The first day of the week in the current locale.
			* Valid values are `0` (i.e., Sunday) or `1` (Monday). Default is `null`.
			*
			* @type {Number}
			* @default null
			* @public
			*/
			firstDayOfWeek: null
		},

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
		create: enyo.inherit(function (sup) {
			return function() {
				// super initialization
				sup.apply(this, arguments);
				this.initILib();
				this.createComponents(this.daysComponents);
				this.createComponent({kind: 'enyo.Signals', onlocalechange: 'handleLocaleChangeEvent'});
			};
		}),

		/**
		* @private
		*/
		initILib: function () {
			if (typeof ilib !== 'undefined') {
				var df = new ilib.DateFmt({length: "full"});
				var sdf = new ilib.DateFmt({length: "long"});
				var li = new ilib.LocaleInfo(ilib.getLocale());
				var daysFullName = df.getDaysOfWeek();
				this.days = sdf.getDaysOfWeek();
				this.firstDayOfWeek = this.firstDayOfWeek || li.getFirstDayOfWeek();

				if (this.firstDayOfWeek == 1) {
					for (var i = 1; i < this.daysComponents.length; i++) {
						this.daysComponents[i-1].content = daysFullName[i];
					}
					this.daysComponents[6].content = daysFullName[0];
					this.days.push(this.days.shift());
				} else {
					for (var i = 0; i < this.daysComponents.length; i++) {
						this.daysComponents[i].content = daysFullName[i];
					}
				}
			}
		},

		/**
		* @private
		*/
		handleLocaleChangeEvent: function () {
			if (typeof ilib !== 'undefined') {
				this.initILib();
				this.refresh();
			}
		},

		/**
		* @private
		*/
		multiSelectCurrentValue: function () {
			var str = this.checkDays();
			if (str){
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
		checkDays: function () {
			var indexLength = this.selectedIndex.length;
			var joinIndex = this.selectedIndex.join();

			if (indexLength === 7) {
				return this.everyDayText;
			}

			if (this.firstDayOfWeek == 1) {
				if (joinIndex == '0,1,2,3,4') {
					return this.everyWeekdayText;
				} else if (joinIndex == '5,6') {
					return this.everyWeekendText;
				}
			} else {
				if (joinIndex == '1,2,3,4,5') {
					return this.everyWeekdayText;
				} else if (joinIndex == '0,6') {
					return this.everyWeekendText;
				}
			}
		}
	});
})(enyo, this);
