enyo.kind({
	name: "moon.sample.DrawerSample",
	classes: "moon enyo-unselectable enyo-fit",
	style:"padding:0",
	kind:"FittableColumns",
	components: [{
	//Drawer 1 : src is passed		
			kind:"FittableRows",
			style:"width:40%",
			components:[{
				name: "drawers",
				kind: "moon.Drawers",
				src:"assets/drawer_icon.png",
				drawers:[
					{
						name: "partialDrawer",
						open: false,
						controlsOpen: false,
						onActivate: "partialDrawerChanged1",
						onDeactivate: "partialDrawerChanged1",
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
								{kind: "moon.Panel", classes:"enyo-fit", title: "Partial Drawer", components: [
									{kind: "moon.Item", content: "Item One"},
									{kind: "moon.Item", content: "Item Two"}
								]}
							]
						}
					],
					components: [{
						name: "panels",
						kind: "moon.Panels",
						pattern: "activity",
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
							]},
							{title: "Third", classes: "moon-7h", components: [
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"},
								{kind: "moon.Item", content: "Item Three", ontap: "next"},
								{kind: "moon.Item", content: "Item Four", ontap: "next"},
								{kind: "moon.Item", content: "Item Five", ontap: "next"}
							]},
							{title: "Fourth", classes: "moon-7h", components: [
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"},
								{kind: "moon.Item", content: "Item Three", ontap: "next"},
								{kind: "moon.Item", content: "Item Four", ontap: "next"},
								{kind: "moon.Item", content: "Item Five", ontap: "next"}
							]},
							{title: "Fifth", classes: "moon-7h", components: [
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"},
								{kind: "moon.Item", content: "Item Three", ontap: "next"},
								{kind: "moon.Item", content: "Item Four", ontap: "next"},
								{kind: "moon.Item", content: "Item Five", ontap: "next"}
							]}
						]}
				]}
			]},
		//Drawer 2: default drawer will be used
		{kind:"FittableRows", style:"width:30%",components:[{
				name: "drawers2",
				kind: "moon.Drawers",
				drawers:[
				],
				components: [
					{
						name: "panels",
						kind: "moon.Panels",
						pattern: "activity",
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
							]},
							{title: "Third", classes: "moon-7h", components: [
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"},
								{kind: "moon.Item", content: "Item Three", ontap: "next"},
								{kind: "moon.Item", content: "Item Four", ontap: "next"},
								{kind: "moon.Item", content: "Item Five", ontap: "next"}
							]},
							{title: "Fourth", classes: "moon-7h", components: [
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"},
								{kind: "moon.Item", content: "Item Three", ontap: "next"},
								{kind: "moon.Item", content: "Item Four", ontap: "next"},
								{kind: "moon.Item", content: "Item Five", ontap: "next"}
							]},
							{title: "Fifth", classes: "moon-7h", components: [
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

		]},
		//Drawer 3 : src is passed 
		{kind:"FittableRows", fit:true,components:[{
				name: "drawers3",
				kind: "moon.Drawers",
				src: "assets/favicon.ico",
				drawers:[
				],
				components: [
					{
						name: "panels",
						kind: "moon.Panels",
						pattern: "activity",
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
							]},
							{title: "Third", classes: "moon-7h", components: [
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"},
								{kind: "moon.Item", content: "Item Three", ontap: "next"},
								{kind: "moon.Item", content: "Item Four", ontap: "next"},
								{kind: "moon.Item", content: "Item Five", ontap: "next"}
							]},
							{title: "Fourth", classes: "moon-7h", components: [
								{kind: "moon.Item", content: "Item One", ontap: "next"},
								{kind: "moon.Item", content: "Item Two", ontap: "next"},
								{kind: "moon.Item", content: "Item Three", ontap: "next"},
								{kind: "moon.Item", content: "Item Four", ontap: "next"},
								{kind: "moon.Item", content: "Item Five", ontap: "next"}
							]},
							{title: "Fifth", classes: "moon-7h", components: [
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
			]}
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
			}
		});