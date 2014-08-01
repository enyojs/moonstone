(function (enyo, scope) {
	/**
	* `moon.ToggleText`, which extends [`moon.Checkbox`]{@link moon.Checkbox}, is a control that
	* looks like a switch with labels for an 'on' state and an 'off' state. When the ToggleText is
	* tapped, it switches its state and fires an [`onChange`]{@link enyo.Checkbox#event:onChange}
	* event.
	*
	* @class moon.ToggleText
	* @extends moon.Checkbox
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.ToggleText.prototype */ {

		/**
		* @private
		*/
		name: 'moon.ToggleText',

		/**
		* @private
		*/
		kind: 'moon.Checkbox',

		/**
		* @private
		* @lends moon.ToggleText.prototype
		*/
		published: {
			/**
			* Text label for the 'on' state
			*
			* @type {String}
			* @default moon.$L('on')
			* @public
			*/
			onContent: moon.$L('on'),   // i18n 'ON' label in moon.ToggleText widget

			/**
			* Text label for the 'off' state
			*
			* @type {String}
			* @default moon.$L('off')
			* @public
			*/
			offContent: moon.$L('off')  // i18n 'OFF' label in moon.ToggleText widget
		},

		/**
		* @private
		*/
		classes: 'moon-toggle-text',

		/**
		* @private
		*/
		components: [
			{name: 'label', classes: 'moon-toggle-text-text'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.checkedChanged();
		},

		/**
		* @private
		*/
		checkedChanged: function () {
			this.inherited(arguments);
			this.$.label.setContent(this.getChecked() ? this.onContent : this.offContent);
		}
	});

})(enyo, this);
