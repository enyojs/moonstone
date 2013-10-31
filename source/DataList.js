/**
	_moon.DataList_ is an <a href="#enyo.DataList">enyo.DataList</a> with
	Moonstone styling applied.  It uses <a href="#moon.Scroller">moon.Scroller</a>
	as its default scroller.
*/
enyo.kind({
	name: "moon.DataList",
	kind: "enyo.DataList",
	noDefer: true,
	allowTransitions: false,
	scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" }
});
//*@protected
/**
	Overload the delegate strategy to incorporate measurements for our scrollers
	when they are visible.
*/
moon.DataList.delegates.vertical = enyo.clone(moon.DataList.delegates.vertical);
enyo.kind.extendMethods(moon.DataList.delegates.vertical, {
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
			list.$.scroller.scrollToControl(c, true);
		} else {
			// we do this to ensure we trigger the paging event when necessary
			this.resetToPosition(list, this.pagePosition(list, p));
			// now retry the original logic until we have this right
			enyo.asyncMethod(function () {
				list.scrollToIndex(i);
			});
		}
	},
	reset: enyo.inherit(function (sup) {
		return function (list) {
			sup.apply(this, arguments);
			this.updateBounds(list);
			list.refresh();
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
