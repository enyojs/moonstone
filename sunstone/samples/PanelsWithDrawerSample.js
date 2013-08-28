enyo.kind({
	name: "sun.sample.PanelsWithDrawerSample",
	classes: "sun moon enyo-fit",	
	handlers: {onHeaderLeftTapped: "goPrevPanel", ontap: "goNextPanel"},
	components: [		
		{name: "panels", kind: "moon.Panels", defaultKind: "sun.Panel", arrangerKind: "CardOverlayArranger", classes: "enyo-fit", components: [		
			{
				name: "drawer",
				kind: "sun.DrawerPanel",
				title: "First", 
				arrowIcon: true,
				headerComponents: [
					{
						name: "next",
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true
					}
				],
				bodyComponents: [				
					{kind: "moon.Item", content: "Item One"},
					{kind: "moon.Item", content: "Item Two"},
					{kind: "moon.Item", content: "Item Three"},
					{kind: "moon.Item", content: "Item Four"},
					{kind: "moon.Item", content: "Item Five"}
				],
				drawerComponents: [				
					{kind: "moon.Item", content: "menu 1"},
					{kind: "moon.Item", content: "menu 2"},
					{kind: "moon.Item", content: "menu 3"},
					{kind: "moon.Item", content: "menu 4"},
					{kind: "moon.Item", content: "menu 5"},
					{kind: "moon.Item", content: "menu 6"},
					{kind: "moon.Item", content: "menu 7"},
					{kind: "moon.Item", content: "menu 8"},
					{kind: "moon.Item", content: "menu 9"},
					{kind: "moon.Item", content: "menu 10"},
					{kind: "moon.Item", content: "menu 11"},
					{kind: "moon.Item", content: "menu 12"}
				]
			},
			{
				title: "Second", 
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png", 
						small: true
					}
				],
				components: [				
					{kind: "moon.Item", content: "Item One"},
					{kind: "moon.Item", content: "Item Two"},
					{kind: "moon.Item", content: "Item Three"},
					{kind: "moon.Item", content: "Item Four"},
					{kind: "moon.Item", content: "Item Five"}
				]
			},
			{
				title: "Third", 
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true,
						disabled: true
					}
				],
				components: [				
					{kind: "moon.Item", content: "Item One"},
					{kind: "moon.Item", content: "Item Two"},
					{kind: "moon.Item", content: "Item Three"},
					{kind: "moon.Item", content: "Item Four"},
					{kind: "moon.Item", content: "Item Five"}
				]
			}
		]}
	],
	goNextPanel: function(inSender, inEvent) {
		var $name = inEvent.originator.name;
		if ($name=="next") {
 			this.$.panels.next();
			return true;
		} else {
			return false;
		}
	},
	goPrevPanel: function(inSender, inEvent) {
		var $name = inEvent.originator.name;
		if ($name=="header") {
			this.$.panels.previous();
			return true;
		} else {
			return false;
		}
	}
});
