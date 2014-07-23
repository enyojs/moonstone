(function (enyo, scope) {
	/**
	* _moon.Checkbox_ is a box that, when clicked, shows or hides a checkmark and
	* fires an {@link enyo.Checkbox#event:onChange} event. It derives from {@link enyo.Checkbox} and
	* is designed to be used with {@link moon.CheckboxItem}.
	*
	* @ui
	* @class moon.Checkbox
	* @extends enyo.Checkbox
	* @public
	*/
	enyo.kind(
		/** @lends moon.Checkbox.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Checkbox',

		/**
		* @private
		*/
		classes: 'moon-checkbox',

		/**
		* @private
		*/
		kind: enyo.Checkbox,

		/**
		* @private
		*/
		tag: 'div',

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		handlers: {

			/**
			* prevent double onchange bubble in IE
			* @private
			*/
			onclick: ''
		},

		/**
		* @fires enyo.Checkbox#event:onChange
		* @private
		*/
		tap: function (inSender, e) {
			if (!this.disabled) {
				this.setChecked(!this.getChecked());
				this.bubble('onchange');
			} else {
				return true;
			}
		},

		/**
		* @private
		*/
		dragstart: function () {
			// Override enyo.Input dragstart handler, to allow drags to propagate for Checkbox
		}
	});

})(enyo, this);