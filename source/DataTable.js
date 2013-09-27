/**
	_moon.DataTable_ is an <a href="#enyo.DataTable">enyo.DataTable</a> with
	Moonstone visual styling applied.
*/
enyo.kind({
    name: "moon.DataTable",
    kind: "enyo.DataTable",
    defaultKind: "moon.TableRow",
	reset: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.container.resized();
		};
	})
});