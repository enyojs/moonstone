require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Tooltip~Tooltip} kind.
* @module moonstone/Tooltip
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	Popup = require('enyo/Popup'),
	Component = require('enyo/Component'),
	Signals = require('enyo/Signals'),
	ri = require('enyo/resolution');

var pointerTemplate = '<path d="M0,5C0,3,1,0,3,0H0V5Z"/>';

// To prevent lingering tooltips, we're monitoring spotlight changes and tooltip display
// to ensure that only 1 tooltip is active.
// see BHV-14524, ENYO-247
var observer = new Component({

	/**
	* Last active tooltip
	* @private
	*/
	active: null,

	/**
	* @private
	*/
	components: [
		{kind: Signals, onSpotlightCurrentChanged: 'spotChanged'}
	],

	/**
	* @private
	*/
	activeChanged: function (was) {
		if(was) {
			was.waterfall('onRequestHideTooltip');
		}
	},

	/**
	* @private
	*/
	spotChanged: function (sender, event) {
		this.set('active', null);
	}
});

/**
* Provides uppercasing and checks text directionality for controls within a
* {@link module:moonstone/Tooltip~Tooltip}.
*
* @class TooltipContent
* @extends module:enyo/Control~Control
* @ui
* @public
*/
var TooltipContent = kind({
	/**
	* @private
	*/
	name: 'moon.TooltipContent',

	/**
	* @private
	*/
	kind: Control,

	/**
	* When `true`, the content will have locale-safe uppercasing applied.
	*
	* @type {Boolean}
	* @default true
	* @public
	*/
	uppercase: true,

	/**
	* @private
	*/
	create: function () {
		this._content = this.content;
		Control.prototype.create.apply(this, arguments);
	},

	/**
	* @private
	*/
	contentChanged: function (was, is) {
		if (arguments.length) this._content = is;
		this.content = this.uppercase ? util.toUpperCase(this._content) : this._content;
		Control.prototype.contentChanged.apply(this, arguments);
		this.detectTextDirectionality();
	},

	/**
	* @private
	*/
	uppercaseChanged: function (was, is) {
		this.contentChanged();
	}
});

/**
* {@link module:moonstone/Tooltip~Tooltip} is a popup that works in conjunction
* with {@link module:moonstone/TooltipDecorator~TooltipDecorator}. The tooltip
* is automatically displayed when the user hovers over the decorator for a given
* period of time. The tooltip is positioned around the decorator where there is
* available window space.
*
* ```javascript
* 	var
* 		kind = require('enyo/kind'),
* 		Button = require('moonstone/Button'),
* 		Tooltip = require('moonstone/Tooltip'),
* 		TooltipDecorator = require('moonstone/TooltipDecorator');
*
* 	{kind: TooltipDecorator, components: [
* 		{kind: Button, content: 'Tooltip'},
* 		{kind: Tooltip, content: 'I am a tooltip for a button.'}
* 	]}
* ```
*
* You may force the tooltip to appear by calling its
* [show()]{@link module:enyo/Control~Control#show} method.
*
* @class Tooltip
* @extends module:enyo/Popup~Popup
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Tooltip~Tooltip.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Tooltip',

	/**
	* @private
	*/
	kind: Popup,

	/**
	* @private
	*/
	defaultKind: TooltipContent,

	/**
	* @private
	*/
	classes: 'moon-tooltip below left-arrow',

	/**
	* @private
	* @lends module:moonstone/Tooltip~Tooltip.prototype
	*/
	published: {
		/**
		* This value overrides the default value of
		* [autoDismiss]{@link module:enyo/Popup~Popup#autoDismiss} inherited from
		* {@link module:enyo/Popup~Popup}.
		* If `true`, the tooltip will hide when the user taps outside of it or presses
		* ESC. Note that this property only affects behavior when the tooltip is used
		* independently, not when it is used with
		* [TooltipDecorator]{@link module:moonstone/TooltipDecorator~TooltipDecorator}.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		autoDismiss: false,

		/**
		* This value overrides the default value of
		* [floating]{@link module:enyo/Popup~Popup#floating} inherited from
		* {@link module:enyo/Popup~Popup}.
		* If 'false', the tooltip will not be rendered in a
		* [floating layer]{@link module:enyo/Control/floatingLayer~FloatingLayer} and can be ocluded
		* by other controls. Otherwise if `true`, the tooltip will be shown on top of other controls.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		floating: true,

		/**
		* Hovering over the decorator for this length of time (in milliseconds) causes the
		* tooltip to appear.
		*
		* @type {Number}
		* @default 500
		* @public
		*/
		showDelay: 500,

		/**
		* Position of the tooltip with respect to the activating control. Valid values are
		* `'above'`, `'below'`, `'left top'`, `'left bottom'`, `'right top'`, `'right bottom'`, and
		* `'auto'`. The values starting with `'left`' and `'right'` place the tooltip on the side
		* (sideways tooltip) with two additional positions available, `'top'` and `'bottom'`, which
		* places the tooltip content toward the top or bottom, with the tooltip pointer
		* middle-aligned to the activator.
		*
		* Note: The sideways tooltip does not automatically switch sides if it gets too close or
		* overlaps with the window bounds, as this may cause undesirable layout implications,
		* covering your other controls.
		*
		* @type {String}
		* @default 'auto'
		* @public
		*/
		position: 'auto',

		/**
		* Default `margin-left` value.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		defaultLeft: 0,

		/**
		* When `true`, the content will have locale-safe uppercasing applied.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		uppercase: true,

		/**
		* @deprecated Replaced by [uppercase]{@link module:moonstone/Tooltip~Tooltip#uppercase}.
		*
		* Formerly defaulted to `true`, now defaults to `null` and will only have
		* an effect when explicitly set (for complete backward compatibility).
		*
		* @type {Boolean}
		* @default null
		* @public
		*/
		contentUpperCase: null
	},

	/**
	* @private
	*/
	captureEvents: false,

	/**
	* @private
	*/
	handlers: {
		onRequestShowTooltip: 'requestShow',
		onRequestHideTooltip: 'requestHide'
	},

	/**
	* @private
	*/
	tools: [
		{name: 'point', kind: Control, classes: 'moon-tooltip-point', tag: 'svg', attributes: {viewBox: '0 0 3 5'}, allowHtml: true, content: pointerTemplate},
		{name: 'client', kind: Control, classes: 'moon-tooltip-label moon-header-font'}
	],

	/**
	* @private
	*/
	initComponents: function () {
		this.createChrome(this.tools);
		Popup.prototype.initComponents.apply(this, arguments);
	},

	/**
	* @private
	*/
	create: function () {
		Popup.prototype.create.apply(this, arguments);

		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// the contentUpperCase property is fully deprecated and removed. The legacy
		// property takes precedence if it exists.
		if (this.contentUpperCase !== null) this.uppercase = this.contentUpperCase;

		this.contentChanged();
	},

	/**
	* @private
	*/
	contentChanged: function () {
		this.detectTextDirectionality();
		var content = this.getContent();
		this.$.client.setContent( this.get('uppercase') ? util.toUpperCase(content) : content);
	},

	/**
	* @private
	*/
	uppercaseChanged: function () {
		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// contentUpperCase is fully deprecated and removed.
		if (this.contentUpperCase != this.uppercase) this.contentUpperCase = this.uppercase;
		this.contentChanged();
	},

	/**
	* @private
	*/
	contentUpperCaseChanged: function () {
		if (this.uppercase != this.contentUpperCase) this.uppercase = this.contentUpperCase;
		this.uppercaseChanged();
	},

	/**
	* @private
	*/
	positionChanged:function () {
		this.adjustPosition(true);
	},

	/**
	* @private
	*/
	requestShow: function (inSender, inEvent) {
		observer.set('active', this);
		this.activator = inEvent.originator;
		this.startJob('showJob', 'show', this.showDelay);
		return true;
	},

	/**
	* @private
	*/
	cancelShow: function () {
		this.stopJob('showJob');
	},

	/**
	* @private
	*/
	requestHide: function () {
		this.cancelShow();
		return Popup.prototype.requestHide.apply(this, arguments);
	},

	/**
	* @private
	*/
	showingChanged: function () {
		this.cancelShow();
		Popup.prototype.showingChanged.apply(this, arguments);
	},

	/**
	* @private
	*/
	applyPosition: function (inRect) {
		var s = '';
		for (var n in inRect) {
			s += (n + ':' + inRect[n] + (isNaN(inRect[n]) ? '; ' : 'px; '));
		}
		this.addStyles(s);
	},

	/**
	* @private
	*/
	adjustPosition: function (belowActivator) {
		if (this.showing && this.hasNode()) {
			var b = this.node.getBoundingClientRect(),
				moonDefaultPadding = ri.scale(18),
				defaultMargin = ri.scale(21),
				floating = this.get('floating'),
				acNode = this.activator.hasNode(),
				pBounds = this.parent.getAbsoluteBounds(),
				acBounds = this.activator.getAbsoluteBounds(),
				acBorders;

			//* Calculate the difference between decorator and activating
			//* control's top, left, right differences, position tooltip against
			//* the activating control instead of the decorator accordingly.
			var paTopDiff = pBounds.top - acBounds.top,
				paLeftDiff =  acBounds.left - pBounds.left,
				paRightDiff = pBounds.left + pBounds.width - acBounds.left - acBounds.width,
				acRight = window.innerWidth - moonDefaultPadding - acBounds.left - acBounds.width,
				rtl = this.parent.rtl,	// Must check the parent because the text may have been auto-flipped due to content's direction
				anchorLeft, anchorSide, offset;

			if (this.position == 'auto') this.position = 'above';	// Choose a rational default

			// Restore to generic state
			this.removeClass('above');
			this.removeClass('below');
			this.removeClass('top');
			this.removeClass('bottom');
			this.removeClass('left-arrow');
			this.removeClass('right-arrow');

			if (rtl) {
				anchorLeft = pBounds.left + pBounds.width / 2 - moonDefaultPadding < b.width;
			} else {
				//* When there is not enough room on the left, using right-arrow for the tooltip
				anchorLeft = window.innerWidth - moonDefaultPadding - pBounds.left - pBounds.width / 2 >= b.width;
			}

			if (floating) {
				offset = acRight + moonDefaultPadding;
			} else {
				offset = paRightDiff;
				// we need to account for activator border widths if we are not floating
				acBorders = dom.calcBoxExtents(acNode, 'border');
			}

			//* Check if have a compound position, 2 words:
			if (this.position && this.position.indexOf(' ') >= 0) {
				anchorSide = true;
				var positions = this.position.split(' '),
					lr = positions[0],	// This should be either 'left' or 'right'
					tb = positions[1],	// This should be either 'top' or 'bottom'
					relTop = 0,
					relLeft = 0;

				this.addClass(tb);

				// Calculate the absolute top coordinate
				relTop = (acBounds.height / 2);
				if (tb == 'top') {
					// We're below, alter the absTop value as necessary
					relTop -= b.height;
				}

				// detrmine the side, and if RTL, just do the opposite.
				if ((lr == 'left' && !rtl) || (lr == 'right' && rtl)) {
					this.addClass('right-arrow');
					relLeft = -(b.width + defaultMargin + (floating ? 0 : acBorders.left));
				} else if ((lr == 'right' && !rtl) || (lr == 'left' && rtl)) {
					this.addClass('left-arrow');
					relLeft = acNode.clientWidth + defaultMargin + (floating ? acBounds.width - acNode.clientWidth : acBorders.right);
				}

				if (floating) {
					// Absolute (floating) measurements are based on the relative positions
					// Adjusting as needed.
					relTop = acBounds.top + relTop;
					relLeft = acBounds.left + relLeft;
				}

				this.applyPosition({'top': dom.unit(relTop, 'rem'), 'left': dom.unit(relLeft, 'rem'), 'right': 'auto'});

			} else {
				//* When there is not enough room in the bottom, move it above the
				//* decorator; when the tooltip bottom is within window height but
				//* set programmatically above, move it above
				if ((window.innerHeight - moonDefaultPadding) - (pBounds.top + pBounds.height) < b.height + defaultMargin || (this.position == 'above')) {
					this.addClass('above');
					if (floating) {
						this.applyPosition({'top': dom.unit((acBounds.top - b.height - defaultMargin),'rem'), 'left': dom.unit(acBounds.left + acBounds.width / 2, 'rem'), 'right': 'auto'});
					} else {
						this.applyPosition({'top': dom.unit(-(b.height + defaultMargin + paTopDiff + acBorders.top), 'rem'), 'left': dom.unit(acBounds.width / 2 + paLeftDiff, 'rem'), 'right': 'auto'});
					}
				}

				//* When there is not enough space above the parent container, move
				//* it below the decorator; when there is enough space above the
				//* parent container but is set programmatically, leave it below
				if (pBounds.top < (b.height + defaultMargin) || (this.position == 'below') || this.hasClass('below')) {
					this.removeClass('above');	// Above class may have been added in the `if` check above, then need to be removed because the tooltip didn't fit on the screen.
					this.addClass('below');
					if (floating) {
						this.applyPosition({'top': dom.unit(acBounds.top + acBounds.height + defaultMargin, 'rem'), 'left': dom.unit(acBounds.left + acBounds.width / 2, 'rem'), 'right': 'auto'});
					} else {
						this.applyPosition({'top': dom.unit(this.parent.node.clientHeight + defaultMargin + paTopDiff + acBorders.bottom, 'rem'), 'left': dom.unit(acBounds.width / 2 + paLeftDiff, 'rem'), 'right': 'auto'});
					}
				}

				if (anchorLeft) {
					this.addClass('left-arrow');
				} else {
					this.addClass('right-arrow');
					this.applyPosition({'margin-left': dom.unit(- b.width, 'rem'), 'left': 'auto'});
					this.applyStyle('right', dom.unit(acBounds.width / 2 + offset, 'rem'));
				}
			}
		}
	},

	/**
	* @private
	*/
	handleResize: function () {
		this.applyPosition({'margin-left': this.defaultLeft, 'bottom': 'auto'});
		this.adjustPosition(true);
		Popup.prototype.handleResize.apply(this, arguments);
	},

	// Accessibility

	/**
	* When `true`, the contents of the popup will be read when shown.
	*
	* @default true
	* @type {Boolean}
	* @public
	*/
	accessibilityReadAll: true,

	/**
	* @private
	*/
	accessibilityLive: 'off',

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['accessibilityReadAll', 'accessibilityRole', 'showing'], method: function () {
			this.startJob('alert', function () {
				this.setAriaAttribute('role', this.accessibilityReadAll && this.showing ? 'alert' : this.accessibilityRole);
			}, 100);
		}}
	]
});

module.exports.Content = TooltipContent;
