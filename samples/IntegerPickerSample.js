enyo.kind({
	name: "moon.sample.IntegerPickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{fit:true, components: [
			{kind: "moon.Divider", content: "Integer Picker"},
			{kind: "moon.IntegerPicker", value: 2013, min: 1900, max: 2100, onChange: "changed"}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name: "value", content: "No change yet"}
	],
	changed: function(inSender, inEvent) {
		if (this.$.value){
			this.$.value.setContent(inEvent.name + " changed to " + inEvent.value);
		}
	}
});