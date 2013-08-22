enyo.kind({
	name: "moon.sample.CheckboxItemSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: 'moon.Scroller', fit: true, components: [
			{classes:"moon-hspacing", controlClasses:"moon-5h", components: [
				{components: [
					{kind: "moon.Divider", content: "Checkbox Items"},
					{kind: "moon.CheckboxItem", content: "Option 1", checked: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 2", onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", disabled: true, content: "Deactivated", onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 4", checked: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "This is a verrry long option 5", onchange: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "Left-Handed Checkbox Items"},
					{kind: "moon.CheckboxItem", content: "Option 1", checked: true, leftHanded: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 2", leftHanded: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", disabled: true, content: "Deactivated", leftHanded: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "Option 4", checked: true, leftHanded: true, onchange: "itemChanged"},
					{kind: "moon.CheckboxItem", content: "This is a verrry long option 5", leftHanded: true, onchange: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "Checkbox Item Group"},
					{kind: "Group", onActivate: "groupChanged", components: [
						{kind: "moon.CheckboxItem", content: "Group Option 1"},
						{kind: "moon.CheckboxItem", content: "Group Option 2", checked: true},
						{kind: "moon.CheckboxItem", disabled: true, content: "Deactivated"},
						{kind: "moon.CheckboxItem", content: "Group Option 4"},
						{kind: "moon.CheckboxItem", content: "Group Option 5"}
					]}
				]}
			]}
		]},
		{components: [
			{kind:"moon.Divider", content:"Result"},
			{name:"result", content:"Nothing selected"}
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