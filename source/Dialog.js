/**
	_moon.Dialog_ is a <a href="#moon.Popup">moon.Popup</a> with a title, a
	message, and an area for additional controls.
*/
enyo.kind({
	name: "moon.Dialog",
	kind: moon.Popup,
	classes: "moon-dialog",
	published: {
		//* Title of the dialog.
		title: "",
		//* Message of the dialog.
		message: ""
	},
	//* @protected
	tools: [
		{name: "title", classes: "moon-header-font moon-popup-header-text moon-dialog-title"},
		{
			layoutKind: "FittableColumnsLayout",
			components: [
				{name: "message", kind:"moon.BodyText", fit: true},
				{name: "client"}
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