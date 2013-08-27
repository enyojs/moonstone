/**
	_moon.DataGridList_ is an <a href="#enyo.DataGridList">enyo.DataGridList</a> with
	Moonstone visual styling applied.
*/
enyo.kind({
	name: "moon.DataGridList",
	kind: "enyo.DataGridList",
	scrollerOptions: {
		kind: "moon.Scroller"
	},
	getWidth: function (n) {
		if (n) {
			return n && n.hasNode()? n.node.offsetWidth: 0;
		}
		// arbitrarily account for the scrollbar if it is present
		return this.hasNode()? this.node.offsetWidth - 50: 0;
	}
});