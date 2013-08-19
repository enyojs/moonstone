enyo.kind({
	name: "sun.sample.PanelsWithCardOverlayArrangerSample",
	classes: "sun moon enyo-fit",	
	handlers: {ontap: "panelChange", onHeaderLeftTapped: "panelChange"},
	components: [		
		{name: "panels", kind: "moon.Panels", defaultKind: "sun.Panel", arrangerKind: "CardOverlayArranger", classes: "enyo-fit", components: [		
			{
				title: "First", 
				style: "background-color: red;",
				arrowIcon: true,
				arrowIconDisable: true,
				headerComponents: [
					{
						name: "next",
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true,
						ontap: "panelChange"
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
				title: "Second", 
				style: "background-color: green;",
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png", 
						small: true,
						ontap: "panelChange"
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
				style: "background-color: yellow;",
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true,
						ontap: "panelChange"
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
				title: "Fourth", 
				joinToPrev: true, 
				style: "background-color: blue;",
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true,
						ontap: "panelChange"
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
				title: "Fifth",
				joinToPrev: true,			 	
				style: "background-color: gray;",
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true,
						ontap: "panelChange"
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
				title: "Sixth", 
				style: "background-color: purple;",
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true,
						ontap: "panelChange"
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
				title: "Seventh", 
				joinToPrev: true, 
				style: "background-color: olive;",
				arrowIcon: true,
				headerComponents: [
					{
						name: "next", 
						kind: "sun.IconButton", 
						src: "assets/1080x1920/small-icon-close-button.png",
						small: true,
						disabled: true,
						ontap: "panelChange"
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
	panelChange: function(inSender, inEvent) {
		if(inEvent.originator.name =="next")   
			this.$.panels.next();
		else if(inEvent.originator.name =="arrowIcon")
			this.$.panels.previous();

		return true;
	}
});