/**
	_moon.DataGridList_ is an [enyo.DataGridList](#enyo.DataGridList) with
	Moonstone visual styling applied.
*/
enyo.kind({
	name: "moon.DataGridList",
	kind: "enyo.DataGridList",
	//* @protected
	mixins: ["moon.DataListSpotlightSupport"],
	noDefer: true,
	allowTransitions: false,
	spotlight: true,
	scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden" },
	handlers: {
		onSpotlightFocus : "spotlightFocus",
		onSpotlightBlur  : "spotlightBlur"
	},
	spotlightFocus: function(inSender, inEvent) {
		var zIndex = parseInt(enyo.dom.getComputedStyleValue(inEvent.originator.hasNode(), "z-index"), 10) || 0;
		inEvent.originator.applyStyle("z-index", zIndex + 1);
	},
	spotlightBlur: function(inSender, inEvent) {
		setTimeout(this.bindSafely(function() {
			inEvent.originator.applyStyle("z-index", null);
		}), 0);
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
		},
		reset: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				this.updateMetrics(list);
				list.refresh();
				list.$.scroller.scrollTo(0, 0, false);
			};
		}),
		updateBounds: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				var w = list.boundsCache.width,
					b = list.$.scroller.getScrollBounds(),
					v = list.$.scroller.$.strategy.$.vColumn;
				if (v && (list.$.scroller.getVertical() == "scroll" || (b.height > b.clientHeight))) {
					list.boundsCache.width = w-v.hasNode().offsetWidth;
				}
			};
		})
	}, true);
})(enyo, moon);
