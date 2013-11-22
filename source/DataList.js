/**
	_moon.DataList_ is an [enyo.DataList](#enyo.DataList) with Moonstone styling
	applied.  It uses [moon.Scroller](#moon.Scroller) as its default scroller.
*/
enyo.kind({
	name: "moon.DataList",
	kind: "enyo.DataList",
	//* @protected
	noDefer: true,
	allowTransitions: false,
	spotlight: true,
	scrollerOptions: { kind: "moon.Scroller", horizontal: "hidden" },
	didRender: function () {
		var spot = enyo.Spotlight.getCurrent();
		if (spot === this || spot.isDescendentOf(this)) {
			this.spotlight = false;
			enyo.Spotlight.spot(this);
		}
	}
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
				// first see if the child is already available to scroll to
			var c = this.childForIndex(list, i),
				// but we also need the page so we can find its position
				p = this.pageForIndex(list, i),
				d = this;
			// if there is no page then the index is bad
			if (p < 0 || p > this.pageCount(list)) { return; }
			// if there isn't one, then we know we need to go ahead and
			// update, otherwise we should be able to use the scroller's
			// own methods to find it
			if (c) {
				list.$.scroller.scrollToControl(c, true);
			} else {
				// list.$.scroller.resizing = true;
				var x, y, fn;
				
				fn = function (sender, event, props) {
					if (i >= props.start && i <= props.end) {
						var c = d.childForIndex(list, i);
						if (c) {
							list.removeListener("paging", fn);
							list.$.scroller.scrollToControl(c, true);
						}
					}
				};
				
				list.addListener("paging", fn);
				
				if (list.orientation == "vertical") {
					x = 0;
					y = this.pagePosition(list, p); 
				} else {
					x = this.pagePosition(list, p);
					y = 0;
				}
				
				list.$.scroller.scrollTo(x, y);
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
