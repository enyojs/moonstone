enyo.kind({
	name: "sun.sample.PopupBasicPickerSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Divider", content: "Popup Basic Picker"},
		{classes: "moon-hspacing", components: [
			{kind: "sun.Button", content: "Button in Popup Basic Picker", ontap: "showPopup", popup: "picker"}
		]},

		{
			name: "picker",
			kind: "sun.PopupPanel",
			title: "Title", 
			headerComponents: [
				{kind: "sun.IconButton", small: true, src: "assets/1080x1920/small-icon-close-button.png"},
				{kind: "sun.IconButton", small: true, src: "assets/1080x1920/small-icon-close-button.png"}
			],
			components: [
				{
					layoutKind: "FittableColumnsLayout",
					components: [
						{
							layoutKind: "enyo.FlexLayout",
							flexOrient: "column",
							flexSpacing: 10,
							fit: true,
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
						}
					]
				}
			],
			footerComponents: [
				{kind: "sun.Button", flexOrient: "column", flex: true, content: "Cancel"},
				{kind: "sun.Button", flexOrient: "column", flex: true, content: "OK"}
			]
		}
	],
	popupActivator: null,
	showPopup: function(inSender) {
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	}
});
