require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');
/**
* {@link moon.BodyText} is a simple control for displaying body text in an app.
* It is designed to align with other text-based controls.
*
* @class moon.BodyText
* @extends enyo.Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.BodyText.prototype */ {

	/**
	* @private
	*/
	name: 'moon.BodyText',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-body-text moon-body-text-spacing moon-body-text-control',

	/**
	*
	* When `true`, HTML tags are allowed in the control's content.
	*
	* @type {Boolean}
	* @default true
	* @public
	*/
	allowHtml: true,

	/**
	* @private
	* @lends moon.BodyText.prototype
	*/
	published: {

		/**
		* If `true`, text content is centered; otherwise, it is left-aligned.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		centered: false
	},

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.centeredChanged();
	},

	/**
	* @private
	*/
	contentChanged: function () {
		Control.prototype.contentChanged.apply(this, arguments);
		this.detectTextDirectionality();
		if (this.hasNode()) { this.bubble('onRequestSetupBounds'); }
	},

	/**
	* @private
	*/
	centeredChanged: function () {
		this.applyStyle('text-align', this.centered ? 'center' : null);
	}
});
