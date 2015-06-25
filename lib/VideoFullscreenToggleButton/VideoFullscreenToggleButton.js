require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/VideoFullscreenToggleButton~VideoFullscreenToggleButton} kind.
* @module moonstone/VideoFullscreenToggleButton
*/

var
	kind = require('enyo/kind');

var
	IconButton = require('../IconButton');

/**
* {@link module:moonstone/VideoFullscreenToggleButton~VideoFullscreenToggleButton} is a specialized {@link module:moonstone/IconButton~IconButton};
* when placed inside a {@link module:moonstone/VideoPlayer~VideoPlayer}, the button may be tapped to toggle
* the video player's fullscreen state.
*
* @class VideoFullscreenToggleButton
* @extends module:moonstone/IconButton~IconButton
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/VideoFullscreenToggleButton~VideoFullscreenToggleButton */ {

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
		* {@link module:moonstone/VideoPlayer~VideoPlayer#onRequestToggleFullscreen}
		*/
		onRequestToggleFullscreen:''
	},
	
	/**
	* @private
	*/
	handlers: {
		/**
		* @fires module:moonstone/VideoPlayer~VideoPlayer#onRequestToggleFullscreen
		*/
		ontap: 'doRequestToggleFullscreen'
	}
});
