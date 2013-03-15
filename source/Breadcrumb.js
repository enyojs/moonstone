/**
	_moon.Breadcrumb_ is used inside the components of BreadcrumbDecorator 
*/
enyo.kind({
	name: "moon.Breadcrumb",
	kind: "moon.Header",
	components: [
        {name: "titleAbove", classes: "moon-header-title-above moon-breadcrumb-title-above"},
		{name: "title", classes: "moon-header-title moon-breadcrumb-title"},
        {name: "titleBelow", kind: "moon.Item", spotlight: false, classes: "moon-header-title-below moon-breadcrumb-title-below"}
	]
});