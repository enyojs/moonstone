enyo.kind({
	name: "moon.ScrollThumb",
	kind: "enyo.ScrollThumb",
	published: {
		sizeRatio: 1
	},
	update: function(inStrategy) {
		if (this.showing) {
			var d = this.dimension, o = this.offset;
			var bd = this.scrollBounds[this.sizeDimension], sbd = this.scrollBounds[d];
			var overs = 0, overp = 0, over = 0;
			var ratio = this.getSizeRatio();
			
			if (bd >= sbd) {
				this.hide();
				return;
			}
			if (inStrategy.isOverscrolling()) {
				over = inStrategy.getOverScrollBounds()["over" + o];
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
					if(!this.transform) {
						//adjust top/left for browsers that don't support translations
						if(this.axis=="v") {
							this.setBounds({top:p + "px"});
						} else {
							this.setBounds({left:p + "px"});
						}
					} else {
						enyo.dom.transformValue(this, this.translation, p + "px");
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
});