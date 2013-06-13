/**
	_moon.Table_ extends <a href="#enyo.Table">enyo.Table</a>, adding Moonstone
	visual styling.
*/
enyo.kind({
    name: "moon.Table",
    kind: "enyo.Table",
    classes: "moon-table",
    defaultKind: "moon.TableRow"
});

/**
	_moon.TableRow_ extends <a href="#enyo.TableRow">enyo.TableRow</a>, adding
	Moonstone visual styling.
*/
enyo.kind({
    name: "moon.TableRow",
    kind: "enyo.TableRow",
    classes: "moon-table-row",
    defaultKind: "moon.TableCell"
});

/**
	_moon.TableCell_ extends <a href="#enyo.TableCell">enyo.TableCell</a>, adding
	Moonstone visual styling.
*/
enyo.kind({
    name: "moon.TableCell",
    kind: "enyo.TableCell",
    classes: "moon-table-cell"
});