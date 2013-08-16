enyo.kind({
	name: "sun.sample.CheckboxItemSample",
	kind:"FittableRows",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", fit: true, components: [
			{classes:"moon-hspacing", controlClasses:"moon-4h", components: [
				{components: [
					{kind: "moon.Divider", content: "Checkbox Items"},
					{kind: "sun.CheckboxItem", content: "Option 3", checked: true, onchange: "itemChanged"},
					{kind: "sun.CheckboxItem", content: "Option 2", onchange: "itemChanged"},
					{kind: "sun.CheckboxItem", disabled: true, content: "Deactivated", onchange: "itemChanged"},
					{kind: "sun.CheckboxItem", content: "Option 4", checked: true, onchange: "itemChanged"},
					{kind: "sun.CheckboxItem", content: "This is a verrry long option 5", onchange: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "Checkbox Item Group"},
					{kind: "Group", onActivate: "groupChanged", components: [
						{kind: "sun.CheckboxItem", content: "Group Option 1"},
						{kind: "sun.CheckboxItem", content: "Group Option 2", checked: true},
						{kind: "sun.CheckboxItem", disabled: true, content: "Deactivated"},
						{kind: "sun.CheckboxItem", content: "Group Option 4"},
						{kind: "sun.CheckboxItem", content: "Group Option 5"}
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