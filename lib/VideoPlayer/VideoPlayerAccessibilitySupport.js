var
	kind = require('enyo/kind');

var
	$L = require('../i18n');

/**
* @name VideoPlayerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.$.jumpBack.set('accessibilityLabel', $L('Previous'));
			this.$.rewind.set('accessibilityLabel', $L('Rewind'));
			this.$.fastForward.set('accessibilityLabel', $L('Fast Forward'));
			this.$.jumpForward.set('accessibilityLabel', $L('Next'));
			this.$.moreButton.set('accessibilityLabel', $L('More'));
		};
	}),

	/**
	* @private
	*/
	updatePlayPauseButtons: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			var label = this._isPlaying ? $L('Pause') : $L('Play');
			this.$.fsPlayPause.set('accessibilityLabel', label);
			this.$.ilPlayPause.set('accessibilityLabel', label);
		};
	}),

	/**
	* @private
	*/
	moreButtonTapped: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			var index = this.$.controlsContainer.getIndex();
			var label = index === 0 ? $L('More') : $L('Back');
			this.$.moreButton.set('accessibilityLabel', label);
		};
	})

};