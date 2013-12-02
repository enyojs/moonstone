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
		this.spotlight = false;
		if (spot && (spot === this || spot.isDescendantOf(this))) {
			enyo.Spotlight.spot(this);
		}
	},
	didScroll: enyo.inherit(function (sup) {
		return function () {
			var spot;
			if (enyo.Spotlight.getPointerMode() &&
				((spot = enyo.Spotlight.getCurrent()) && (spot === this || spot.isDescendantOf(this)))) {
				enyo.Spotlight.unspot();
			}
			return sup.apply(this, arguments);
		};
	})
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
