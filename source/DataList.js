/**
	_moon.DataList_ is an <a href="#enyo.DataList">enyo.DataList</a> with
	Moonstone styling applied.  It uses <a href="#moon.Scroller">moon.Scroller</a>
	as its default scroller.
*/

enyo.kind({
	name     : "moon.DataList",
	kind     : "enyo.DataList",
	scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" }
});