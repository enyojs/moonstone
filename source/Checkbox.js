(function (enyo, scope) {
	/**
	* `moon.Checkbox` is a box that, when clicked, shows or hides a checkmark and
	* fires an {@link enyo.Checkbox#event:onChange} event. It derives from {@link enyo.Checkbox} and
	* is designed to be used with {@link moon.CheckboxItem}.
	*
	* @class moon.Checkbox
	* @extends enyo.Checkbox
	* @ui
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
		* @lends moon.Checkbox.prototype
		*/
		published: {
			/**
			* When locked is `true`, cannot change the value of the `checked` property
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			locked: false,

			/**
			* Customize the appearance of the checkbox with an icon name.  Consult {@link moon.Icon}
			* for valid values
			*
			* @type {String}
			* @default 'check'
			* @public
			*/
			icon: 'check',

			/**
			* Customize the appearance of the checkbox with an image asset.
			*
			* @type {String}
			* @default ''
			* @public
			*/
			src: ''
		},

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
		* @private
		*/
		components: [
			{name: 'checkboxIcon', kind: 'moon.Icon', icon: 'check'}
		],

		/**
		* @private
		*/
		rendered: function () {
			this.iconChanged();
			this.srcChanged();
		},

		/**
		* @fires enyo.Checkbox#onChange
		* @private
		*/
		tap: function (inSender, e) {
			if (!this.disabled && !this.locked) {
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
		},

		/**
		* @private
		*/
		iconChanged: function() {
			this.$.checkboxIcon.setIcon(this.icon);
		},

		/**
		* @private
		*/
		srcChanged: function() {
			this.$.checkboxIcon.setSrc(this.src);
		}

	});

})(enyo, this);
