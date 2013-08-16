/**
	_moon.Header_ is a Moonstone-styled control with a large title and an area for
	additional controls.
*/
enyo.kind({
	name: "sun.PopupHeader",
	classes: "sun-popupheader",
	published: {
		//* Title of the header
		title: ''
	},
	components: [
		{name: "title", classes: "sun-popupheader-font sun-popupheader-title"},
		{name: "client", classes: "sun-popupheader-client"}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
	},
	//* @public

	//* @protected
	contentChanged: function() {
		this.$.title.setContent(this.title || this.content);
	},
	//* @protected
	// For backward-compatibility with original API
	titleChanged: function() {
		this.contentChanged();
	}
});

enyo.kind({
	name: "sun.footer",
	layoutKind: "FittableColumnsLayout",
	classes: "sun-popupfooter",
	components: [
		{
			name: "client",
			layoutKind: "enyo.FlexLayout",
			flexOrient: "column",
			flexSpacing: 10,
			fit: true
		}
	]
})

/**
	PopupPanel is an <a href="#sun.Popup">sun.Popup</a> with a header and a footer.
*/
enyo.kind({
	name: "sun.PopupPanel",
	kind: "sun.Popup",
	published: {
		//* Facade for the header's _title_ property
		title: "",
	},

	//* @protected
	spotlight: "container",
	classes: "sun-popuppanel enyo-unselectable",
	// layoutKind: "FittableRowsLayout",
	headerOption: null,
	panelTools : [
		{name: "header", kind: "sun.PopupHeader"},
		{name: "panelBody", kind: "FittableRows", fit: true},
		{name: "footer", kind: "sun.footer"}
	],
	headerComponents: [],
	footerComponents: [],

	create: function() {
		this.inherited(arguments);
		this.$.header.createComponents(this.headerComponents, {owner: this});
		this.$.footer.createComponents(this.footerComponents, {owner: this});
		this.titleChanged();
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
	//* Updates panel header dynamically.
	getHeader: function() {
		return this.$.header;
	}
});