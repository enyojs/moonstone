enyo.kind({
	name: "moon.sample.ListActionsSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{kind: "moon.Scroller", fit: true, components: [
			{name: "header", kind:"moon.Header", title: "Header", titleAbove: "03", components: [
				{kind:"moon.TooltipDecorator", components: [
					{kind:"moon.Tooltip", position:"above", content:"Sort and Filter"},
				
					//* List actions with default width
					{kind: "moon.ListActions", iconSrc:"./assets/icon-list.png", listActions: [
						{action: "Genre", components: [
							{kind: "moon.Divider", content: "Genre"},
							{kind: "moon.Scroller", horizontal: "hidden", defaultKind: "moon.CheckboxItem", fit: true, components: [
								{content:"Action", checked: true},
								{content:"Comedy"},
								{content:"Drama"},
								{content:"Action"},
								{content:"Comedy"},
								{content:"Drama"},
								{content:"Action"},
								{content:"Comedy"},
								{content:"Drama"},
								{content:"Action"},
								{content:"Comedy"},
								{content:"Drama"},
								{content:"Action"},
								{content:"Comedy"},
								{content:"Drama"},
								{content:"Action"},
								{content:"Comedy"},
								{content:"Drama"}
							]}
						]},
						{action: "SortBy", components: [
							{kind: "moon.Divider", content:"Sort By"},
							{kind: "moon.Scroller", horizontal: "hidden", fit: true, components: [
								{kind: "enyo.Group", highlander: true, defaultKind: "moon.SelectableItem", components: [
									{content:"Most Recent"},
									{content:"Recommended"},
									{content:"Highest Rated"}
								]}
							]}
						]}
					]}
				]},
				{kind:"moon.TooltipDecorator", components: [
					{kind:"moon.Tooltip", position: "above", content: "Select Options"},
				
					//* List actions with proportional width
					{kind: "moon.ListActions", porportionalWidth: true, iconSrc: "./assets/icon-list.png", listActions: [
						{action: "Cost", components: [
							{kind: "moon.Divider", content:"Cost"},
							{kind: "moon.Scroller", horizontal: "hidden", defaultKind: "moon.ToggleItem", fit: true, components: [
								{content:"$"},
								{content:"$$"},
								{content:"$$$"}
							]}
						]},
						{action: "Flavor", components: [
							{kind: "moon.Divider", content:"Flavor"},
							{kind: "moon.Scroller", horizontal: "hidden", defaultKind: "moon.CheckboxItem", fit: true, components: [
								{content:"Spicy", checked: true},
								{content:"Sweet"},
								{content:"Sour"},
								{content:"Salty"},
								{content:"Savory"},
								{content:"Bland"},
								{content:"Umami"},
								{content:"Bitter"}
							]}
						]}
					]}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "List Action Event"},
		{name: "console", content: "Event"}
	],
	activateHandler: function(inSender, inEvent) {
		if (inEvent && inEvent.action) {
			this.$.console.setContent("Action: " + inEvent.action);
		}
		
		// Log the active state of the ListAction drawer
		if (inEvent.originator && inEvent.originator.kind == "moon.ListActions") {
			this.$.console.setContent("ListActions drawer is now " + (inEvent.originator.active ? "open" : "closed"));
		}
	}
});