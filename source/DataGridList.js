/**
	_moon.DataGridList_ is an [enyo.DataGridList](#enyo.DataGridList) with
	Moonstone visual styling applied.
*/
enyo.kind({
	name: "moon.DataGridList",
	kind: "enyo.DataGridList",
	//* @protected
	noDefer: true,
	allowTransitions: false,
	spotlight: true,
	scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden" },
	didRender: function () {
		var spot = enyo.Spotlight.getCurrent();
		this.spotlight = false;
		if (spot && (spot === this || spot.isDescendantOf(this))) {
			enyo.Spotlight.spot(this);
		}
	}
});
//*@protected
/**
	Overload the delegate strategy to incorporate measurements for our scrollers
	when they are visible.
*/
(function (enyo, moon) {
	var p = moon.DataGridList.delegates.verticalGrid = enyo.clone(enyo.DataGridList.delegates.verticalGrid);
	enyo.kind.extendMethods(p, {
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
				// doing this seems to trigger placement of the pages correctly
				// in a few cases where synchronously scrolling the scroller
				// wouldn't identify for the list when it needed to page
				this.didScroll(list, {scrollBounds: list.$.scroller.getScrollBounds()});
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
		},
		reset: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				this.updateMetrics(list);
				list.refresh();
				list.$.scroller.scrollTo(0, 0);
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
})(enyo, moon);
