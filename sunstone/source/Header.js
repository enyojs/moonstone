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
		//* If true, the sun-arrow-header css class will be applied to this header
		arrowIcon: false,
		//* If true, onHeaderLeftTapped event won't be generated
		arrowIconDisable: false
	},
	classes: "sun-header moon-header",
	components: [
		{name: "texts", mixins: ["moon.MarqueeSupport"], marqueeOnSpotlight: false, components: [
			{name: "title", kind: "moon.MarqueeText", classes: "sun-header-font sun-header-title"},
			{name: "titleBelow", kind: "moon.MarqueeText", classes: "sun-header-title-below"}
		]},
		{name: "arrowIcon", classes: "sun-arrow-icon", ontap: "headerLeftTapped"},
		{name: "client", classes: "sun-header-client"},
	],
	create: function() {
		this.inherited(arguments);
		this.arrowIconChanged();
		this.arrowIconDisableChanged();
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
	arrowIconChanged: function() {
		this.addRemoveClass("sun-arrow-header", this.getArrowIcon());
		if(!this.getArrowIcon()) {
			this.$.arrowIcon.hide();
		} else {
			this.$.arrowIcon.show();
		}
	},
	arrowIconDisableChanged: function() {
		this.$.arrowIcon.disable = this.getArrowIconDisable();
	},
	headerLeftTapped: function() {
		if(this.getArrowIconDisable() == false) {
		this.doHeaderLeftTapped();

			return false;
		} else {
			return true;
		}
	}
});
