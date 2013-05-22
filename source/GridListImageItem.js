/**
	_moon.GridList.ImageItem_ extends
	<a href="#enyo.GridList.ImageItem">enyo.GridList.ImageItem</a>, adding
	Moonstone-specific configuration, styling, decorators, and Spotlight/focus-state
	management.

	You may create an image grid by adding instances of this kind as components of
	a <a href="#moon.GridList">moon.GridList</a>.  See the latter kind for an
	example of how this may be done.
*/

enyo.kind({
	name: "moon.GridList.ImageItem",
	kind: "enyo.GridList.ImageItem",
	classes: "moon-gridlist-item moon-gridlist-imageitem"
});