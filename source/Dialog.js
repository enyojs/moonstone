/**
	_moon.Dialog_ is a <a href="#moon.Popup">moon.Popup</a> with a title, a
	message, and an area for additional controls.
*/
enyo.kind({
	name: "moon.Dialog",
	kind: moon.Popup,
	classes: "moon-dialog",
	published: {
		title: "",
		message: ""
	},
	tools: [
		{name: "title", classes: "moon-header-font moon-dialog-title"},
		{
			layoutKind: "FittableColumnsLayout",
			components: [
				{name: "message", fit: true, classes: "moon-dialog-message"},
				{name: "client", classes: "moon-dialog-client"}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
		this.messageChanged();
	},
	titleChanged: function() {
		this.$.title.setContent(this.title);
	},
	messageChanged: function() {
		this.$.message.setContent(this.message);
	}
});