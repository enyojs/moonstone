enyo.kind({
	name: "moon.sample.CheckboxSample",
	fit: true,
	kind:"FittableRows",
	classes: "moon enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{name: 'scroller', kind: 'moon.Scroller', fit: true, touch: true, components: [
			{
				components: [
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Labeled CHeckItems"},
					{kind: "moon.CheckboxItem", content: "Option 1", checked: true},
					{kind: "moon.CheckboxItem", content: "Option 2"},
					{kind: "moon.CheckboxItem", disabled: true, content: "Disabled"},
					{kind: "moon.CheckboxItem", content: "Option 4", checked: true},
					{kind: "moon.CheckboxItem", content: "This is a verrry long option 5"}
				]},
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Labeled CheckItem Group"},
					{kind: "Group", components: [
						{kind: "moon.CheckboxItem", content: "Option 1"},
						{kind: "moon.CheckboxItem", content: "Option 2", checked: true},
						{kind: "moon.CheckboxItem", disabled: true, content: "Disabled"},
						{kind: "moon.CheckboxItem", content: "Option 4"},
						{kind: "moon.CheckboxItem", content: "Option 5"}
					]}
				]},
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Dark CheckItems"},
					{kind: "Group", classes: "moon-dark-gray", components: [
						{kind: "moon.CheckboxItem", content: "Option 1"},
						{kind: "moon.CheckboxItem", content: "Option 2", checked: true},
						{kind: "moon.CheckboxItem", disabled: true, content: "Disabled"},
						{kind: "moon.CheckboxItem", content: "Option 4"},
						{kind: "moon.CheckboxItem", content: "Option 5"}
					]}
				]},
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Light CheckItems"},
					{kind: "Group", classes: "moon-light-gray", components: [
						{kind: "moon.CheckboxItem", content: "Option 1"},
						{kind: "moon.CheckboxItem", content: "Option 2", checked: true},
						{kind: "moon.CheckboxItem", disabled: true, content: "Disabled"},
						{kind: "moon.CheckboxItem", content: "Option 4"},
						{kind: "moon.CheckboxItem", content: "Option 5"}
					]}
				]}
			]},
			{components: [
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Labeled Toggle Buttons"},
					{kind: "moon.ToggleItem", content: "Option 1"},
					{kind: "moon.ToggleItem", content: "Option 2"},
					{kind: "moon.ToggleItem", disabled: true, content: "Disabled"},
					{kind: "moon.ToggleItem", content: "Option 4"},
					{kind: "moon.ToggleItem", content: "This is a verrry long option 5"}
				]},
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Labeled Toggle Button Group"},
					{kind: "Group", components: [
						{kind: "moon.ToggleItem", content: "Option 1"},
						{kind: "moon.ToggleItem", content: "Option 2"},
						{kind: "moon.ToggleItem", disabled: true, content: "Disabled"},
						{kind: "moon.ToggleItem", content: "Option 4"},
						{kind: "moon.ToggleItem", content: "Option 5"}
					]}
				]},
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Dark Toggle Button Group"},
					{kind: "Group", classes: "moon-dark-gray", components: [
						{kind: "moon.ToggleItem", content: "Option 1"},
						{kind: "moon.ToggleItem", content: "Option 2"},
						{kind: "moon.ToggleItem", disabled: true, content: "Disabled"},
						{kind: "moon.ToggleItem", content: "Option 4"},
						{kind: "moon.ToggleItem", content: "Option 5"}
					]}
				]},
				{classes: "checkbox-sample-wrapper", components: [
					{kind: "moon.Divider", content: "Light Toggle Button Group"},
					{kind: "Group", classes: "moon-light-gray", components: [
						{kind: "moon.ToggleItem", content: "Option 1"},
						{kind: "moon.ToggleItem", content: "Option 2"},
						{kind: "moon.ToggleItem", disabled: true, content: "Disabled"},
						{kind: "moon.ToggleItem", content: "Option 4"},
						{kind: "moon.ToggleItem", content: "Option 5"}
					]}
				]}
			]}
		]}
	]
});