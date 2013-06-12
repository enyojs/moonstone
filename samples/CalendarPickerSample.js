enyo.kind({
	name: "moon.sample.CalendarPickerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.CalendarPicker", content: "Calendar", onChange: "changed", classes: "moon-date-picker-wrapper"},
		{name:"date", style:"font-size:0.35em;font-family:MuseoSans Light"}
	],
	changed: function(inSender, inEvent) {
		if (this.$.date){
			this.$.date.setContent(inEvent.name + " changed to " + inEvent.value.toTimeString());
		}
	}
});