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
	* {kind: 'moon.DayPicker', everyWeekday:'Weekdays', everyWeekend:'Weekends', everyday:'Daily'}
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
			* @default 'Everyday'
			* @public
			*/
			everydayText: moon.$L('Monday'),

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
		dayOfTheWeek: [
			{content: 'Monday'},
			{content: 'Tuesday'},
			{content: 'Wednesday'},
			{content: 'Thursday'},
			{content: 'Friday'},
			{content: 'Saturday'},
			{content: 'Sunday'}
		],

		/**
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function() {
				// super initialization
				sup.apply(this, arguments);

				this.createComponents(this.dayOfTheWeek);
			};
		}),

		/**
		* @private
		*/
		multiSelectCurrentValue: function () {
			var indexLength = this.selectedIndex.length;
			var joinIndex = this.selectedIndex.join();

			if (indexLength === 7) {
				return this.everydayText;
			} else if (indexLength === 5 && joinIndex == '0,1,2,3,4') {
				return this.everyWeekdayText;
			} else if (indexLength === 2 && joinIndex == '5,6') {
				return this.everyWeekendText;
			}

			var controls = this.getCheckboxControls();
			var str = '';
			for (var i=0; i < this.selectedIndex.length; i++) {
				if (!str) {
					str = controls[this.selectedIndex[i]].getContent().substring(0,3);
				} else {
					str = str + ', ' + controls[this.selectedIndex[i]].getContent().substring(0,3);
				}
			}
			return str || this.getNoneText();
		}

	});

})(enyo, this);
