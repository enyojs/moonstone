enyo.kind({
	name: "sun.sample.DropDownSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.DropDownDecorator", style:"position: absolute; left: 5%; top: 20px;", components: [
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
		{kind: "sun.DropDownDecorator", style:"position: absolute; left: 20%; top: 20px;", components: [
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
		{kind: "sun.DropDownDecorator", style:"position: absolute; left: 5%; bottom: 20px;", components: [
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
