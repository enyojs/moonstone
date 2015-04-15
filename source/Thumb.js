(function (enyo, scope) {
	/**
	* {@link moon.ScrollThumb}, which extends {@link enyo.ScrollThumb}, is
	* used to display a small visual scroll indicator.
	*
	* `moon.ScrollThumb` is not typically created in application code.
	*
	* @class moon.ScrollThumb
	* @extends enyo.ScrollThumb
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  moon.ScrollThumb.prototype */ {
	
		/**
		* @private
		*/
		name: 'moon.ScrollThumb',

		/**
		* @private
		*/
		kind: 'enyo.ScrollThumb',

		/**
		* @private
		* @lends moon.ScrollThumb.prototype
		*/
		published: {
			/**
			* Ratio of size and position of thumb with respect to scroll bounds.
			*
			* @type {Number}
			* @default 1
			* @public
			*/
			sizeRatio: 1
		},

		/**
		* @private
		*/
		classes: 'moon-thumb matrix3dsurface',

		/**
		* @private
		*/
		minSize: 40,

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			var v = this.axis == 'v';
			this.offset = v ? 'top' : 'left';
			this.transform = enyo.dom.canTransform();
			this.accel = enyo.dom.canAccelerate();
			this.translation = this.accel ? 'matrix3d' : 'matrix';
			this.positionMethod = v ? 'getScrollTop' : 'getScrollLeft';
			this.sizeDimension = v ? 'clientHeight' : 'clientWidth';
			this.addClass('enyo-' + this.axis + 'thumb');
		},

		/**
		* @private
		*/
		update: function (inStrategy) {
			if (this.showing && this.scrollBounds) {
				var d = this.dimension;
				var bd = this.scrollBounds[this.sizeDimension], sbd = this.scrollBounds[d];
				var overs = 0, overp = 0, over = 0;
				var ratio = this.getSizeRatio();
				if (bd > sbd) {
					this.hide();
					return;
				}
				if (inStrategy.isOverscrolling()) {
					over = inStrategy.getOverScrollBounds()['over' + this.offset];
					overs = Math.abs(over);
					overp = Math.max(over, 0);
				}
				var sbo = inStrategy[this.positionMethod]() - over;
				// calc size & position
				var bdc = bd - this.cornerSize;
				var s = Math.floor((bd * bd / sbd) - overs);
				s = Math.max(this.minSize, s);
				var p = Math.floor((bdc * sbo / sbd) + overp);
				p = Math.max(0, Math.min(bdc - this.minSize, p));
	
				p *= ratio;
				s *= ratio;
	
				// apply thumb styling if needed
				this.needed = s < bd;
				if (this.needed && this.hasNode()) {
					enyo.dom.transformValue(this, this.translation, this.generateMatrix(p, s));
				} else {
					this.hide();
				}
			}
		},

		/**
		* @private
		*/
		generateMatrix: function (inPosition, inSize) {
			var x, y, w, h, node = this.hasNode();
	
			if (!node) {
				x = 0;
				y = 0;
				w = 1;
				h = 1;
			}
			else if (this.axis === 'v') {
				x = 0;
				y = inPosition;
				w = 1;
				h = inSize/node.offsetHeight;
			}
			else {
				x = inPosition;
				y = 0;
				w = inSize/node.offsetWidth;
				h = 1;
			}
	
			return (this.accel) ? this.assemble3dMatrix(x, y, w, h) : this.assemle2dMatrix(x, y, w, h);
		},

		/**
		* @private
		*/
		assemle2dMatrix: function (inX, inY, inWidth, inHeight) {
			return inWidth + ', 0, 0, ' + inHeight + ', ' + inX + ', ' + inY;
		},

		/**
		* @private
		*/
		assemble3dMatrix: function (inX, inY, inWidth, inHeight) {
			return inWidth + ', 0, 0, 0, 0, ' + inHeight + ', 0, 0, 0, 0, 1, 0, ' + inX + ', ' + inY + ', 1, 1';
		},

		/**
		* Override `show()` to give fade effect.
		* 
		* @private
		*/
		show: function () {
			this.cancelDelayHide();
			this.removeClass('hidden');
		},

		/**
		* Hides the control.
		*
		* @private
		*/
		hide: function () {
			this.addClass('hidden');
		}
	});

})(enyo, this);
