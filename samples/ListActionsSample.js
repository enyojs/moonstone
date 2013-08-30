enyo.kind({
	name: "moon.sample.ListActionsSample",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{name: "header", kind:"moon.Header", title: "Header", titleAbove: "03", components: [
			{kind:"moon.TooltipDecorator", components: [
				{kind:"moon.Tooltip", position:"above", content:"Sort and Filter"},
				{kind: "moon.ListActions", iconSrc:"./assets/icon-list.png", listActions: [
					{action: "category", components: [
						{kind: "moon.Divider", content:"Genre"},
						{kind: "moon.Scroller", horizontal: "hidden", fit: true, components: [
							{content:"Action", kind:"moon.CheckboxItem", checked:true},
							{content:"Comedy", kind:"moon.CheckboxItem"},
							{content:"Drama", kind:"moon.CheckboxItem"},
							{content:"Action", kind:"moon.CheckboxItem"},
							{content:"Comedy", kind:"moon.CheckboxItem"},
							{content:"Drama", kind:"moon.CheckboxItem"},
							{content:"Action", kind:"moon.CheckboxItem"},
							{content:"Comedy", kind:"moon.CheckboxItem"},
							{content:"Drama", kind:"moon.CheckboxItem"},
							{content:"Action", kind:"moon.CheckboxItem"},
							{content:"Comedy", kind:"moon.CheckboxItem"},
							{content:"Drama", kind:"moon.CheckboxItem"},
							{content:"Action", kind:"moon.CheckboxItem"},
							{content:"Comedy", kind:"moon.CheckboxItem"},
							{content:"Drama", kind:"moon.CheckboxItem"},
							{content:"Action", kind:"moon.CheckboxItem"},
							{content:"Comedy", kind:"moon.CheckboxItem"},
							{content:"Drama", kind:"moon.CheckboxItem"}
						]}
					]},
					{components: [
						{kind: "moon.Divider", content:"Sort By"},
						{kind: "moon.Scroller", horizontal: "hidden", fit: true, components: [
							{content:"Most Recent", kind:"moon.ToggleItem"},
							{content:"Recommended", kind:"moon.ToggleItem"},
							{content:"Highest Rated", kind:"moon.ToggleItem"}
						]}
					]}
				]},
			]},
			{kind:"moon.TooltipDecorator", components: [
				{kind:"moon.Tooltip", position:"above", content:"Select Options"},
				{kind: "moon.ListActions", porportionalWidth:true, iconSrc:"./assets/icon-list.png", listActions: [
					{components: [
						{kind: "moon.Divider", content:"Cost"},
						{kind: "moon.Scroller", horizontal: "hidden", fit: true, components: [
							{content:"$", kind:"moon.ToggleItem"},
							{content:"$$", kind:"moon.ToggleItem"},
							{content:"$$$", kind:"moon.ToggleItem"}
						]}
					]},
					{action: "category", components: [
						{kind: "moon.Divider", content:"Flavor"},
						{kind: "moon.Scroller", horizontal: "hidden", fit: true, components: [
							{content:"Spicy", kind:"moon.CheckboxItem", checked:true},
							{content:"Sweet", kind:"moon.CheckboxItem"},
							{content:"Sour", kind:"moon.CheckboxItem"},
							{content:"Salty", kind:"moon.CheckboxItem"},
							{content:"Savory", kind:"moon.CheckboxItem"},
							{content:"Bland", kind:"moon.CheckboxItem"},
							{content:"Umami", kind:"moon.CheckboxItem"},
							{content:"Bitter", kind:"moon.CheckboxItem"}
						]}
					]}
				]}
			]}
		]},
		{tag: "br"},
		{kind: "moon.Divider", content: "List Action Event"},
		{name: "console", content: "Event"}
	],
	activateHandler: function(inSender, inEvent) {
		if (inEvent.toggledControl && inEvent.toggledControl.checked) {
			this.$.header.setTitleBelow(inEvent.toggledControl.getContent());

			//log the optional action property
			this.$.console.setContent("Action: " + (inEvent.action ? inEvent.action : "no action name provided"));
		}

		//log the active state of the ListAction drawer
		if (inEvent.originator && inEvent.originator.kind == "moon.ListActions") {
			this.$.console.setContent("ListActions drawer is now " + (inEvent.originator.active ? "open" : "closed"));
		}
	}
});