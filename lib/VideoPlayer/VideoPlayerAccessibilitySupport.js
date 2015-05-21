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
			this.$.jumpBack.set('accessibilityLabel', $L('jumpBack'));
			this.$.rewind.set('accessibilityLabel', $L('rewind'));
			this.$.fastForward.set('accessibilityLabel', $L('fastForward'));
			this.$.jumpForward.set('accessibilityLabel', $L('jumpForward'));
			this.$.moreButton.set('accessibilityLabel', $L('more'));
		};
	}),

	/**
	* @private
	*/
	updatePlayPauseButtons: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			if (this._isPlaying) {
				this.$.fsPlayPause.set('accessibilityLabel', $L('pause'));
				this.$.ilPlayPause.set('accessibilityLabel', $L('pause'));
			} else {
				this.$.fsPlayPause.set('accessibilityLabel', $L('play'));
				this.$.ilPlayPause.set('accessibilityLabel', $L('play'));
			}
		};
	}),

	/**
	* @private
	*/
	moreButtonTapped: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			var index = this.$.controlsContainer.getIndex();
			if (index === 0) {
				this.$.moreButton.set('accessibilityLabel', $L('more'));
			} else {
				this.$.moreButton.set('accessibilityLabel', $L('less'));
			}
		};
	})

};