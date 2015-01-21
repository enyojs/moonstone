(function (enyo, scope) {
	/**
	* {@link moon.Checkbox} is a box that, when tapped, shows or hides a checkmark
	* and fires an [onChange]{@link enyo.Checkbox#onChange} event. It derives from
	* {@link enyo.Checkbox} and is designed to be used with {@link moon.CheckboxItem}.
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
			* If `true`, the `checked` property cannot be changed through user input.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			locked: false,

			/**
			* Name of a font-based icon to use when displaying the checkbox. Consult
			* {@link moon.Icon} for valid values.
			*
			* @type {String}
			* @default 'check'
			* @public
			*/
			icon: 'check',

			/**
			* Optional path to an image asset. May be used to customize checkbox appearance.
			*
			* @type {String|moon.ri.selectSrc~src}
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
		rendered: enyo.inherit(function (sup) {
			return function() {
				sup.apply(this, arguments);
				this.srcChanged();
				this.iconChanged();
			};
		}),
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
			this.$.checkboxIcon.setSrc(moon.ri.selectSrc(this.src));
		}

	});

})(enyo, this);
