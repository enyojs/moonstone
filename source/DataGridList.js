/**
	_moon.DataGridList_ is an <a href="#enyo.DataGridList">enyo.DataGridList</a> with
	Moonstone visual styling applied.
*/
enyo.kind({
	name: "moon.DataGridList",
	kind: "enyo.DataGridList",
	noDefer: true,
	allowTransitions: false,
	scrollerOptions: { kind: "moon.Scroller", vertical:"scroll" },
	handlers: {
		onSpotlightSelect	: "spotHandler",
		onSpotlightLeft	: "spotHandler",
		onSpotlightRight	: "spotHandler",
		onSpotlightUp	: "spotHandler",
		onSpotlightDown	: "spotHandler"
	},
	spotHandler: function(oSender, oEvent) {
		if (this.$.scroller.getStrategy().isScrolling()) {
			enyo.Signals.send("onListKeydown", oEvent);
			return true;
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
})(enyo, moon);
