enyo.kind({
	name: "moon.sample.SimpleIntegerPickerSample",
	fit: true,
	classes:"moon moon-sample-padded enyo-unselectable",
	style: "background: red",
	components:[
		{kind:"enyo.Spotlight"},
		{kind: "moon.Divider", content:"Picker 1: Animated"},
		{kind:"moon.SimpleIntegerPicker", name:"picker1", value:3, min:1, max:10, step: 1, unit: "sec", onChange:"changed"},
		{tag: "br"},{tag: "br"},
		{name: "result", content:"result"},
	],
	changed: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changed to " + inEvent.content + " (" + inEvent.value + ")");
	}
});