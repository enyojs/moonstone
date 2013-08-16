//* @public
/**
	sun.Panel_ is the default kind for controls created inside a
	<a href="#moon.Panels">moon.Panels</a> container.  Typically, a sun.Panels_
	will contain several instances of sun.Panel_.

	The built-in features of sun.Panel_ include a header and a FittableRows
	layout for the main body content.
*/

enyo.kind({
	name : "sun.Panel",
	published: {
		//* Facade for the header's _title_ property
		title: "",
		//* Facade for the header's _titleBelow_ property
		titleBelow: ""
	},
	
	//* @protected
	spotlight: "container",
	fit : true,
	classes: "sun-panel",
	layoutKind: "FittableRowsLayout",
	headerOption: null,
	panelTools : [
		{name: "header", kind: "sun.Header"},
		{name: "panelBody", fit: true, classes: "sun-panel-body"}
	],
	headerComponents: [],

	create: function() {
		this.inherited(arguments);
		this.$.header.createComponents(this.headerComponents, {owner: this});
		this.titleChanged();
		this.titleBelowChanged();
	},
	initComponents: function() {
		this.createTools();
		this.controlParentName = "panelBody";
		this.discoverControlParent();
		this.inherited(arguments);
	},
	createTools: function() {
		var $pts = enyo.clone(this.get("panelTools"));
		var $h = enyo.clone(this.get("headerOption") || {});
		enyo.mixin($pts[0], $h);
		this.createComponents(this.panelTools);
	},
	//* Forcibly applies layout kind changes to _this.$.panelBody_.
	layoutKindChanged: function() {
		this.$.panelBody.setLayoutKind(this.getLayoutKind());
		this.layoutKind = "FittableRowsLayout";
		this.inherited(arguments);
	},

	//* @public

	//* Updates _this.header_ when _title_ changes.
	titleChanged: function() {
		this.$.header.setTitle(this.getTitle());
	},
	//* Updates _this.header_ when _titleBelow_ changes.
	titleBelowChanged: function() {
		this.$.header.setTitleBelow(this.getTitleBelow());
	},
	//* Updates panel header dynamically.
	getHeader: function() {
		return this.$.header;
	}
});
