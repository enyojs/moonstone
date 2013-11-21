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
	scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden" }
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
				
				x = 0;
				y = this.pagePosition(list, p); 
				
				list.$.scroller.scrollTo(x, y);
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
