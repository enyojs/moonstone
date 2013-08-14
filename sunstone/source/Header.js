/**
	_sun.Header_ is a Moonstone-styled control with a large title and an area for
	additional controls.
*/
enyo.kind({
	name: "sun.Header",
	kind: "moon.Header",
	handlers: {ontap: "onComponentTap"},
	events: {"onHeaderLeftTapped":""},
	published: {
		//* Title of the header
		title: '',
		//* Text above the header
		titleAbove: '',
		//* Text below the header
		titleBelow: '',
		//* Sub-text below the header
		subTitleBelow: '',
		//* If true, the moon-small-header css class will be applied to this header
		small: false,
		//* If true, the moon-left-header css class will be applied to this header
		iconLeft: false		
	},
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "titleAbove", classes: "moon-header-font moon-header-title-above"},
			{name: "title", kind: "moon.MarqueeText", classes: "moon-header-font moon-header-title"},
			{name: "titleBelow", kind: "moon.MarqueeText", classes: "moon-header-title-below"},
			{name: "subTitleBelow", kind: "moon.MarqueeText", classes: "moon-header-sub-title-below"}
		]},
		{name: "leftIcon", kind: "moon.IconButton", src: "assets/icon-list.png", classes: "sun-left-icon", ontap: "headerLeftTapped"},
		{name: "client", classes: "moon-header-client"},
		{name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
	],
	create: function() {
		this.inherited(arguments);
		this.smallChanged();
		this.iconLeftChanged();
		this.titleChanged();
		this.titleAboveChanged();
		this.titleBelowChanged();
		this.subTitleBelowChanged();
	},
	//* @protected
	iconLeftChanged: function() {
		this.addRemoveClass("sun-left-header", this.getIconLeft());
		if(!this.getIconLeft())
			this.$.leftIcon.hide();
	},
	headerLeftTapped: function() {
		this.doHeaderLeftTapped();
	}
});
