require('moonstone');

var
	dom = require('enyo/dom'),
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

/**
* Limits the display of {@link enyo.Control#content} to {@link moon.ClampedText#maxLines}
*
* ```
* {kind: ClampedText, content: 'some rather long content', maxLines: 3}
* ```
*
* @class moon.ClampedText
* @ui
* @module moonstone/ClampedText
* @public
*/
module.exports = kind(
	/** @lends moon.ClampedText.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ClampedText',
	
	/**
	* @private
	*/
	kind: Control,
	
	/**
	* @private
	*/
	classes: 'moon-clamped-text',

	/**
	* Maximum number of lines of content to show in collapsed state.
	*
	* @type {Number}
	* @default 3
	* @public
	*/
	maxLines: 3,

	/**
	* Determines if the text is clamped to `maxLines`. Setting 'always' will skip calculating if
	* the content can be clamped
	*
	* @type {Boolean|String}
	* @default true
	* @public
	*/
	clamped: true,

	/**
	* Read-only property indicating if the content length exceeds the `maxLines` to be
	* displayed. Only calculated if `clamped` is not 'always'.
	*
	* @type {Boolean|null}
	* @default null
	* @public
	*/
	canCollapse: null,

	/**
	* @private
	*/
	observers: [
		{method: 'clampPropertyChanged', path: ['content', 'maxLines', 'clamped']}
	],

	/**
	* Observer for content, maxLines, and clamped
	*
	* @private
	*/
	clampPropertyChanged: function (was, is, prop) {
		if (this.canCollapse !== null || this.calcCanCollapse()) {
			this.clamp();
		}
	},

	/**
	* @private
	*/
	calcContentHeight: function () {
		var node = this.hasNode();
		if (!this.contentHeight) {
			this.clamp(false);
			this.contentHeight = node.getBoundingClientRect().height;
		}
		return this.contentHeight;
	},

	/**
	* @private
	*/
	calcLineHeight: function () {
		var node = this.hasNode(),
			lineHeight;
		if (!this.lineHeight) {
			this.lineHeight = parseInt(dom.getComputedStyleValue(this.hasNode(), 'line-height'), 10) || null;
		}
		return this.lineHeight;
	},

	/**
	* @private
	*/
	calcMaxHeight: function () {
		var lineHeight = this.calcLineHeight();
		return this.maxLines * lineHeight;
	},

	/**
	* @private
	*/
	calcCanCollapse: function () {
		if (this.hasNode()) {
			var contentHeight = this.calcContentHeight(),
				maxHeight = this.calcMaxHeight();
			this.set('canCollapse', contentHeight > maxHeight);
			return this.canCollapse;
		}
	},

	/**
	* @param {Boolean} force - Explicitly applies or removes line clamping style
	* @private
	*/
	clamp: function (force) {
		var clamp;
		if (this.clamped == 'always') {
			clamp = true;
		} else if (force === true || force === false) {
			clamp = force;
		} else {
			this.calcCanCollapse();
			clamp = this.clamped && this.canCollapse;
		}
		this.applyStyle('-webkit-line-clamp', clamp ? this.maxLines : null);
	},

	/**
	* @private
	*/
	rendered: function() {
		Control.prototype.rendered.apply(this, arguments);
		this.clampPropertyChanged();
	},

	/**
	* @private
	*/
	handleResize: function () {
		this.clampPropertyChanged();
	}
});