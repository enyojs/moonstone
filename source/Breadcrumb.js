/**
	_moon.Breadcrumb_, a subkind of _moon.Header_, is a control designed for use
	inside the _components_ block of a _moon.BreadcrumbDecorator_.
*/
enyo.kind({
	name: "moon.Breadcrumb",
	kind: "moon.Header",
	classes: "moon-breadcrumb",
	create: function() {
		this.inherited(arguments);
		this.$.titleAbove.addClass("moon-breadcrumb-title-above");
		this.$.title.addClass("moon-breadcrumb-title");
		this.$.titleBelow.addClass("moon-breadcrumb-title-below");
	}
});