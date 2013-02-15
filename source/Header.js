enyo.kind({
	name: "moon.Header",
	classes: "moon-header",
	published: {
        //* Sets the title for the header
        title: ''
    },
    components: [
		{name: "title", classes: "moon-header-title"}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
	},
    //* @protected
    titleChanged: function() {
    	this.$.title.setContent(this.title || this.content);
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