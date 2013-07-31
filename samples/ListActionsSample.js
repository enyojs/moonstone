enyo.kind({
	name: "moon.sample.ListActionsSample",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{name: "header", kind:"moon.Header", title: "Header", titleAbove: "03", components: [
			{kind: "moon.ListActions", iconSrc:"./assets/icon-list.png", listActions: [
				{
					action: "category",
					components: [
						{kind: "moon.Divider", content:"Category"},
						{kind: "moon.Scroller", horizontal: "hidden", components: [
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
					]
				},
				{
					components: [
						{kind: "moon.Divider", content:"Category"},
						{kind: "moon.Scroller", horizontal: "hidden", components: [
							{content:"Action", kind:"moon.ToggleItem"},
							{content:"Comedy", kind:"moon.ToggleItem"},
							{content:"Drama", kind:"moon.ToggleItem"}
						]}
					]
				},
				{
					action: "menu-language",
					components: [
                        {kind: "moon.ExpandablePicker", noneText: "No Language Selected", 
                        autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.ToggleItem", 
                        classes: "moon-expandable-picker-wrapper", components: [
                            {content: "English"},
                            {content: "Spanish"},
                            {content: "French"},
                            {content: "German"},
                            {content: "Italian"},
                            {content: "Japanese"}
                        ]}
					]
				}
			]},
			{kind: "moon.ListActions", autoCollapse:true, iconSrc:"./assets/icon-list.png", listActions: [
				{
					action: "category",
					components: [
						{kind: "moon.Divider", content:"Category"},
						{kind: "moon.Scroller", horizontal: "hidden", components: [
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
							{content:"Comedy", kind:"moon.CheckboxItem"}
						]}
					]
				},
				{
					components: [
						{kind: "moon.Divider", content:"Category"},
						{kind: "moon.Scroller", horizontal: "hidden", components: [
							{content:"Action", kind:"moon.ToggleItem"},
							{content:"Comedy", kind:"moon.ToggleItem"},
							{content:"Drama", kind:"moon.ToggleItem"}
						]}
					]
				},
				{
					action: "menu-language",
					components: [
                        {kind: "moon.ExpandablePicker", noneText: "No Language Selected", 
                        autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.ToggleItem", 
                        classes: "moon-expandable-picker-wrapper", components: [
                            {content: "English"},
                            {content: "Spanish"},
                            {content: "French"},
                            {content: "German"},
                            {content: "Italian"},
                            {content: "Japanese"}
                        ]}
					]
				}
			]}
		]},
		{tag: "br"},
		{kind: "moon.Divider", content: "List Action Event"},
		{name: "console", content: "Event"}
	],
	names: [],
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