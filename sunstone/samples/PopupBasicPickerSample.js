enyo.kind({
	name: "sun.sample.PopupBasicPickerSample",
	published: {
		title: "Title",
	},
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Popup Basic Picker"},
		{classes: "moon-hspacing", components: [
			{kind: "sun.Button", content: "Button in Popup Basic Picker", ontap: "showPopup", popup: "picker"}
		]},

		{name: "picker", kind: "sun.Popup", components: [
			{kind: "enyo.FittableColumns", style: "height: 42px;", components: [
				{name: "title", fit: true, content: ""},
				{kind: "sun.IconButton", src: "$lib/moonstone/patterns-samples/assets/icon-like.png"},
				{kind: "sun.IconButton", src: "$lib/moonstone/patterns-samples/assets/icon-next.png"}
			]},
			{classes: "moon-divider"},
			{
				layoutKind: "enyo.FlexLayout",
				flexOrient: "column",
				flexSpacing: 10,
				components: [
					{kind:"moon.SimplePicker", flexOrient: "column", flex: true, components: [
						{content:"Hotmail"},
						{content:"GMail"},
						{content:"Yahoo Mail"},
						{content:"AOL Mail"},
						{content:"Custom IMAP"}
					]},
					{kind:"moon.SimplePicker", flexOrient: "column", flex: true, components: [
						{content:"Hotmail"},
						{content:"GMail"},
						{content:"Yahoo Mail"},
						{content:"AOL Mail"},
						{content:"Custom IMAP"}
					]},
					{kind:"moon.SimplePicker", flexOrient: "column", flex: true, components: [
						{content:"Hotmail"},
						{content:"GMail"},
						{content:"Yahoo Mail"},
						{content:"AOL Mail"},
						{content:"Custom IMAP"}
					]}
				]
			},
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