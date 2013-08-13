enyo.kind({
	name: "sun.sample.PopupTimePicker",
	published: {
		title: "Title",
	},
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Popup Time Picker"},
		{classes: "moon-hspacing", components: [
			{kind: "sun.Button", content: "Button in Popup Time Picker", ontap: "showPopup", popup: "time"}
		]},

		{name: "time", kind: "sun.Popup", components: [
			{kind: "enyo.FittableColumns", style: "height: 42px;", components: [
				{name: "title", fit: true, content: ""}
			]},
			{classes: "moon-divider"},
			{name:"picker", kind: "sun.TimePicker", content: "Time", meridiemEnable: true},
			{
				layoutKind: "enyo.FlexLayout",
				flexOrient: "column",
				flexSpacing: 10,
				components: [
					{kind: "sun.Button", flexOrient: "column", flex: true, content: "Cancel"},
					{kind: "sun.Button", flexOrient: "column", flex: true, content: "OK"}			
				]
			}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.titleChanged();
	},
	titleChanged: function() {
		this.$.title.setContent(this.getTitle());
	},
	popupActivator: null,
	showPopup: function(inSender) {
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	}
});