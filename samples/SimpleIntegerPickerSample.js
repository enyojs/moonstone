enyo.kind({
	name: "moon.sample.SimpleIntegerPickerSample",
	kind: "FittableRows",
	classes:"moon enyo-unselectable enyo-fit",
	components:[
		{kind: "moon.Divider", content:"Simple Integer Picker"},
		{kind: "moon.Scroller", fit: true, components: [
			{kind:"moon.SimpleIntegerPicker", name:"picker1", value:3, min:-10, max:10, step: 1, unit: "sec", onChange: "change"}
		]},
		{kind: "moon.ToggleButton", content: "Toggle RTL", ontap: "buttonTapped"},
		{kind: "moon.Divider", content:"Result"},
		{kind: "moon.BodyText", name: "result", content: "No action yet."}
	],
	change: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changed to " + inEvent.content + " (" + inEvent.value + ")");
	},
	buttonTapped: function(inSender, inEvent) {
		if (inSender.getActive()) {
			enyo.dom.addBodyClass("enyo-locale-right-to-left");
		} else {
			enyo.dom.removeClass(document.body, "enyo-locale-right-to-left");
		}
	}
});