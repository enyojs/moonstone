require('moonstone');

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	ri = require('enyo/resolution'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	Popup = require('enyo/Popup');

var
	ilib = require('enyo-ilib');

/**
* The {@link module:enyo/StylesheetSupport~StylesheetSupport} {@glossary mixin} is used to add a
* "side-car" inline stylesheet to a [control]{@link module:enyo/Control~Control}, specifically
* for procedurally-generated CSS that can't live in the more appropriate
* location (i.e., in a CSS/LESS file).
*
* @module enyo/StylesheetSupport
* @public
*/
module.exports = {
	
	/**
	* @private
	*/
	name: 'moon.PopupSupport',

	published: {

		/**
		* CSS classes to apply to the popup label.
		*
		* @type {String}
		* @default 'moon-slider-popup-label'
		* @public
		*/
		popupLabelClasses: 'moon-large-button-text moon-slider-popup-label',

		/**
		* Color value of the popup.
		*
		* @type {String}
		* @default '#4d4d4d'
		* @public
		*/
		popupColor: '#4d4d4d',

		/**
		* When `false`, the slider's popup bubble is displayed while the slider is being
		* adjusted.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		noPopup: false,

		/**
		* When `true`, the popup displays a percentage value (rather than an absolute value).
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		showPercentage: true,

		/**
		* Popup width in pixels.
		*
		* @type {Number|String}
		* @default 'auto'
		* @public
		*/
		popupWidth: 'auto',

		/**
		* Popup height in pixels; value should be less than `72`.
		*
		* @type {Number|String}
		* @default 67
		* @public
		*/
		popupHeight: 67,

		/**
		* Popup offset in pixels.
		*
		* @type {Number}
		* @default 8
		* @public
		*/
		popupOffset: 8,

		/**
		* Custom popup content (ignored if `null`).
		*
		* @type {String|null}
		* @default null
		* @public
		*/
		popupContent: null,

		/**
		* When `true`, popup content will have locale-safe uppercasing applied.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		uppercase: true,

		/**
		* @deprecated Replaced by [uppercase]{@link module:moonstone/Slider~Slider#uppercase}.
		*
		* Formerly defaulted to `true`, now defaults to `null` and will only have
		* an effect when explicitly set (for complete backward compatibility).
		*
		* @type {Boolean}
		* @default null
		* @public
		*/
		popupContentUpperCase: null
	},

	/**
	* @private
	*/
	popupLeftCanvasWidth: 27, // Popup left canvas width in pixel

	/**
	* @private
	*/
	popupRightCanvasWidth: 27, // Popup right canvas width in pixel

	/**
	* @private
	*/
	popupComponents: [
		{name: 'popup', kind: Popup, classes: 'moon-slider-popup above', components: [
			{name: 'drawingLeft', kind: Control, tag: 'canvas', classes: 'moon-slider-popup-left'},
			{name: 'popupLabel', kind: Control, classes: 'moon-slider-popup-center' },
			{name: 'drawingRight', kind: Control, tag: 'canvas', classes: 'moon-slider-popup-right'}
		]}
	],


	/**
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this._nf = new ilib.NumFmt({type: 'percentage', useNative: false});
			// FIXME: Backwards-compatibility for deprecated property - can be removed when
			// the popupContentUpperCase property is fully deprecated and removed. The legacy
			// property takes precedence if it exists.
			if (this.popupContentUpperCase !== null) this.uppercase = this.popupContentUpperCase;
			if(this.knobClasses){
				this.createComponents(this.moreComponents, {owner: this});
				this.$.knob.createComponents(this.popupComponents, {owner: this});
				this.initValue(); 
				this.disabledChanged();
				this.knobClassesChanged();
				this.popupLabelClassesChanged();
				this.popupContentChanged();
				this.tapAreaClassesChanged();
				this.initSliderStyles();
				this.jumpIncrementChanged();
			}
			else if(this.popup === true){
				this.createComponents(this.popupComponents, {owner: this});
				this.$.popup.setAutoDismiss(false);
				this.$.popup.show();
				this.initProgress(); 
				this.popupLabelClassesChanged();
				this.popupContentChanged();
				this.initSliderStyles();
			}
		};
	}),

	/**
	* @private
	*/
	destroy: kind.inherit(function (sup) {
		return function () {
			delete this._nf;
			sup.apply(this, arguments);
		};
	}),

	rendered: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			if(this.$.popup){
				this.drawToCanvas(this.popupColor);
			}
		};
	}),

	/**
	* @private
	*/
	initSliderStyles: function () {
		this.updatePopupLabelColor();
		this.updatePopupHeight();
		this.updatePopupOffset();
		this.popupWidthChanged();
	},

	/**
	* @private
	*/
	popupLabelClassesChanged: function (was) {
		this.$.popupLabel.removeClass(was);
		this.$.popupLabel.addClass(this.popupLabelClasses);
	},

	/**
	* @private
	*/
	updatePopupOffset: function () {
		// console.log("updatePopupOffset:", this.getPopupHeight(), this.getPopupOffset(), ri.scale(this.getPopupHeight() + this.getPopupOffset() + 5));
		this.$.popup.applyStyle('top', dom.unit(-(ri.scale(this.getPopupHeight() + this.getPopupOffset() + 5)), 'rem'));
	},

	/**
	* Updates popup offset.
	*
	* @private
	*/
	popupOffsetChanged: function () {
		this.updatePopupOffset();
		this.drawToCanvas(this.popupColor);
	},

	/**
	* Updates popup width.
	*
	* @private
	*/
	popupWidthChanged: function () {
		if (this.popupWidth != 'auto') {
			this.$.popupLabel.applyStyle('width', dom.unit( this.getPopupWidth() - (this.popupLeftCanvasWidth + this.popupRightCanvasWidth) , 'rem'));
		}
	},

	/**
	* @private
	*/
	updatePopupHeight: function () {
		var h = this.getPopupHeight(),
			hRem = ri.scale(h);

		this.$.drawingLeft.setAttribute('height', hRem);
		this.$.drawingRight.setAttribute('height', hRem);
		this.$.popupLabel.applyStyle('height', dom.unit(ri.scale(h - 7), 'rem'));
		this.$.popup.applyStyle('height', dom.unit(ri.scale(h), 'rem'));
		this.$.popup.applyStyle('line-height', dom.unit(ri.scale(h - 6), 'rem'));
	},

	/**
	* Updates popup height.
	*
	* @private
	*/
	popupHeightChanged: function () {
		if (this.getPopupHeight() >= 72) {
			log.warn('This popupHeight API is designed for under 72 pixels.');
		}

		this.updatePopupHeight();
		this.popupOffsetChanged();
	},

	/**
	* @private
	*/
	updatePopupLabelColor: function () {
		this.$.popupLabel.applyStyle('background-color', this.popupColor);
	},

	/**
	* Updates popup color.
	*
	* @private
	*/
	popupColorChanged: function () {
		this.drawToCanvas(this.popupColor);
		this.updatePopupLabelColor();
	},

	/**
	* Updates popup content.
	*
	* @private
	*/
	popupContentChanged: function () {
		var content = this.getPopupContent();
		this._popupContent = this.get('uppercase') ? util.toUpperCase(content) : content;
		if (this._popupContent !== null) {
			this.$.popupLabel.setContent(this._popupContent);
		}
	},

	/**
	* @private
	*/
	uppercaseChanged: function () {
		// FIXME: Backwards-compatibility for deprecated property - can be removed when
		// popupContentUpperCase is fully deprecated and removed.
		if (this.popupContentUpperCase != this.uppercase) this.popupContentUpperCase = this.uppercase;
		this.popupContentChanged();
	},

	/**
	* @private
	*/
	popupContentUpperCaseChanged: function () {
		if (this.uppercase != this.popupContentUpperCase) this.uppercase = this.popupContentUpperCase;
		this.uppercaseChanged();
	},

	/**
	* @private
	*/
	updatePopupLabel: function (val) {
		var label = this._popupContent || this.calcPopupLabel(val);
		this.$.popupLabel.setContent(label);
	},

	/**
	* @private
	*/
	calcPopupLabel: function (val) {
		if (this.showPercentage) {
			val = this._nf.format(Math.round(val));
		}
		return val;
	},

		/**
	* @private
	*/
	drawToCanvas: function (bgColor) {
		bgColor = bgColor  || dom.getComputedStyleValue(this.$.knob.hasNode(), 'background-color');
		var h = ri.scale( this.getPopupHeight()+1 ), // height total
			hb = h - ri.scale(8), // height bubble
			hbc = (hb)/2, // height of bubble's center
			wre = ri.scale(26), // width's edge
			r = hbc, // radius is half the bubble height
			bcr = ri.scale(50), // bottom curve radius 50
			bcy = hb + bcr, //calculate the height of the center of the circle plus the radius to get the y coordinate of the circle to draw the bottom irregular arc
			lw = 1, // line width that will be tucked under the neighboring dom element's edge

			ctxLeft = this.$.drawingLeft.hasNode().getContext('2d'),
			ctxRight = this.$.drawingRight.hasNode().getContext('2d');

		this.$.drawingLeft.setAttribute('width', ri.scale( this.popupLeftCanvasWidth) );
		this.$.drawingRight.setAttribute('width', ri.scale( this.popupRightCanvasWidth) );

		// Set styles. Default color is knob's color
		ctxLeft.fillStyle = bgColor;
		// Draw shape with arrow on left
		ctxLeft.moveTo(0, h);
 		// arc(x, y, radius, startAngle, endAngle, counterClockwise);
		ctxLeft.arc(wre, bcy, bcr, 1.35 * Math.PI, 1.485 * Math.PI, false);
		ctxLeft.lineTo(wre, hb);
		ctxLeft.lineTo(wre, 0);
		ctxLeft.arcTo(0, 0, 0, hbc, r);
		ctxLeft.lineTo(0, h);
		ctxLeft.fill();
		// Add a spacer line
		ctxLeft.beginPath();
		ctxLeft.lineWidth = lw+1;
		ctxLeft.strokeStyle = bgColor;
		ctxLeft.moveTo(wre+lw, 0);
		ctxLeft.lineTo(wre+lw, hb);
		ctxLeft.stroke();

		// Set styles. Default color is knob's color
		ctxRight.fillStyle = bgColor;
		// Draw shape with arrow on right
		ctxRight.moveTo(lw, hb);
		ctxRight.arcTo(wre+lw, hb, wre+lw, hbc, r);

		ctxRight.arcTo(wre+lw, 0, lw, 0, r);
		ctxRight.lineTo(0, 0);
		ctxRight.fill();
		// Add a spacer line
		ctxRight.beginPath();
		ctxRight.lineWidth = lw+1;
		ctxRight.strokeStyle = bgColor;
		ctxRight.moveTo(0, 0);
		ctxRight.lineTo(0, hb);
		ctxRight.stroke();
	}
};
