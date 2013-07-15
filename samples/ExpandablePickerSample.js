enyo.kind({
	name: "moon.sample.ExpandablePickerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
			{classes: "moon-6h", components: [
				{kind: "moon.Divider", content: "Not In Group", style: "color: #999;"},
				{kind: "moon.ExpandablePicker", noneText: "Nothing selected", content: "Expandable Picker", components: [
					{content: "English"},
					{content: "Spanish"},
					{content: "French"},
					{content: "German"},
					{content: "Italian"},
					{content: "Japanese"}
				]},
				{kind: "moon.ExpandablePicker", content: "Pre-selected Picker", components: [
					{content: "On", active: true},
					{content: "Off"}
				]},
				{kind: "moon.ExpandablePicker", content: "Non-auto-collapsing", autoCollapse: false, components: [
					{content: "Item 1"},
					{content: "Item 2", active: true},
					{content: "Item 3"}
				]},
				{kind: "moon.ExpandablePicker", disabled:true, content:"Deactivated Picker", components: [
					{content: "Item 1"},
					{content: "Item 2", active: true},
					{content: "Item 3"}
				]},
				{tag: "br"},
				{kind: "moon.Divider", content: "In Group", style: "color: #999;"},
				{kind: "enyo.Group", highlander: true, components: [
					{kind: "moon.ExpandablePicker", content: "Pre-selected Picker", active: true, components: [
						{content: "On", active: true},
						{content: "Off"}
					]},
					{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "Integer Picker",
					classes: "moon-expandable-picker-wrapper", value: 2, min: 1, max: 15, unit: "sec"},

					{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", disabled:true, autoCollapse: true, content: "Deactivated Integer Picker",
					classes: "moon-expandable-picker-wrapper", value: 2, min: 1, max: 15, unit: "sec"}
				]}
			]}
		]}
	]
});
