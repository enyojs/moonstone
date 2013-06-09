/**
	_moon.DataList_ is an <a href="#enyo.DataList">enyo.DataList</a> with Moonstone
	styling applied and has moon.Scroller as it's defalut scroller.
*/

enyo.kind({
	name     : "moon.DataList",
	kind     : "enyo.DataList",
	scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" }
});