/**
	_moon.DataList_ is an <a href="#enyo.DataList">enyo.DataList</a> with
	Moonstone styling applied.  It uses <a href="#moon.Scroller">moon.Scroller</a>
	as its default scroller.
*/

enyo.kind({
	name     : "moon.DataList",
	kind     : "enyo.DataList",
	scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" },
	getWidth: function (n) {
		if (n) {
			return n && n.hasNode()? n.node.offsetWidth: 0;
		}
		// arbitrarily account for the scrollbar if it is present
		return this.hasNode()? this.node.offsetWidth - 50: 0;
	}
});