/**
	_moon.Table_ extends [enyo.Table](#enyo.Table), adding Moonstone visual
	styling.
*/
enyo.kind({
	name: "moon.Table",
	kind: "enyo.Table",
	//* @protected
	classes: "moon-table",
	defaultKind: "moon.TableRow"
});

//* @public

/**
	_moon.TableRow_ extends [enyo.TableRow](#enyo.TableRow), adding Moonstone
	visual styling.
*/
enyo.kind({
	name: "moon.TableRow",
	kind: "enyo.TableRow",
	//* @protected
	classes: "moon-table-row",
	defaultKind: "moon.TableCell"
});

//* @public

/**
	_moon.TableCell_ extends [enyo.TableCell](#enyo.TableCell), adding Moonstone
	visual styling.
*/
enyo.kind({
	name: "moon.TableCell",
	kind: "enyo.TableCell",
	//* @protected
	classes: "moon-table-cell"
});