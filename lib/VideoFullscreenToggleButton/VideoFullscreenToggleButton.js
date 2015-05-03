require('moonstone');

var
	kind = require('enyo/kind');

var
	IconButton = require('../IconButton');

/**
* {@link moon.VideoFullscreenToggleButton} is a specialized {@link moon.IconButton};
* when placed inside a {@link moon.VideoPlayer}, the button may be tapped to toggle
* the video player's fullscreen state.
*
* @class moon.VideoFullscreenToggleButton
* @extends moon.IconButton
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.VideoFullscreenToggleButton */ {

	/**
	* @private
	*/
	name: 'moon.VideoFullscreenToggleButton',

	/**
	* @private
	*/
	kind: IconButton,
	
	/**
	* @private
	*/
	icon : 'exitfullscreen',

	/**
	* @private
	*/
	small: false,

	/**
	* @private
	*/
	classes : 'moon-icon-video-round-controls-style moon-icon-exitfullscreen-font-style',
	
	/**
	* @private
	*/
	events: {
		/**
		* {@link moon.VideoPlayer#onRequestToggleFullscreen}
		*/
		onRequestToggleFullscreen:''
	},
	
	/**
	* @private
	*/
	handlers: {
		/**
		* @fires moon.VideoPlayer#onRequestToggleFullscreen
		*/
		ontap: 'doRequestToggleFullscreen'
	}
});