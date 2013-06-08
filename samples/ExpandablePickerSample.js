enyo.kind({
	name: "moon.sample.ExpandablePickerSample",
	kind: "FittableRows",
	style: "margin:20px;",
	classes: "moon enyo-unselectable",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{kind:"moon.Scroller", fit:true, components: [
			{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: false, content: "Menu Language", defaultKind: "moon.ToggleItem", classes: "moon-expandable-picker-wrapper", components: [
				{content: "English"},
				{content: "Spanish"},
				{content: "French"},
				{content: "German"},
				{content: "Italian"},
				{content: "Japanese"}
			]},
			{kind: "moon.ExpandablePicker", content: "Key Lock", classes: "moon-expandable-picker-wrapper", components: [
				{content: "On", active: true},
				{content: "Off"}
			]},
			{kind: "moon.ExpandablePicker", content: "ISM Method", classes: "moon-expandable-picker-wrapper", components: [
				{content: "Normal"},
				{content: "Orbiter", active: true}
			]},
			{kind: "moon.ExpandableListItem", content: "This is an expandable list item", components: [
				{content: "Item One"},
				{content: "Item Two"}
			]},
			{kind: "moon.ExpandableListItem", content: "This is another expandable list item", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]},

			{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "SLIDESHOW SPEED", 
			classes: "moon-expandable-picker-wrapper", value: 2, min: 1, max: 15, unit: "sec", autoCollapse: true},

			{kind: "moon.ExpandableListItem", disabled: true, content: "This is a disabled list item", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]}
		]}
	]
});
