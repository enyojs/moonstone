/**
	_moon.Dialog_ is an <a href="#moon.Popup">moon.Popup</a> which has title, message and
	additional control area with Moonstone styling applied.
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