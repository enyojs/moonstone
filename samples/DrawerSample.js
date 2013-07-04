enyo.kind({
	name: "moon.sample.DrawerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{
			name: "drawers",
			kind: "moon.Drawers",
			drawers:[
				{
					name: "partialDrawer",
					open: false,
					controlsOpen: false,
					handle: {name: "handleButton", content: "Partial drawer", marquee: true},
					components: [
						{kind: "moon.Header", title: "Partial Drawer"},
						{kind: "moon.Item", content: "Item One"},
						{kind: "moon.Item", content: "Item Two"}
					],
					controlDrawerComponents: [
						{classes:"moon-hspacing", components: [
							{kind: "moon.Button", content: "Open More", ontap: "openMainDrawer"},
							{kind: "moon.Button", content: "Close", ontap: "closePartialDrawer"}
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
						{title: "First", components: [
							{kind: "moon.Item", content: "Item One"},
							{kind: "moon.Item", content: "Item Two"},
							{kind: "moon.Item", content: "Item Three"},
							{kind: "moon.Item", content: "Item Four"},
							{kind: "moon.Item", content: "Item Five"}
						]},
						{title: "Second", components: [
							{kind: "moon.Item", content: "Item One"},
							{kind: "moon.Item", content: "Item Two"},
							{kind: "moon.Item", content: "Item Three"},
							{kind: "moon.Item", content: "Item Four"},
							{kind: "moon.Item", content: "Item Five"}
						]}
					]
				}
			]
		}
	],
	openMainDrawer: function() {
		this.$.partialDrawer.setOpen(true);
	},
	closePartialDrawer: function() {
		this.$.partialDrawer.setControlsOpen(false);
	}
});