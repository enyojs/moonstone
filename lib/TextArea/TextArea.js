require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/TextArea~TextArea} kind.
* @module moonstone/TextArea
*/

var
	kind = require('enyo/kind'),
	TextArea = require('enyo/TextArea');

/**
* {@link module:moonstone/TextArea~TextArea} is a Moonstone-styled text input field, derived from
* {@link module:enyo/TextArea~TextArea}. Typically, a `moon.TextArea` is placed inside
* a {@link module:moonstone/InputDecorator~InputDecorator}, which provides styling, e.g.:
*
* ```
* var InputDecorator = require('moonstone/InputDecorator'),
*     TextArea = require('moonstone/TextArea');
*
* {kind: InputDecorator, components: [
*	{kind: TextArea, onchange: 'inputChange'}
* ]}
* ```
*
* For more information, see the documentation on
* [Text Fields]{@linkplain $dev-guide/building-apps/controls/text-fields.html}
* in the Enyo Developer Guide.
*
* @class TextArea
* @extends module:enyo/TextArea~TextArea
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/TextArea~TextArea.prototype */ {

	/**
	* @private
	*/
	name: 'moon.TextArea',

	/**
	* @private
	*/
	kind: TextArea,

	/**
	* @private
	*/
	classes: 'moon-body-text moon-textarea',

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
	* Sets the focus on the TextArea.
	*
	* @public
	*/
	focus: function () {
		TextArea.prototype.focus.apply(this, arguments);
		var node = this.hasNode();
		// We move the cursor to the end, because in 5-way
		// mode there is no way (other than backspacing) for
		// the user to move the caret within the text field
		node.selectionStart = this.value.length;
		node.scrollTop = node.scrollHeight;
	},

	/**
	* Removes focus from the TextArea.
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
