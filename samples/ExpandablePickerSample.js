enyo.kind({
	name: "moon.sample.ExpandablePickerSample",
	classes: "moon enyo-unselectable enyo-fit moon-hspacing",
	components: [
		{kind: "moon.Panel", name:"nonGroupedPanel", onChange:"pickerChanged", title:"Expandable", smallHeader:true, titleBelow:"Not grouped", style:"width:50%", components: [
			{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
				{style:"max-width: 500px;", components: [
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
					{kind: "moon.ExpandablePicker", content: "Non-auto-collapsing", autoCollapseOnSelect: false, components: [
						{content: "Item 1"},
						{content: "Item 2", active: true},
						{content: "Item 3"}
					]},
					{kind: "moon.ExpandablePicker", noneText: "Nothing selected with loooooooooooooooooooooooooong text truncation", content: "Expandable Picker with looooooooooooooooooooooooooong text truncation", components: [
						{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 1"},
						{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 2"},
						{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 3"}
					]},
					{kind: "moon.ExpandablePicker", disabled:true, content:"Disabled Picker", components: [
						{content: "Item 1"},
						{content: "Item 2", active: true},
						{content: "Item 3"}
					]},
					{kind: "moon.ExpandablePicker", content: "Pre-expanded picker", open: true, components: [
						{content: "Item 1"},
						{content: "Item 2", active: true},
						{content: "Item 3"}
					]},
					{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "Integer Picker", value: 7, min: 3, max: 15, step: 1, unit: "elephants"},
					{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", disabled:true, autoCollapse: true, content: "Disabled Integer Picker", value: 2, min: 1, max: 15, unit: "sec"},
					{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date Picker"},
					{kind: "moon.TimePicker", noneText: "Pick a Date", content: "Time Picker"}
				]}
			]}
		]},
		{kind: "moon.Panel", name:"groupedPanel", onChange:"pickerChanged", title:"Pickers", smallHeader:true, titleBelow:"Grouped", style:"width:50%", components: [
			{kind: "enyo.Group", tag:null, highlander: true, components: [
				{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
					{style:"max-width: 500px;", components: [
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
						{kind: "moon.ExpandablePicker", content: "Non-auto-collapsing", autoCollapseOnSelect: false, components: [
							{content: "Item 1"},
							{content: "Item 2", active: true},
							{content: "Item 3"}
						]},
						{kind: "moon.ExpandablePicker", noneText: "Nothing selected with loooooooooooooooooooooooooong text truncation", content: "Expandable Picker with looooooooooooooooooooooooooong text truncation", components: [
							{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 1"},
							{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 2"},
							{content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 3"}
						]},
						{kind: "moon.ExpandablePicker", disabled:true, content:"Disabled Picker", components: [
							{content: "Item 1"},
							{content: "Item 2", active: true},
							{content: "Item 3"}
						]},
						{kind: "moon.ExpandablePicker", content: "Pre-expanded picker", open: true, components: [
							{content: "Item 1"},
							{content: "Item 2", active: true},
							{content: "Item 3"}
						]},
						{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "Integer Picker", value: 7, min: 3, max: 15, step: 1, unit: "elephants"},
						{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", disabled:true, autoCollapse: true, content: "Disabled Integer Picker", value: 2, min: 1, max: 15, unit: "sec"},
						{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date Picker"},
						{kind: "moon.TimePicker", noneText: "Pick a Date", content: "Time Picker"}
					]}
				]}
			]}
		]}
	],
	pickerChanged: function(inSender, inEvent) {
		var value, 
			picker = inEvent.originator.getContent();
		if (inEvent.originator instanceof moon.ExpandablePicker) {
			value = inEvent.originator.getSelected().getContent();
			inSender.setSubTitleBelow(picker + " changed to '" + value + "'");
		} else if ((inEvent.originator instanceof moon.ExpandableIntegerPicker) ||
					(inEvent.originator instanceof moon.DatePicker) ||
					(inEvent.originator instanceof moon.TimePicker)) {
			value = inEvent.originator.getValue();
			inSender.setSubTitleBelow(picker + " changed to '" + value + "'");
		}
	}
});
