enyo.kind({
	name: "moon.sample.FormCheckboxSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes:"moon-hspacing", controlClasses:"moon-5h", components: [
				{components: [
					{kind: "moon.Divider", content: "FormCheckbox Items (Default)"},
					{kind: "moon.FormCheckbox", content: "Option 1", checked: true, onchange: "itemChanged"},
					{kind: "moon.FormCheckbox", content: "Option 2", onchange: "itemChanged"},
					{kind: "moon.FormCheckbox", disabled: true, content: "Disabled", onchange: "itemChanged"},
					{kind: "moon.FormCheckbox", content: "Option 4", checked: true, onchange: "itemChanged"},
					{kind: "moon.FormCheckbox", content: "This is a verrry long option 5", onchange: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "FormCheckbox Item (Group)"},
					{kind: "Group", onActivate: "groupChanged", components: [
						{kind: "moon.FormCheckbox", content: "Group Option 1"},
						{kind: "moon.FormCheckbox", content: "Group Option 2", checked: true},
						{kind: "moon.FormCheckbox", disabled: true, content: "Disabled"},
						{kind: "moon.FormCheckbox", content: "Group Option 4"},
						{kind: "moon.FormCheckbox", content: "Group Option 5"}
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