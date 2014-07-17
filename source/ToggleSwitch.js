(function (enyo, scope) {
	/**
	 _moon.ToggleSwitch_, which extends [moon.Checkbox](#moon.Checkbox), is a control
	 that looks like a switch with an 'on' state and an 'off' state. When the
	 ToggleSwitch is tapped, it switches its state and fires an _onChange_ event.
	 *
	 * @class moon.ToggleSwitch
	 * @extends moon.Checkbox
	 * @public
	 * @ui
	 */
	enyo.kind(
		/** @lends  moon.ToggleSwitch.prototype */ {

		/**
		 * @private
		 */
		name: 'moon.ToggleSwitch',

		/**
		 * @private
		 */
		kind: 'moon.Checkbox',

		/**
		 * @private
		 */
		classes: 'moon-toggle-switch',

		/**
		 * @private
		 */
		rendered: function () {
			this.inherited(arguments);
			// wait until after we're rendered to allow animation.
			enyo.asyncMethod(this, function () {
				this.addClass('animated');
			});
		}
	});

})(enyo, this);

