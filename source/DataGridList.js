/**
	_moon.DataGridList_ is an <a href="#enyo.DataGridList">enyo.DataGridList</a> 
	with Moonstone styling applied. The color of the list may be customized 
	by specifying a background color.
*/

enyo.kind({
	name            : "moon.DataGridList",
	kind            : "enyo.DataGridList",
	scrollerOptions : { kind:"moon.Scroller", horizontal: "hidden" },
});