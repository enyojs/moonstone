enyo.kind({
	name: "moon.Header",
	classes: "moon-header",
	published: {
		//* Sets the title for the header
		title: '',
		//* Sets the titleAbove for the header
		titleAbove: '',
		//* Sets the titleBelow for the header
		titleBelow: ''
	},
	components: [
		{name: "titleAbove", classes: "moon-header-title-above"},
		{name: "title", classes: "moon-header-title"},
		{name: "titleBelow", kind: "moon.Item", spotlight: false, classes: "moon-header-title-below"}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
		this.titleAboveChanged();
		this.titleBelowChanged();
	},
	//* @protected
	titleChanged: function() {
		this.$.title.setContent(this.title || this.content);
	},
	//* @protected
	titleAboveChanged: function() {
		this.$.titleAbove.addRemoveClass('no-border', this.titleAbove === '');
		this.$.titleAbove.setContent(this.titleAbove || '');
	},
	//* @protected
	titleBelowChanged: function() {
		this.$.titleBelow.setContent(this.titleBelow || '');
	}
});

enyo.kind({
	name: "moon.HeaderItem",
	kind: "moon.Item",
	classes: "moon-header-item",
	published: {
		//* Sets the title of the header item
		title: '',
		//* Sets the description of the header item
		description: ''
	},
	components: [
		{name: "title", classes: "moon-header-item-title"},
		{name: "description", classes: "moon-header-item-description"}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
		this.descriptionChanged();
	},
	//* @protected
	titleChanged: function() {
		this.$.title.setContent(this.title);
	},
	//* @protected
	descriptionChanged: function() {
		this.$.description.setContent(this.description);
	}
});