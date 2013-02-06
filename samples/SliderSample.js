enyo.kind({
	name: "moon.sample.SliderSample",
	fit: true,
	classes: "moon moon-sample-padded enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{classes:"moon-sample-divider", content:"Slider 1: No Focus"},
		{name: "nofocusSlider", kind: "moon.Slider", value: 25, onChanging:"sliderChanging", onChange:"sliderChanged"},
		{tag:"br"},
		{classes:"moon-sample-divider", content:"Slider 2: Focus"},
		{name: "focusSlider", kind: "moon.Slider", value: 75, nofocus: false, onChanging:"sliderChanging", onChange:"sliderChanged"},
		{tag:"br"},
		{components: [
			{kind: "moon.InputDecorator", style:"margin-right:10px;", components: [
				{kind: "moon.Input", type: "number", placeholder: "Value", style: "width:50px;", value: 20}
			]},
			{kind: "moon.Button", content:"Set", ontap:"changeValue"},
			{kind: "moon.Button", content:"-", ontap:"decValue"},
			{kind: "moon.Button", content:"+", ontap:"incValue"},
			{tag: "br"},
			{name:"animateSetting", kind: "moon.LabeledCheckbox", content: "Animated", style: "width:240px;"},
			{tag: "br"},
			{tag: "br"},
			{name:"result", style:"font-size:20px;font-family:PreludeWGL Light", content:"No slider moved yet."}
		]}
	],
	create: function() {
		this.inherited(arguments);

		// FIXME : need to implement setChecked function in "moon.LabeledCheckbox"
		this.$.animateSetting.setChecked(true);
//		this.$.nofocusSlider.setNofocus(false);	// testing
//		this.$.focusSlider.setNofocus(true);	// testing
	},
	changeValue: function(inSender, inEvent) {
		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				if (this.$.animateSetting.getChecked()) {
					this.$[i].animateTo(this.$.input.getValue());
				} else {
					this.$[i].setValue(this.$.input.getValue());
				}
			}
		}
	},
	incValue: function() {
		this.$.input.setValue(Math.min(parseInt(this.$.input.getValue() || 0) + 10, 100));
		this.changeValue();
	},
	decValue: function() {
		this.$.input.setValue(Math.max(parseInt(this.$.input.getValue() || 0) - 10, 0));
		this.changeValue();
	},
	sliderChanging: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changing: " + Math.round(inSender.getValue()));
	},
	sliderChanged: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changed to " + Math.round(inSender.getValue()) + ".");
	}
});