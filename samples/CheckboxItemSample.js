enyo.kind({
	name: "moon.sample.CheckboxItemSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes:"moon-hspacing", controlClasses:"moon-5h", components: [
				{components: [
					{kind: "moon.Divider", content: "Checkbox Items"},
					{kind: "moon.CheckboxItem", content: "Option 1", checked: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 2", onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", disabled: true, content: "Disabled", onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 4", checked: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "This is a verrry long option 5 with a custom checkmark", icon: "", src: "$lib/moonstone/samples/assets/icon-button-enyo-logo.png", onchange: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "Right-Handed Checkbox Items"},
					{kind: "moon.CheckboxItem", content: "Option 1", checked: true, checkboxOnRight: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 2", checkboxOnRight: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", disabled: true, content: "Disabled", checkboxOnRight: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 4", checked: true, checkboxOnRight: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "This is a verrry long option 5", checkboxOnRight: true, onchange: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "Checkbox Item Group"},
					{kind: "Group", onActivate: "groupChanged", components: [
						{kind: "moon.CheckboxItem", content: "Group Option 1"},
						{kind: "moon.CheckboxItem", content: "Group Option 2", checked: true},
						{kind: "moon.CheckboxItem", disabled: true, content: "Disabled"},
						{kind: "moon.CheckboxItem", content: "Group Option 4"},
						{kind: "moon.CheckboxItem", content: "Group Option 5"}
					]}
				]}
			]}
		]},
		{components: [
			{kind:"moon.Divider", content:"Result"},
			{kind:"moon.BodyText", name:"result", content:"Nothing selected"}
		]}
	],
	itemChanged: function(inSender, inEvent) {
		this.$.result.setContent(inSender.getContent() + " was " + (inSender.getChecked() ? " selected." : "deselected."));
	},
	groupChanged: function(inSender, inEvent) {
		if (inEvent.toggledControl.getChecked()) {
			var selected = inEvent.toggledControl.getContent();
			this.$.result.setContent(selected + " was selected.");
		}
	}
});