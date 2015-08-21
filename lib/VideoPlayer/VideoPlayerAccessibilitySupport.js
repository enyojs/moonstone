var
	kind = require('enyo/kind');

/**
* @name VideoPlayerAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	hideFSBottomControls: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			if (this.$.videoInfoHeaderClient.get('showing')) {
				this.$.videoInfoHeaderClient.set('accessibilityDisabled', true);
			}
		};
	})
};