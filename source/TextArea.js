(function (enyo, scope) {
	/**
	* `moon.TextArea` is a Moonstone-styled TextArea control, derived from
	* [`enyo.TextArea`]{@link enyo.TextArea}. Typically, a `moon.TextArea` is placed inside
	* a [`moon.InputDecorator`]{@link moon.InputDecorator}, which provides styling, e.g.:
	*
	* ```
	* {kind: 'moon.InputDecorator', components: [
	*	{kind: 'moon.TextArea', onchange: 'inputChange'}
	* ]}
	* ```
	*
	* For more information, see the documentation on
	* [Text Fields]{@link building-apps/controls/text-fields.html} in the Enyo Developer Guide.
	*
	* @class moon.TextArea
	* @extends enyo.TextArea
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  moon.TextArea.prototype */ {

		/**
		* @private
		*/
		name: 'moon.TextArea',

		/**
		* @private
		*/
		kind: 'enyo.TextArea',

		/**
		* @private
		*/
		classes: 'moon-textarea',

		/**
		* @private
		*/
		spotlightIgnoredKeys: [13, 16777221],	// 13==Enter, 16777221==KeypadEnter

		/**
		* @private
		*/
		handlers: {
			onblur: 'blurred'
		},

		/**
		* Set the focus on the textarea
		*
		* @public
		*/
		focus: function () {
			this.inherited(arguments);
			var node = this.hasNode();
			// We move the cursor to the end, because in 5-way
			// mode there is no way (other than backspacing) for
			// the user to move the caret within the text field
			node.selectionStart = this.value.length;
			node.scrollTop = node.scrollHeight;
		},

		/**
		* Remove focus from textarea
		*
		* @public
		*/
		blur: function () {
			if (this.hasNode()) {
				this.node.blur();
			}
		},

		/**
		* @private
		*/
		blurred: function () {
			this.hasNode().scrollTop = 0;
		},

		/**
		* @private
		*/
		left: function (inEvent) {
			if (!this.hasNode() || this.node.selectionStart === 0) {
				return false;
			}
			return true;
		},

		/**
		* @private
		*/
		right: function (inEvent) {
			if (!this.hasNode() || this.node.selectionStart == this.node.value.length) {
				return false;
			}
			return true;
		},

		/**
		* @private
		*/
		up: function (inEvent) {
			return this.left(inEvent);
		},

		/**
		* @private
		*/
		down: function (inEvent) {
			return this.right(inEvent);
		}
	});

})(enyo, this);
