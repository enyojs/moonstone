/**
    _moon.Table_ adds Moonstone styling to _enyo.Table_.
*/
enyo.kind({
    name: "moon.Table",
    kind: "enyo.Table",
    classes: "moon-table",
    defaultKind: "moon.TableRow"
});

/**
    _moon.TableRow_ adds Moonstone styling to _enyo.TableRow_.
*/
enyo.kind({
    name: "moon.TableRow",
    kind: "enyo.TableRow",
    classes: "moon-table-row",
    defaultKind: "moon.TableCell"
});

/**
    _moon.TableCell_ adds Moonstone styling to _enyo.TableCell_.
*/
enyo.kind({
    name: "moon.TableCell",
    kind: "enyo.TableCell",
    classes: "moon-table-cell"
});