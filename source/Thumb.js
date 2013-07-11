enyo.kind({
	name: "moon.ScrollThumb",
	kind: "enyo.ScrollThumb",
	published: {
		sizeRatio: 1
	},
	classes: "matrix3dsurface",
	
	create: function() {
		this.inherited(arguments);
		var v = this.axis == "v";
		this.dimension = v ? "height" : "width";
		this.offset = v ? "top" : "left";
		this.transform = enyo.dom.canTransform();
		this.accel = enyo.dom.canAccelerate();
		this.translation = this.accel ? "matrix3d" : "matrix";
		this.positionMethod = v ? "getScrollTop" : "getScrollLeft";
		this.sizeDimension = v ? "clientHeight" : "clientWidth";
		this.addClass("enyo-" + this.axis + "thumb");
	},
	update: function(inStrategy) {
		if (this.showing && this.scrollBounds) {
			var d = this.dimension;
			var bd = this.scrollBounds[this.sizeDimension], sbd = this.scrollBounds[d];
			var overs = 0, overp = 0, over = 0;
			var ratio = this.getSizeRatio();
			if (bd >= sbd) {
				this.hide();
				return;
			}
			if (inStrategy.isOverscrolling()) {
				over = inStrategy.getOverScrollBounds()["over" + this.offset];
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
			
			// apply thumb styling
			this.needed = s < bd;
			if (this.needed && this.hasNode()) {
				if (this._pos !== p) {
					this._pos = p;
					if (!this.transform) {
						//adjust top/left for browsers that don't support translations
						if(this.axis=="v") {
							this.setBounds({top:p + "px"});
						} else {
							this.setBounds({left:p + "px"});
						}
					} else {
						var matrix = this.generateMatrix(p);
						enyo.dom.transformValue(this, this.translation, matrix);
					}
				}
				if (this._size !== s) {
					this._size = s;
					this.node.style[d] = this.domStyles[d] = s + "px";
				}
			} else {
				this.hide();
			}
		}
	},
	generateMatrix: function(inPosition) {
		var x = 0, y = 0;
		
		if (this.axis === "v") {
			y = inPosition;
		} else {
			x = inPosition;
		}
		
		return (this.accel)
			? 	"1, 	    0, 	   0,  0, " +
				"0, 	    1, 	   0,  0, " + 
				"0, 	    0, 	   1,  0, " +
				 x + ", " + y + ", 1,  1"
			
			: 	"1, 0, 0, 1, " + x + ", " + y
		;
	},

	//* Override show to give fade effect
	show: function() {
		this.cancelDelayHide();
		this.removeClass("hidden");
	},
	//* Override show to give fade effect
	hide: function() {
		this.addClass("hidden");
	}
});