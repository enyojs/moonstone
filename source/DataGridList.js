/**
	_moon.DataGridList_ is an <a href="#enyo.DataGridList">enyo.DataGridList</a> with
	Moonstone visual styling applied.
*/
enyo.kind({
	name: "moon.DataGridList",
	kind: "enyo.DataGridList",
	noDefer: true,
	allowTransitions: false,
	scrollerOptions: { kind: "moon.Scroller", vertical:"scroll" }
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
		reset: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				if (list.$.scroller.getVertical() != "scroll") {
					this.updateBounds(list);
					list.refresh();
				}
			};
		}),
		/**
			Attempts to scroll to the given index.
		*/
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
				c.bubble("onRequestScrollIntoView");
			} else {
				list.$.page1.index = p;
				list.$.page2.index = (p+1);
				this.refresh(list);
				enyo.asyncMethod(function () {
					list.scrollToIndex(i);
				})
			}
		},
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
