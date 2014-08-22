(function (enyo, scope) {
	/**
	* `moon.Scrim` provides an overlay that will prevent taps from propagating to the controls
	* that it covers. A scrim may be 'floating' or 'non-floating'. A floating scrim will fill
	* the entire viewport, while a non-floating scrim will be constrained by the dimensions of
	* its container.
	*
	* The scrim should have a CSS class of `moon-scrim-transparent`, `moon-scrim-translucent`,
	* or any other class that has `pointer-events: auto` in its style properties.
	*
	* You may specify the z-index at which you want the scrim to appear by passing an integer
	* value to [`showAtZIndex()`]{@link moon.Scrim#showAtZIndex}; if you do so, you must call
	* [`hideAtZIndex()`]{@link moon.Scrim#hideAtZIndex} with the same value to hide the scrim.
	*
	* @class moon.Scrim
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  moon.Scrim.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Scrim',

		/**
		* @private
		*/
		kind: 'enyo.Control',

		/**
		* Current visibility state of the scrim
		*
		* @type {Boolean}
		* @private
		*/
		showing: false,

		/**
		* @private
		*/
		classes: 'moon-scrim enyo-fit',

		/**
		* If `true`, the scrim is rendered in a floating layer outside of other controls. This can
		* be used to guarantee that the scrim will be shown on top of other controls.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		floating: false,

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.zStack = [];
			if (this.floating) {
				this.setParent(enyo.floatingLayer);
			}
		},

		/**
		* @private
		*/
		showingChanged: function () {
			// auto render when shown.
			if (this.floating && this.showing && !this.hasNode()) {
				this.render();
			}
			this.inherited(arguments);
			//this.addRemoveClass(this.showingClassName, this.showing);
		},

		/**
		* @private
		*/
		addZIndex: function (zIndex) {
			if (enyo.indexOf(zIndex, this.zStack) < 0) {
				this.zStack.push(zIndex);
			}
		},

		/**
		* @private
		*/
		removeZIndex: function (inControl) {
			enyo.remove(inControl, this.zStack);
		},

		/**
		* Shows scrim at the specified z-index. Note that if you use `moon.showAtZIndex()`, you
		* must call [`hideAtZIndex()`]{@link moon.Scrim#hideAtZIndex} to properly unwind the
		* z-index stack.
		*
		* @param  {Number} zIndex - z-index of the scrim
		* @public
		*/
		showAtZIndex: function (zIndex) {
			this.addZIndex(zIndex);
			if (zIndex !== undefined) {
				this.setZIndex(zIndex);
			}
			this.show();
		},

		/**
		* Hides scrim at the specified z-index.
		*
		* @param  {Number} zIndex - z-index of the scrim
		* @public
		*/
		hideAtZIndex: function (zIndex) {
			this.removeZIndex(zIndex);
			if (!this.zStack.length) {
				this.hide();
			} else {
				var z = this.zStack[this.zStack.length-1];
				this.setZIndex(z);
			}
		},

		/**
		* Sets scrim to show at passed-in z-index.
		*
		* @private
		*/
		setZIndex: function (zIndex) {
			this.zIndex = zIndex;
			this.applyStyle('z-index', zIndex);
		},

		/**
		* @private
		*/
		make: function () {
			return this;
		}
	});

	/**
	 // Scrim singleton exposing a subset of Scrim API; it is replaced with a proper [enyo.Scrim]{@link enyo.Scrim} instance.
	*
	* @class moon.scrimSingleton
	* @private
	*/
	enyo.kind({

		/**
		* @private
		*/
		name: 'moon.scrimSingleton',

		/**
		* @private
		*/
		kind: null,

		/**
		* @private
		*/
		constructor: function (inName, inProps) {
			this.instanceName = inName;
			enyo.setPath(this.instanceName, this);
			this.props = inProps || {};
		},

		/**
		* @private
		*/
		make: function () {
			var s = new moon.Scrim(this.props);
			enyo.setPath(this.instanceName, s);
			return s;
		},

		/**
		* @private
		*/
		showAtZIndex: function (zIndex) {
			var s = this.make();
			s.showAtZIndex(zIndex);
		},
		// in case somebody does this out of order

		/**
		* @private
		*/
		hideAtZIndex: enyo.nop,

		/**
		* @private
		*/
		show: function () {
			var s = this.make();
			s.show();
		}
	});

	new moon.scrimSingleton('moon.scrim', {floating: true, classes: 'moon-scrim-translucent'});
	new moon.scrimSingleton('moon.scrimTransparent', {floating: true, classes: 'moon-scrim-transparent'});

})(enyo, this);
