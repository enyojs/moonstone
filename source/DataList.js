/**
	_moon.DataList_ is an <a href="#enyo.DataList">enyo.DataList</a> with Moonstone
	styling applied. The color of the list may be customized by specifying a
	background color.
*/

enyo.kind({
	name     : "moon.DataList",
	kind     : "enyo.DataList",
	scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" }
});