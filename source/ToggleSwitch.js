(function (enyo, scope) {
	/**
	* `moon.ToggleSwitch`, which extends {@link moon.Checkbox}, is a control
	* that looks like a switch with an 'on' state and an 'off' state. When the
	* ToggleSwitch is tapped, it switches its state and fires an
	* [`onChange`]{@link enyo.Checkbox#event:onChange} event.
	*
	* @class moon.ToggleSwitch
	* @extends moon.Checkbox
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ToggleSwitch.prototype */ {

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

