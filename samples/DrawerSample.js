enyo.kind({
	name: "moon.sample.DrawerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{
			name: "drawers",
			kind: "moon.Drawers",
			drawers: [
				{
					name: "partialDrawer",
					open: false,
					controlsOpen: false,
					onActivate: "partialDrawerChanged",
					onDeactivate: "partialDrawerChanged",
					handle: {name: "handleButton", content: "Partial drawer with long text truncation"},
					components: [
						{kind: "moon.Panel", classes:"enyo-fit", title: "Partial Drawer", components: [
							{kind: "moon.Item", content: "Item One"},
							{kind: "moon.Item", content: "Item Two"}
						]}
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
						{kind: "moon.Panel", classes:"enyo-fit", title: "Full Drawer", components: [
							{kind: "moon.Item", content: "Item One"},
							{kind: "moon.Item", content: "Item Two"}
						]}
					]
				}
			],
			components: [
				{
					name: "panels",
					kind: "moon.Panels",
					pattern: "activity",
					classes: "enyo-fit",
					components: [
						{title: "First Panel", components: [
							{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
								{kind: "moon.ExpandablePicker", onChange: "pickerChangedImg", content: "Select Image", components: [
									{content: "Music",value: "$lib/moonstone/samples/assets/drawer_icon.png"},
									{content: "LG", value: "$lib/moonstone/samples/assets/lg.png"},
									{content: "HTML5", value: "$lib/moonstone/samples/assets/html5.png"},
									{content: "CSS3", value: "$lib/moonstone/samples/assets/css3.png"},
									{content: "Default", value: "", active: true}
								]},
								{kind: "moon.ExpandablePicker", onChange: "pickerChangedIcon", content: "Select Icon", components: [
									{content: "Drawer", value: "drawer"},
									{content: "FullScreen", value: "fullscreen"},
									{content: "Circle", value: "circle"},
									{content: "Stop", value: "stop"},
									{content: "Play", value: "play"},
									{content: "Pause", value: "pause"},
									{content: "Forward", value: "forward"},
									{content: "Default", value: "", active: true}
								]},
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"}
							]}
						]},
						{title: "Second Panel", components: [
							{kind: "moon.Item", content: "Item One", ontap: "next"},
							{kind: "moon.Item", content: "Item Two", ontap: "next"},
							{kind: "moon.Item", content: "Item Three", ontap: "next"},
							{kind: "moon.Item", content: "Item Four", ontap: "next"},
							{kind: "moon.Item", content: "Item Five", ontap: "next"}
						]},
						{title: "Third Panel", components: [
							{kind: "moon.Item", content: "Item One", ontap: "next"},
							{kind: "moon.Item", content: "Item Two", ontap: "next"},
							{kind: "moon.Item", content: "Item Three", ontap: "next"},
							{kind: "moon.Item", content: "Item Four", ontap: "next"},
							{kind: "moon.Item", content: "Item Five", ontap: "next"}
						]},
						{title: "Fourth Panel", components: [
							{kind: "moon.Item", content: "Item One", ontap: "next"},
							{kind: "moon.Item", content: "Item Two", ontap: "next"},
							{kind: "moon.Item", content: "Item Three", ontap: "next"},
							{kind: "moon.Item", content: "Item Four", ontap: "next"},
							{kind: "moon.Item", content: "Item Five", ontap: "next"}
						]},
						{title: "Fifth Panel", components: [
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
	},
	close: function() {
		if (this.$.partialDrawer.getOpen()) {
			this.$.partialDrawer.setOpen(false);
		} else {
			this.$.partialDrawer.setControlsOpen(false);
		}
	},
	partialDrawerChanged: function() {
		this.$.openMoreButton.setShowing(!this.$.partialDrawer.getOpen());
	},
	pickerChangedImg:function(inSender,inEvent){
		this.$.drawers.set('src',inEvent.selected.value);
	},
	pickerChangedIcon:function(inSender,inEvent){
		this.$.drawers.set('icon',inEvent.selected.value);
	}
});