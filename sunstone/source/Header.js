/**
	_sun.Header_ is a Moonstone-styled control with a large title and an area for
	additional controls.
*/
enyo.kind({
	name: "sun.Header",
	handlers: {ontap: "onComponentTap"},
	events: {"onHeaderLeftTapped":""},
	published: {
		//* Title of the header
		title: '',
		//* Text below the header
		titleBelow: '',
		//* If true, the moon-left-header css class will be applied to this header
		iconLeft: false		
	},
	classes: "sun-header moon-header",
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "title", kind: "moon.MarqueeText", classes: "sun-header-font sun-header-title"},
			{name: "titleBelow", kind: "moon.MarqueeText", classes: "sun-header-title-below"}
		]},
		{name: "leftIcon", tag: "img", src: "../images/1080x1920/header_arrow.png", classes: "sun-left-icon", ontap: "headerLeftTapped"},
		{name: "client", classes: "sun-header-client"},
	],
	create: function() {
		this.inherited(arguments);
		this.iconLeftChanged();
		this.titleChanged();
		this.titleBelowChanged();
	},
	//* @protected
	contentChanged: function() {
		this.$.title.setContent(this.title || this.content);
	},
	//* @protected
	// For backward-compatibility with original API
	titleChanged: function() {
		this.contentChanged();
	},
	//* @protected
	titleBelowChanged: function() {
		this.$.titleBelow.setContent(this.titleBelow || '');
		this.addRemoveClass("sun-two-lines-header", this.titleBelow);
	},
	iconLeftChanged: function() {
		this.addRemoveClass("sun-left-header", this.getIconLeft());
		if(!this.getIconLeft()) {
			this.$.leftIcon.hide();
		}
	},
	headerLeftTapped: function() {
		this.doHeaderLeftTapped();
	}
});
