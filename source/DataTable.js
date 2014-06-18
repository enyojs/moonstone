/**
	_moon.DataTable_ is an [enyo.DataTable](#enyo.DataTable) with Moonstone visual
	styling applied.
*/
enyo.kind({
    name: "moon.DataTable",
    kind: "enyo.DataTable",
    //* @protected
    defaultKind: "moon.TableRow",
	reset: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.container.resize();
		};
	})
});