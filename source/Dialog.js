/**
	_moon.Dialog_
*/
enyo.kind({
	name: "moon.Dialog",
	kind: moon.Popup,
	classes: "moon-dialog",
	published: {
		title: "",
		message: ""
	},
	components: [
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