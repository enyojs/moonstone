/**
	_moon.DataGridList_ is an <a href="#enyo.DataGridList">enyo.DataGridList</a> with
	Moonstone visual styling applied.
*/
enyo.kind({
	name: "moon.DataGridList",
	kind: "enyo.DataGridList",
	noDefer: true,
	scrollerOptions: { kind: "moon.Scroller" }
});
//*@protected
/**
	Overload the delegate strategy to incorporate measurements for our scrollers
	when they are visible.
*/
(function (enyo, moon) {
	var p = moon.DataGridList.delegates.verticalGrid = enyo.clone(enyo.DataGridList.delegates.verticalGrid);
	enyo.kind.extendMethods(p, {
		reset: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				this.updateMetrics(list);
				this.refresh(list);
			};
		}),
		updateBounds: enyo.inherit(function (sup) {
			return function (list) {
				sup.apply(this, arguments);
				if (list.$.scroller.$.strategy.showVertical()) {
					var w = list.boundsCache.width,
						n = list.$.scroller.$.strategy.$.vColumn.hasNode();
					list.boundsCache.width = w-n.offsetWidth;
				}
			};
		})
	}, true);
})(enyo, moon);
