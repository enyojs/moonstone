enyo.kind({
	name: "moon.InstantOnArranger",
	kind: "enyo.CardArranger",
	/*	This is a temporary hack until BreadCrumbDecorator eliminates dependency on Arrangers for its hidden panels logic.
		TODO: Eliminate the dependency of BreadCrumbDecorator on Arranger having to set the hiding panels.
		All of the logic related to breadcrumbs shouold be encapsulated inside the BreadCrumbDecorator and not dependent on Arranger.
	*/
	start: function() {
		this.inherited(arguments);
		var hiding = [];
		for (var i=0; i < this.container.toIndex; i++) {
			hiding.push(i);
		}
		this.container.hiddenPanels = hiding;
	}
});