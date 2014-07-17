(function (enyo, scope) {
	/**
	* _moon.Input_ is a Moonstone-styled input control, derived from
	* [enyo.Input]{@link enyo.Input}. Typically, a {@link moon.Input} is placed inside a
	* [moon.InputDecorator]{@link moon.InputDecorator}, which provides styling, e.g.:
	*
	* ```
	* {kind: 'moon.InputDecorator', components: [
	* 	{kind: 'moon.Input', placeholder: 'Enter some text...', onchange: 'inputChange'}
	* ]}
	* ```
	*
	* For more information, see the documentation on [Text
	* Fields](building-apps/controls/text-fields.html) in the Enyo Developer Guide.
	*
	* @ui
	* @class moon.Input
	* @extends enyo.Input
	* @public
	*/

	enyo.kind(
		/** @lends moon.Input.prototype */ {

	 	/**
	 	* @private
	 	*/
		name: 'moon.Input',

 		/**
 		* @private
 		*/
		kind: 'enyo.Input',

 		/**
 		* @private
 		*/
		classes: 'moon-input',

 		/**
		* 13==Enter, 16777221==KeypadEnter
		*
 		* @private
 		*/
		spotlightIgnoredKeys: [13, 16777221],

 		/**
 		* @private
 		*/
		published: /** @lends moon.Input.prototype */ {

			/**
			* When true, blur on Enter keypress (if focused)
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			dismissOnEnter: false
		},

 		/**
 		* @private
 		*/
		handlers: {
			onkeypress : 'onKeyUp',
			onblur     : 'onBlur',
			onfocus    : 'onFocus'
		},

 		/**
		* Used only for dismissOnEnter feature, cannot rely on hasFocus in this case because of
		* racing condition
		*
 		* @private
 		*/
		_bFocused: false,

		/**
 		* @private
 		*/
		onFocus: function () {
			if (this.dismissOnEnter) {
				var oThis = this;
				enyo.asyncMethod(this, function () {oThis._bFocused = true;});
			}
		},

 		/**
 		* @private
 		*/
		onBlur: function () {
			if (this.dismissOnEnter) {
				this._bFocused = false;
			}
		},

 		/**
 		* @private
 		*/
		onKeyUp: function (oSender, oEvent) {
			if (this.dismissOnEnter) {
				if (oEvent.keyCode == 13) {
					if (this._bFocused) {
						this.blur();
					}
				}
			}
		},

 		/**
 		* @private
 		*/
		blur: function () {
			if (this.hasNode()) {
				this.node.blur();
			}
		},

 		/**
 		* @private
 		*/
		left: function () {
			if (!this.hasNode() || this.node.selectionStart === 0) {
				return false;
			}
			return true;
		},

 		/**
 		* @private
 		*/
		right: function () {
			if (!this.hasNode() || this.node.selectionStart == this.node.value.length) {
				return false;
			}
			return true;
		},

 		/**
 		* @private
 		*/
		up: function () {
			return false;
		},

 		/**
 		* @private
 		*/
		down: function () {
			return false;
		}
	});

})(enyo, this);

