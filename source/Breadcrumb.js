/**
	_moon.Breadcrumb_ is used inside the components of BreadcrumbDecorator 
*/
enyo.kind({
	name: "moon.Breadcrumb",
	kind: "moon.Header",
	classes: "moon-breadcrumb",
	create: function() {
		this.inherited(arguments);
		this.$.titleAbove.addClass("moon-breadcrumb-title-above");
		this.$.title.addClass("moon-breadcrumb-title-above");
		this.$.titleBelow.addClass("moon-breadcrumb-title-below");
	}
});