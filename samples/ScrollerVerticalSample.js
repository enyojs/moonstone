enyo.kind({
	name: 'moon.sample.ScrollerVerticalSample',
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Panel", classes: "enyo-fit", headerType: "medium", title: "Vertical Scroller", headerComponents: [
			{content: "Spacing: ", classes: "moon-header-client-text"},
			{kind: "moon.SimplePicker", name: "spacingPicker", classes: "moon-4h", onChange: "spacingChanged", components: [
				{content: "default", spacingClass: ""},
				{content: "small", spacingClass: "moon-vspacing-s", active:true},
				{content: "medium", spacingClass: "moon-vspacing-m"},
				{content: "large", spacingClass: "moon-vspacing-l"}
			]}
		], components: [
			{ kind: 'moon.Scroller', classes: "enyo-fill", components: [
				{name: "wrapper", classes: "moon-6h moon-vspacing-s", components: [
					{kind: "moon.ExpandablePicker", noneText: "Select a language", autoCollapse: true, content: "Expandable Picker", classes: "moon-expandable-picker-wrapper", components: [
						{content: "English"},
						{content: "Spanish"},
						{content: "French"},
						{content: "German"},
						{content: "Italian"},
						{content: "Japanese"}
					]},
					{kind: "moon.ExpandableInput", content: "Expandable Input", noneText: "No Input"},
					{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", content: "Expandable Integer Picker", value: 7, min: 3, max: 15, step: 1, unit: "elephants"},
					{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date Picker"},
					{kind: "moon.TimePicker", noneText: "Pick a Time", content: "Time Picker"},
					{kind: "moon.CheckboxItem", content: "Checkbox Item 1"},
					{kind: "moon.CheckboxItem", content: "Checkbox Item 2"},
					{kind: "moon.CheckboxItem", content: "Checkbox Item 3"},
					{kind: "moon.SelectableItem", content: "Selectable Item 1"},
					{kind: "moon.SelectableItem", content: "Selectable Item 2"},
					{kind: "moon.SelectableItem", content: "Selectable Item 3"},
					{kind: "moon.CheckboxItem", content: "Checkbox Item 4 (right)", checkboxOnRight:true},
					{kind: "moon.CheckboxItem", content: "Checkbox Item 5 (right)", checkboxOnRight:true},
					{kind: "moon.CheckboxItem", content: "Checkbox Item 6 (right)", checkboxOnRight:true},
					{kind: "moon.ToggleItem", content: "Toggle Item 1"},
					{kind: "moon.ToggleItem", content: "Toggle Item 2"},
					{kind: "moon.ToggleItem", content: "Toggle Item 3"},
					{kind: "moon.FormCheckbox", content: "Form Checkbox 1"},
					{kind: "moon.FormCheckbox", content: "Form Checkbox 2"},
					{kind: "moon.FormCheckbox", content: "Form Checkbox 3"},
					{kind: "moon.Item", content: "Item 1"},
					{kind: "moon.Item", content: "Item 1"},
					{kind: "moon.Button", content: "Button 1"}, {tag: "br"},
					{kind: "moon.Button", content: "Button 2"}, {tag: "br"},
					{kind: "moon.Button", content: "Button 3"}, {tag: "br"},
					{kind: "moon.Item", content: "Item 1"},
					{kind: "moon.Item", content: "Item 1"},
					{kind: "moon.ToggleButton", content: "Toggle Button 1"}, {tag: "br"},
					{kind: "moon.ToggleButton", content: "Toggle Button 2"}, {tag: "br"},
					{kind: "moon.ToggleButton", content: "Toggle Button 3"}, {tag: "br"},
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", placeholder: "Input"}
					]},
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", placeholder: "Input"}
					]},
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", placeholder: "Input"}
					]},
					{kind: "moon.Accordion", content: "Accordion 1", defaultKind: "moon.SelectableItem", components: [
						{content: "Item One"},
						{content: "Item Two"}
					]},
					{kind: "moon.Accordion", content: "Accordion 2", defaultKind: "moon.SelectableItem", components: [
						{content: "Item Three"},
						{content: "Item Four"}
					]},
					{kind: "moon.Accordion", content: "Accordion 3", defaultKind: "moon.SelectableItem", components: [
						{content: "Item Five"},
						{content: "Item Six"}
					]},
					{kind: "moon.Item", content: "Item 1"},
					{kind: "moon.Item", content: "Item 2"},
					{kind: "moon.Item", content: "Item 3"},
					{kind: "moon.Item", content: "Item 4"},
					{kind: "moon.ExpandableText", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
					{kind: "moon.Item", content: "Item 5"},
					{kind: "moon.Item", content: "Item 6"},
					{kind: "moon.Item", content: "Item 7"},
					{kind: "moon.Item", content: "Item 8"},
					{kind: "moon.ExpandableText", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
					{kind: "moon.Item", content: "Item 9"},
					{kind: "moon.Item", content: "Item 10"},
					{kind: "moon.Item", content: "Item 11"},
					{kind: "moon.Item", content: "Item 12"},
					{kind: "moon.ExpandableText", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
					{kind: "moon.Item", content: "Item 13"},
					{kind: "moon.Item", content: "Item 14"},
					{kind: "moon.Item", content: "Item 15"},
					{kind: "moon.Item", content: "Item 16"},
					{kind: "moon.Item", content: "Item 17"},
					{kind: "moon.Item", content: "Item 18"},
					{kind: "moon.Item", content: "Item 19"},
					{kind: "moon.Item", content: "Item 20"},
					{kind: "moon.Item", content: "Item 21"},
					{kind: "moon.Item", content: "Item 22"},
					{kind: "moon.ExpandablePicker", noneText: "Select a language", autoCollapse: true, content: "Expandable Picker", classes: "moon-expandable-picker-wrapper", components: [
						{content: "English"},
						{content: "Spanish"},
						{content: "French"},
						{content: "German"},
						{content: "Italian"},
						{content: "Japanese"}
					]},
					{kind: "moon.ExpandableInput", content: "Expandable Input", noneText: "No Input"},
					{kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", content: "Expandable Integer Picker", value: 7, min: 3, max: 15, step: 1, unit: "elephants"},
					{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date Picker"},
					{kind: "moon.TimePicker", noneText: "Pick a Time", content: "Time Picker"},
					{kind: "moon.Accordion", content: "Accordion 1", components: [
						{content: "Item One"},
						{content: "Item Two"}
					]},
					{kind: "moon.Accordion", content: "Accordion 2", components: [
						{content: "Item Three"},
						{content: "Item Four"}
					]},
					{kind: "moon.Accordion", content: "Accordion 3", components: [
						{content: "Item Five"},
						{content: "Item Six"}
					]}
				]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.spacingChanged();
	},
	spacingChanged: function(inSender, inEvent) {
		if (this.lastSpacingClass) {
			this.$.wrapper.removeClass(this.lastSpacingClass);
		}
		var c = this.$.spacingPicker.getSelected().spacingClass;
		this.$.wrapper.addClass(c);
		this.$.wrapper.bubble("onRequestSetupBounds");
		this.lastSpacingClass = c;
	}
});
