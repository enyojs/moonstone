enyo.kind({
	name: "moon.sample.DrawerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{
			name: "drawers",
			kind: "moon.Drawers",
			drawers:[
				{
					name: "partialDrawer",
					open: false,
					controlsOpen: false,
					handle: {name: "handleButton", content: "Partial drawer with long text truncation", marquee: true},
					components: [
						{kind: "moon.Header", title: "Partial Drawer"},
						{kind: "moon.Item", content: "Item One"},
						{kind: "moon.Item", content: "Item Two"}
					],
					controlDrawerComponents: [
						{classes:"moon-hspacing", components: [
							{kind: "moon.Button", name: "openMoreButton", content: "Open More", ontap: "openMainDrawer"},
							{kind: "moon.Button", content: "Close", ontap: "close"}
						]}
					]
				},
				{
					name: "searchDrawer",
					handle: {content: "Full drawer"},
					components: [
						{kind: "moon.Header", title: "Full Drawer"},
						{kind: "moon.Item", content: "Item One"},
						{kind: "moon.Item", content: "Item Two"}
					]
				}
			],
			components: [
				{
					name: "panels",
					kind: "moon.Panels",
					classes: "enyo-fit",
					components: [
						{title: "First", classes: "moon-7h", components: [
							{kind: "moon.Item", content: "Item One", ontap: "next"},
							{kind: "moon.Item", content: "Item Two", ontap: "next"},
							{kind: "moon.Item", content: "Item Three", ontap: "next"},
							{kind: "moon.Item", content: "Item Four", ontap: "next"},
							{kind: "moon.Item", content: "Item Five", ontap: "next"}
						]},
						{title: "Second", classes: "moon-7h", components: [
							{kind: "moon.Item", content: "Item One", ontap: "next"},
							{kind: "moon.Item", content: "Item Two", ontap: "next"},
							{kind: "moon.Item", content: "Item Three", ontap: "next"},
							{kind: "moon.Item", content: "Item Four", ontap: "next"},
							{kind: "moon.Item", content: "Item Five", ontap: "next"}
						]}
					]
				}
			]
		}
	],
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	},
	openMainDrawer: function() {
		this.$.partialDrawer.setOpen(true);
		this.$.openMoreButton.hide();
	},
	close: function() {
		this.$.openMoreButton.show();
		if (this.$.partialDrawer.getOpen()) {
			this.$.partialDrawer.setOpen(false);
		} else {
			this.$.partialDrawer.setControlsOpen(false);
		}
	}
});