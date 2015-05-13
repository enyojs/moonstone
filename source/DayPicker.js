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
			noneText: moon.$L('Nothing selected')
		},

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
			{kind: 'enyo.Signals', onlocalechange: 'handleLocaleChangeEvent'}
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
		create: enyo.inherit(function (sup) {
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
			if (typeof ilib !== 'undefined') {
				var df = new ilib.DateFmt({length: "full"});
				var sdf = new ilib.DateFmt({length: "long"});
				var li = new ilib.LocaleInfo(ilib.getLocale());
				var daysFullName = df.getDaysOfWeek();
				this.days = sdf.getDaysOfWeek();
				var firstDayOfWeek = li.getFirstDayOfWeek();
				this.weekEndStart = li.getWeekEndStart();
				this.weekEndEnd = li.getWeekEndEnd();

				var index;
				switch (firstDayOfWeek) {
				case 0 :
					for (index = 0; index < this.daysComponents.length; index++) {
						this.daysComponents[index].content = daysFullName[index];
					}
					break;
				case 1 :
					for (index = 1; index < this.daysComponents.length; index++) {
						this.daysComponents[index-1].content = daysFullName[index];
					}
					this.daysComponents[6].content = daysFullName[0];
					this.days.push(this.days.shift());
					this.weekEndStart = this.weekEndStart ? this.weekEndStart-1 : 6;
					this.weekEndEnd = this.weekEndEnd ? this.weekEndEnd-1 : 6;
					break;
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
			var hasWeekEnd = this.checkWeekEnd();

			switch (indexLength) {
			case 7 :
				return this.everyDayText;
			case 5 :
				if (hasWeekEnd === false) {
					return this.everyWeekdayText;
				}
				break;
			case 2 :
				if (hasWeekEnd === true) {
					return this.everyWeekendText;
				}
				break;
			}
		},

		/**
		* @private
		*/
		checkWeekEnd: function () {
			var bWeekEndStart = this.selectedIndex.indexOf(this.weekEndStart);
			var bWeekEndEnd = this.selectedIndex.indexOf(this.weekEndEnd);

			if (bWeekEndStart >= 0 && bWeekEndEnd >= 0) {
				return true;
			} else if (bWeekEndStart == -1 && bWeekEndEnd == -1) {
				return false;
			}
		}
	});
})(enyo, this);
