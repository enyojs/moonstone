(function (enyo, scope) {
	/**
	* `moon.RichText` is a Moonstone-styled RichText control, derived from
	* [`enyo.RichText`]{@link enyo.RichText}).  Typically, a `moon.RichText` is placed inside a
	* [`moon.InputDecorator`]{@link moon.InputDecorator}, which provides styling, e.g.:
	*
	* ```
	* {kind: 'moon.InputDecorator', components: [
	*	{kind: 'moon.RichText', style: 'width: 240px;', onchange: 'inputChange'}
	* ]}
	* ```
	*
	* For more information, see the documentation on
	* [Text Fields]{@link building-apps/controls/text-fields.html} in the Enyo Developer Guide.
	*
	* @class moon.RichText
	* @extends enyo.RichText
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.RichText.prototype */ {

		/**
		* @private
		*/
		name: 'moon.RichText',

		/**
		* @private
		*/
		kind: 'enyo.RichText',

		/**
		* @private
		*/
		classes: 'moon-richtext',

		/**
		* @private
		*/
		handlers: {
			onblur: 'blurred'
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.disabledChanged();
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
			this.moveCursorToEnd();
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
		disabledChanged: function () {
			this.inherited(arguments);
			if (this.disabled) {
				this.attributes.contenteditable = false;
			}
		},

		/**
		* @private
		*/
		left: function () {
			var sel = this.getSelection();
			if (sel.rangeCount) {
				var selRange = sel.getRangeAt(0);
				var testRange = selRange.cloneRange();

				testRange.selectNodeContents(this.node);
				testRange.setEnd(selRange.startContainer, selRange.startOffset);

				if (testRange.toString() === '') {
					return false;
				}
			}
			return true;
		},

		/**
		* @private
		*/
		right: function () {
			var sel = this.getSelection();
			if (sel.rangeCount) {
				var selRange = sel.getRangeAt(0);
				var testRange = selRange.cloneRange();

				testRange.selectNodeContents(this.node);
				testRange.setStart(selRange.endContainer, selRange.endOffset);

				if (testRange.toString() === '') {
					return false;
				}
			}
			return true;
		},

		/**
		* @private
		*/
		up: function (inEvent) {
			return this.left();
		},

		/**
		* @private
		*/
		down: function (inEvent) {
			return this.right();
		}
	});

})(enyo, this);
