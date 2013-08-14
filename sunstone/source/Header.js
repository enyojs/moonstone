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
		//* If true, the moon-small-header css class will be applied to this header
		small: false,
		//* If true, the moon-left-header css class will be applied to this header
		iconLeft: false		
	},
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "title", kind: "moon.MarqueeText", classes: "sun-header-font sun-header-title"},
			{name: "titleBelow", kind: "moon.MarqueeText", classes: "sun-header-title-below"}
		]},
		{name: "leftIcon", kind: "sun.IconButton", src: "assets/icon-list.png", classes: "sun-left-icon", ontap: "headerLeftTapped"},
		{name: "client", classes: "sun-header-client"},
	],
	create: function() {
		this.inherited(arguments);
		this.smallChanged();
		this.iconLeftChanged();
		this.titleChanged();
		this.titleBelowChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.startMarquee();
	},
	startMarquee: function() {
		this.$.texts.startMarquee();
	},
	stopMarquee: function() {
		this.$.texts.stopMarquee();
	},
	//* @protected
	smallChanged: function() {
		this.addRemoveClass("sun-small-header", this.getSmall());
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
	},
	iconLeftChanged: function() {
		this.addRemoveClass("sun-left-header", this.getIconLeft());
		if(!this.getIconLeft())
			this.$.leftIcon.hide();
	},
	headerLeftTapped: function() {
		this.doHeaderLeftTapped();
	}
});
