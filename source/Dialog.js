/**
	_moon.Dialog_ is a [moon.Popup](#moon.Popup) with a title, a subtitle, a
	message, and an area for additional controls.
*/
enyo.kind({
	name: "moon.Dialog",
	kind: moon.Popup,
	//* @protected
	classes: "moon-dialog",
	//* @public
	published: {
		//* The title string for the dialog
		title: "",
		//* The subtitle string for the dialog
		subTitle: "",
		//* The message for the dialog
		message: "",
		//* When true, the title text will be converted to locale-safe uppercasing
		titleUpperCase: true
	},
	//* @protected
	tools: [
		{
			layoutKind: "FittableColumnsLayout",
			components: [
				{fit: true, components: [
					{name: "title", classes: "moon-header-font moon-popup-header-text moon-dialog-title"},
					{name: "subTitle", classes: "moon-dialog-sub-title"}
				]},
				{name: "client", classes: "moon-dialog-client"}
			]
		},
		{kind: "moon.Divider", classes: "moon-dialog-divider"},
		{name: "message", kind:"moon.BodyText", classes: "moon-dialog-content"},
		{name: "spotlightDummy", spotlight:false}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
		this.subTitleChanged();
		this.messageChanged();
	},
	titleChanged: function() {
		this.$.title.setContent( this.getTitleUpperCase() ? enyo.toUpperCase(this.title) : this.title );
	},
	//* @protected
	titleUpperCaseChanged: function() {
		this.titleChanged();
	},
	subTitleChanged: function() {
		this.$.subTitle.setContent(this.subTitle);
	},
	messageChanged: function() {
		this.$.message.setContent(this.message);
	}
});