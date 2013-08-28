enyo.kind({
	name: "sun.sample.DropDownSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.DropDownDecorator", style:"position: absolute; left: 10%; top: 20px;", components: [
			{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true},
			{kind: "sun.DropDown",
				components: [
				{kind: "sun.Scroller", name: "scroller",
					components: [				
						{content:"Option 1", kind: "sun.OptionItem"},
						{content:"Option 2", kind: "sun.OptionItem"}
					]
				}
				]
			}
		]},
		{kind: "sun.DropDownDecorator", style:"position: absolute; right: 10%; top: 20px;", components: [
			{content: "Below"},
			{kind: "sun.DropDown",
				components: [
				{kind: "sun.Scroller", name: "scroller",
					components: [				
						{content:"Option 1", kind: "sun.OptionItem"},
						{content:"Option 2", kind: "sun.OptionItem"}
					]
				}
				]
			}
		]},
		{kind: "sun.DropDownDecorator", style:"position: absolute; right: 35%; top: 20px;", components: [
			{content: "Options"},
			{kind: "sun.DropDown",
				components: [
				{kind: "sun.Scroller", name: "scroller",
					components: [				
						{content:"Option 1", kind: "sun.OptionItem"},
						{content:"Option 2", kind: "sun.OptionItem"},
						{content:"Option 3", kind: "sun.OptionItem"},
						{content:"Option 4", kind: "sun.OptionItem"}
					]
				}
				]
			}
		]},
		{kind: "sun.DropDownDecorator", style:"position: absolute; left: 10%; bottom: 20px;", components: [
			{content: "Disabled", disabled: true},
			{kind: "sun.DropDown",
				components: [
				{kind: "sun.Scroller", name: "scroller",
					components: [				
						{content:"Option 1", kind: "sun.OptionItem"}
					]
				}
				]
			}
		]},
		{kind: "sun.DropDownDecorator", style:"position: absolute; right: 10%; bottom: 20px;", components: [
			{content: "Above"},
			{kind: "sun.DropDown",
				components: [
				{kind: "sun.Scroller", name: "scroller",
					components: [				
						{content:"Option 1", kind: "sun.OptionItem"},
						{content:"Option 2", kind: "sun.OptionItem"},
						{content:"Option 3", kind: "sun.OptionItem"},
						{content:"Option 4", kind: "sun.OptionItem"},
						{content:"Option 5", kind: "sun.OptionItem"},
						{content:"Option 6", kind: "sun.OptionItem"},
						{content:"Option 7", kind: "sun.OptionItem"},
						{content:"Option 8", kind: "sun.OptionItem"},
						{content:"Option 9", kind: "sun.OptionItem"}
					]
				}
				]
			}
		]}
	],
	buttonToggled: function(inSender, inEvent) {
		this.$.buttonPopup.setSpotlightModal(inSender.getActive());
	}
});
