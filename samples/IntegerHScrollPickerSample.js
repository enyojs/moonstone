enyo.kind({
	name: "moon.sample.IntegerHScrollPickerSample",
	style: "margin:20px;",
	classes: "moon enyo-unselectable",
	fit: true,
	handlers: {
		onChange: "changed"
	},
	components: [
		{kind: 'enyo.Spotlight'},
		{kind:"moon.IntegerHScrollPicker", name:"Scroller", value:2013, min:1900, max:2100, classes:"moon-date-picker-year"},
		{name:"value", style:"font-size:0.35em;font-family:PreludeWGL Light"}
	],
	changed: function(inSender, inEvent) {
		if (this.$.value){
			this.$.value.setContent(inEvent.name + " changed to " + inEvent.value);
		}
	}
});