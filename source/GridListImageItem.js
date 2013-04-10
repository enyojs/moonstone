/**
    _moon.GridList.ImageItem_ extends _enyo.GridList.ImageItem_
    to add moonraker specific configuration, styling, decorators and spotlight/focus-state management.

    Use this as a component of _moon.GridList_ to create an ImageGrid.

	See _moon.GridList_ for example usage.
*/

enyo.kind({
    name: "moon.GridList.ImageItem",
    kind: "enyo.GridList.ImageItem",
    classes: "moon-gridlist-item moon-gridlist-imageitem"
});