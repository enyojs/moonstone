enyo.kind({
	name: "moon.sample.SimpleIntegerPickerSample",
	kind: "FittableRows",
	classes:"moon enyo-unselectable enyo-fit",
	components:[
		{kind:"enyo.Spotlight"},
		{kind: "moon.Scroller", fit: true, components: [
			{kind: "moon.Divider", content:"Picker 1: Animated"},
			{kind:"moon.SimpleIntegerPicker", name:"picker1", value:3, min:1, max:10, step: 1, unit: "sec", onChange: "change"}
		]},
		{name: "result", content:"result"},
	],
	change: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changed to " + inEvent.content + " (" + inEvent.value + ")");
	}
});