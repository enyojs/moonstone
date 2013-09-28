/**
	_moon.DataList_ is an <a href="#enyo.DataList">enyo.DataList</a> with
	Moonstone styling applied.  It uses <a href="#moon.Scroller">moon.Scroller</a>
	as its default scroller.
*/
enyo.kind({
	name: "moon.DataList",
	kind: "enyo.DataList",
	noDefer: true,
	scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" }
});
//*@protected
/**
	Overload the delegate strategy to incorporate measurements for our scrollers
	when they are visible.
*/
moon.DataList.delegates.vertical = enyo.clone(moon.DataList.delegates.vertical);
enyo.kind.extendMethods(moon.DataList.delegates.vertical, {
	reset: enyo.inherit(function (sup) {
		return function (list) {
			sup.apply(this, arguments);
			this.updateBounds(list);
			this.refresh(list);
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
