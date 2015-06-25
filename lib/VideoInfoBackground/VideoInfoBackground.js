require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/VideoInfoBackground~VideoInfoBackground} kind.
* @module moonstone/VideoInfoBackground
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

/**
* {@link module:moonstone/VideoInfoBackground~VideoInfoBackground} is a [control]{@link module:enyo/Control~Control} that provides a
* stylized background for [components]{@link module:enyo/Component~Component} placed in the
* [infoComponents]{@link module:moonstone/VideoPlayer~VideoPlayer#infoComponents} block of a {@link module:moonstone/VideoPlayer~VideoPlayer}.
* It is designed as a decorator, wrapping the components inside with the stylized background.
* 
* Use the [orient]{@link module:moonstone/VideoInfoBackground~VideoInfoBackground#orient} property to set the orientation 
* (`'left'` or `'right'`).
* 
* For more details, see {@link module:moonstone/VideoPlayer~VideoPlayer}.
*
* @class VideoInfoBackground
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/VideoInfoBackground~VideoInfoBackground.prototype */ {

	/**
	* @private
	*/
	name: 'moon.VideoInfoBackground',

	/**
	* @private
	*/
	kind: Control,
	
	/**
	* @private
	*/
	classes: 'moon-background-wrapper',
	
	/**
	* @private
	* @lends module:moonstone/VideoInfoBackground~VideoInfoBackground.prototype
	*/
	published: {
		
		/** 
		* Orientation of the control; valid values are `'left'` and `'right'`.
		*
		* @type {String}
		* @default 'left'
		* @public
		*/
		orient: 'left',

		/**
		* When `true`, background color is set to black; otherwise, background is transparent.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		background: true
	},
	
	/**
	* @private
	*/
	components: [
		{name: 'client', kind: Control, classes: 'moon-background-wrapper-client-content'}
	],

	/**
	* @private
	*/
	initComponents: function() {
		Control.prototype.initComponents.apply(this, arguments);
		this.orientChanged();
		this.backgroundChanged();
	},

	/**
	* @private
	*/
	orientChanged: function() {
		this.$.client.addRemoveClass('right', this.orient != 'left');
		this.$.client.addRemoveClass('left', this.orient == 'left');
	},

	/**
	* @private
	*/
	backgroundChanged: function() {
		this.$.client.addRemoveClass('bg', this.background);
	}
});
