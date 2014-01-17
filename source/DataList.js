//* @protected
/**
	_moon.DataListSpotlightSupport_ a mixin that provides spotlight handling code for use by 
	_moon.DataList_ and _moon.DataGridList_.  Since those each extend from their respective
	enyo counterparts, this mixin provides common add-on code needed for proper spotlight handling.
*/
moon.DataListSpotlightSupport = {
	didRender: function () {
		// Since we delay rendering (potentially spottable) children by default, spotlight on the list is
		// true by default; once we render, we check if the list was focused and if so, transfer
		// focus to the first spottable child inside
		var spot = enyo.Spotlight.getCurrent();
		this.spotlight = false;
		if (spot && (spot === this || spot.isDescendantOf(this))) {
			enyo.Spotlight.spot(this);
		}
	},
	didScroll: enyo.inherit(function (sup) {
		return function () {
			// When scrolling in pointer mode, we unspot the last focused child, to prevent it from
			// looping as new pages come up
			var spot;
			if (enyo.Spotlight.getPointerMode() &&
				((spot = enyo.Spotlight.getCurrent()) && (spot === this || spot.isDescendantOf(this)))) {
				enyo.Spotlight.unspot();
				this._unspotSinceSpot = true;
			}
			return sup.apply(this, arguments);
		};
	}),
	previewDomEvent: function(inEvent) {
		// When spotlight is being applied back to the list after being unspotted, check that the child being 
		// focused is visible and if not, spot the first visible child that is
		if ((inEvent.type == "onSpotlightFocus") && this._unspotSinceSpot) {
			if (enyo.Spotlight.getPointerMode()) {
				this._unspotSinceSpot = false;
			} else {
				var target = inEvent.originator;
				if (target != this) {
					// Calculate the target bounds, relative to the scrollBounds
					var tb = target.getBounds();
					var p = target.isDescendantOf(this.$.page1) ? this.$.page1 : this.$.page2;
					var pb = p.getBounds();
					// Need to add page offset to target bounds
					tb.top += pb.top;
					tb.left += pb.left;
					var sb = this.$.scroller.getScrollBounds();
					// Check if target is inside the current scrollBounds
					if ((tb.top < sb.top) || 
						(tb.left < sb.left) || 
						((tb.top + tb.height) > (sb.top + sb.clientHeight)) || 
						((tb.left + tb.width) > (sb.left + sb.clientWidth))) {
						// Not in view, so find and spot the first visible child
						var vc = this.getFirstVisibleChild(sb);
						if (vc) {
							this._unspotSinceSpot = false;
							enyo.Spotlight.spot(vc);
						}
						return true;
					} else {
						this._unspotSinceSpot = false;
					}
				}
			}
		}
	},
	getFirstVisibleChild: function(inScrollBounds) {
		// Loop through the pages in top-down order
		var pages = (this.$.page1.index < this.$.page2.index) ? 
			[this.$.page1, this.$.page2] : 
			[this.$.page2, this.$.page1];
		for (var p in pages) {
			var page = pages[p];
			var pb = page.getBounds();
			// Loop through children in each pange top-down
			for (var i=0; i<page.children.length; i++) {
				var c = page.children[i];
				var cb = c.getBounds();
				// Need to add page offset to target bounds
				cb.top += pb.top;
				cb.left += pb.left;
				// Return the first spottable child whose top/left are inside the viewport
				if ((cb.top >= inScrollBounds.top) && (cb.left >= inScrollBounds.left)) {
					if (enyo.Spotlight.isSpottable(c)) {
						return c;
					}
					c = enyo.Spotlight.getFirstChild(c);
					if (c) {
						return c;
					}
				}
			}
		}
		return null;
	}
};

//* @public

/**
	_moon.DataList_ is an [enyo.DataList](#enyo.DataList) with Moonstone styling
	applied.  It uses [moon.Scroller](#moon.Scroller) as its default scroller.
*/
enyo.kind({
	name: "moon.DataList",
	kind: "enyo.DataList",
	//* @protected
	mixins: ["moon.DataListSpotlightSupport"],
	noDefer: true,
	allowTransitions: false,
	spotlight: true,
	scrollerOptions: { kind: "moon.Scroller", horizontal: "hidden" }
});
//* @protected
/**
	Overload the delegate strategy to incorporate measurements for our scrollers
	when they are visible.
*/
(function (enyo, moon) {
	moon.DataList.delegates.vertical   = enyo.clone(moon.DataList.delegates.vertical);
	moon.DataList.delegates.horizontal = enyo.clone(moon.DataList.delegates.horizontal);
	var exts = {
		refresh: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				list.$.scroller.resized();
			};
		}),
		scrollToIndex: function (list, i) {
			// This function recurses, so make sure we are scrolling to a valid index, 
			// otherwise childForIndex will never return a control
			if ((i < 0) || (i >= list.collection.length)) {
				return;
			}
				// first see if the child is already available to scroll to
			var c = this.childForIndex(list, i),
				// but we also need the page so we can find its position
				p = this.pageForIndex(list, i);
			// if there is no page then the index is bad
			if (p < 0 || p > this.pageCount(list)) { return; }
			// if there isn't one, then we know we need to go ahead and
			// update, otherwise we should be able to use the scroller's
			// own methods to find it
			if (c) {
				// force a synchronous scroll to the control so it won't dupe and
				// re-animate over positions it has already crossed
				list.$.scroller.scrollToControl(c, false, false);
			} else {
				var idx = list.$.page1.index;
				
				// attempting to line them up in a useful order
				// given the direction from where our current index is
				if (idx < p) {
					list.$.page1.index = p - 1;
					list.$.page2.index = p;
				} else {
					list.$.page1.index = p;
					list.$.page2.index = p + 1;
				}
				list.refresh();
								
				this.scrollToIndex(list, i);
			}
		}
	};
	enyo.kind.extendMethods(moon.DataList.delegates.vertical, exts, true);
	enyo.kind.extendMethods(moon.DataList.delegates.vertical, {
		reset: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				if (list.$.scroller.getVertical() != "scroll") {
					this.updateBounds(list);
					list.refresh();
				}
			};
		}),
		updateBounds: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				var w = list.boundsCache.width,
					b = list.$.scroller.getScrollBounds(),
					n = list.$.scroller.$.strategy.$.vColumn.hasNode();
				if (list.$.scroller.getVertical() == "scroll" || (b.height > b.clientHeight)) {
					list.boundsCache.width = w-n.offsetWidth;
				}
			};
		})
	}, true);
	enyo.kind.extendMethods(moon.DataList.delegates.horizontal, exts, true);
	enyo.kind.extendMethods(moon.DataList.delegates.horizontal, {
		reset: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				if (list.$.scroller.getHorizontal() != "scroll") {
					this.updateBounds(list);
					list.refresh();
				}
				list.$.scroller.scrollTo(0, 0);
			};
		}),
		updateBounds: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				var w = list.boundsCache.height,
					b = list.$.scroller.getScrollBounds(),
					n = list.$.scroller.$.strategy.$.hColumn.hasNode();
				if (list.$.scroller.getVertical() == "scroll" || (b.width > b.clientWidth)) {
					list.boundsCache.height = w-n.offsetHeight;
				}
			};
		})
	}, true);
})(enyo, moon);
