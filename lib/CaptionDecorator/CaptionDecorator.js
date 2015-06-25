require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/CaptionDecorator~CaptionDecorator} kind.
* @module moonstone/CaptionDecorator
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	utils = require('enyo/utils'),
	Control = require('enyo/Control');

/**
* {@link module:moonstone/CaptionDecorator~CaptionDecorator} wraps a control with a caption. The position of the
* caption is defined via the [side]{@link module:moonstone/CaptionDecorator~CaptionDecorator#side} property.
*
* ```
* 	{kind: 'moon.CaptionDecorator', side: 'top', content: 'Top Label', components: [
* 		{kind: 'moon.Button', content: 'My Button', ontap: 'buttonTapped'},
* 	]}
* ```
*
* @class CaptionDecorator
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/CaptionDecorator~CaptionDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'moon.CaptionDecorator',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocus: 'spotFocus',
		onSpotlightBlur:  'spotBlur'
	},

	/**
	* @private
	* @lends module:moonstone/CaptionDecorator~CaptionDecorator.prototype
	*/
	published: {

		/**
		* The position of the caption with respect to the wrapped control; valid
		* values are `'top'`, `'bottom'`, `'left'`, and `'right'`.
		*
		* @type {String}
		* @default 'top'
		* @public
		*/
		side: 'top',

		/**
		* If `true`, the caption is only shown when the wrapped control has Spotlight
		* focus; otherwise, it is always visible.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		showOnFocus: false
	},

	/**
	* @private
	*/
	captionPositioned: false,

	/**
	* @private
	*/
	clientBounds: null,

	/**
	* @private
	*/
	captionBounds: null,

	/**
	* @private
	*/
	decoratorBounds: null,

	/**
	* @private
	*/
	classes: 'moon-button-caption-decorator',

	/**
	* @private
	*/
	components: [
		{kind: Control, name: 'leftCaption',     classes: 'moon-divider-text moon-caption left',   canGenerate: false},
		{kind: Control, name: 'topCaption',      classes: 'moon-divider-text moon-caption top',    canGenerate: false},
		{kind: Control, name: 'client',          classes: 'moon-divider-text moon-caption-client'},
		{kind: Control, name: 'rightCaption',    classes: 'moon-divider-text moon-caption right',  canGenerate: false},
		{kind: Control, name: 'bottomCaption',   classes: 'moon-divider-text moon-caption bottom', canGenerate: false}
	],

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.sideChanged();
		this.showOnFocusChanged();
	},

	/**
	* If [showOnFocus]{@link module:moonstone/CaptionDecorator~CaptionDecorator#showOnFocus} is `true`, caption
	* position is reset on reflow.
	*
	* @private
	*/
	reflow: function () {
		Control.prototype.reflow.apply(this, arguments);

		if (this.getShowOnFocus()) {
			this.resetCaptionPosition();
		}
	},

	/**
	* Retrieves [side]{@link module:moonstone/CaptionDecorator~CaptionDecorator#side} value.
	*
	* @private
	*/
	getSide: function () {
		return this.side || 'top';
	},

	// Change handlers

	/**
	* @private
	*/
	sideChanged: function () {
		var side = this.getSide();

		this.$.topCaption.canGenerate =     (side === 'top');
		this.$.rightCaption.canGenerate =   (side === 'right');
		this.$.bottomCaption.canGenerate =  (side === 'bottom');
		this.$.leftCaption.canGenerate =    (side === 'left');

		// Update the content, including position if needed
		this.contentChanged();

		// If this control has already been rendered, re-render to update caption side
		if (this.hasNode()) {
			// Re-render to display caption on proper side
			this.render();
		}
	},

	/**
	* @private
	*/
	showOnFocusChanged: function () {
		this.addRemoveClass('showOnFocus', this.getShowOnFocus());

		// If `showOnFocus` is `true`, reset caption position
		if (this.hasNode() && this.getShowOnFocus()) {
			this.resetCaptionPosition();
		}
	},

	/**
	* @private
	*/
	contentChanged: function () {
		this.$[this.getSide()+'Caption'].setContent(this.getContent());

		// If `showOnFocus` is `true`, reset caption position
		if (this.hasNode() && this.getShowOnFocus()) {
			this.resetCaptionPosition();
		}
	},

	// Event handlers

	/**
	* Adds `spotlight` class when button is focused, and calculates caption position
	* if required.
	*
	* @private
	*/
	spotFocus: function () {
		this.addClass('spotlight');

		if (this.hasNode() && this.getShowOnFocus()) {
			this.positionCaption();
		}
	},

	/**
	* Removes `spotlight` class when button is blurred.
	*
	* @private
	*/
	spotBlur: function () {
		this.removeClass('spotlight');
	},

	// Caption positioning

	/**
	* Returns current caption control.
	*
	* @private
	*/
	getCaptionControl: function () {
		return this.$[this.getSide()+'Caption'];
	},

	/**
	* Resets cached position values and repositions caption if currently spotted.
	*
	* @private
	*/
	resetCaptionPosition: function () {
		this.resetCachedBounds();
		this.captionPositioned = false;

		if (this.hasNode() && this.hasClass('spotlight')) {
			this.positionCaption();
		}
	},

	/**
	* Positions caption based on the value of [side]{@link module:moonstone/CaptionDecorator~CaptionDecorator#side}.
	*
	* @private
	*/
	positionCaption: function () {
		if (this.captionPositioned) {
			return;
		}

		var bounds = this.getDecoratorBounds(),
			clientBounds = this.getClientBounds(),
			captionBounds = this.getCaptionBounds();

		switch (this.getSide()) {
		case 'left':
			this.centerCaptionVertically(bounds, captionBounds);
			this.positionCaptionAtLeftEdge(bounds, clientBounds, captionBounds);
			break;
		case 'right':
			this.centerCaptionVertically(bounds, captionBounds);
			this.positionCaptionAtRightEdge(bounds, clientBounds, captionBounds);
			break;
		case 'top':
			this.centerCaptionHorizontally(bounds, captionBounds);
			this.positionCaptionAtTopEdge(bounds, clientBounds, captionBounds);
			break;
		case 'bottom':
			this.centerCaptionHorizontally(bounds, captionBounds);
			this.positionCaptionAtBottomEdge(bounds, clientBounds, captionBounds);
			break;
		}

		this.captionPositioned = true;
	},

	/**
	* Centers caption control vertically, relative to `this.decoratorBounds.height`.
	*
	* @private
	*/
	centerCaptionVertically: function (inBounds, inCaptionBounds) {
		this.getCaptionControl().applyStyle('top', dom.unit((inBounds.height - inCaptionBounds.height) / 2, 'rem'));
	},

	/**
	* Centers caption control horizontally, relative to `this.decoratorBounds.width`.
	*
	* @private
	*/
	centerCaptionHorizontally: function (inBounds, inCaptionBounds) {
		this.getCaptionControl().applyStyle('left', dom.unit((inBounds.width - inCaptionBounds.width) / 2, 'rem'));
	},

	/**
	* Positions caption at left edge of `this.$.client`.
	*
	* @private
	*/
	positionCaptionAtLeftEdge: function (inBounds, inClientBounds, inCaptionBounds) {
		var position = (-1 * inCaptionBounds.width) + ((inBounds.width - inClientBounds.width)/2) - inCaptionBounds.marginRight;
		this.getCaptionControl().applyStyle('left', dom.unit(position, 'rem'));
	},

	/**
	* Positions caption at right edge of `this.$.client`.
	*
	* @private
	*/
	positionCaptionAtRightEdge: function (inBounds, inClientBounds, inCaptionBounds) {
		var position = inBounds.width - ((inBounds.width - inClientBounds.width)/2);
		this.getCaptionControl().applyStyle('left', dom.unit(position, 'rem'));
	},

	/**
	* Positions caption at top edge of `this.$.client`.
	*
	* @private
	*/
	positionCaptionAtTopEdge: function (inBounds, inClientBounds, inCaptionBounds) {
		var position = (-1 * this.getCaptionBounds().height) + ((inBounds.height - inClientBounds.height)/2) - inCaptionBounds.marginBottom;
		this.getCaptionControl().applyStyle('top', dom.unit(position, 'rem'));
	},

	/**
	* Positions caption at bottom edge of `this.$.client`.
	*
	* @private
	*/
	positionCaptionAtBottomEdge: function (inBounds, inClientBounds, inCaptionBounds) {
		var position = inBounds.height - ((inBounds.height - inClientBounds.height)/2);
		this.getCaptionControl().applyStyle('top', dom.unit(position, 'rem'));
	},

	/**
	* Caches result from `this.getBounds()` call, saving in `this.decoratorBounds`.
	*
	* @private
	*/
	getDecoratorBounds: function () {
		this.decoratorBounds = this.decoratorBounds || this.getBounds();
		return this.decoratorBounds;
	},

	/**
	* Caches caption bounds, saving in `this.captionBounds`.
	*
	* @private
	*/
	getCaptionBounds: function () {
		this.captionBounds = this.captionBounds || utils.mixin(this.getCaptionControl().getBounds(), this.getCaptionMarginBounds());
		return this.captionBounds;
	},

	/**
	* Caches client bounds, saving in `this.clientBounds`.
	*
	* @private
	*/
	getClientBounds: function () {
		this.clientBounds = this.clientBounds || this.$.client.getBounds();
		return this.clientBounds;
	},

	/**
	* Clears cached bounds.
	*
	* @private
	*/
	resetCachedBounds: function () {
		this.clientBounds = null;
		this.captionBounds = null;
		this.decoratorBounds = null;
	},

	/**
	* Returns margins of caption control.
	*
	* @private
	*/
	getCaptionMarginBounds: function () {
		var margins = dom.calcMarginExtents(this.getCaptionControl().hasNode());
		return {
			marginTop:      margins.top,
			marginRight:    margins.right,
			marginBottom:   margins.bottom,
			marginLeft:     margins.left
		};
	}
});
