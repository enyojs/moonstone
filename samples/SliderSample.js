enyo.kind({
	name: "moon.sample.SliderSample",
	fit: true,
	classes: "moon moon-sample-padded enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{tag:"br"},
		{classes:"moon-sample-divider", content:"Slider 1: Default"},
		{kind: "moon.Slider", value: 25, bgProgress: 35, onChanging:"sliderChanging", onChange:"sliderChanged"},
		{tag:"br"},
		{classes:"moon-sample-divider", content:"Slider 2: not locked bar"},
		{kind: "moon.Slider", lockBar: false, value: 75, bgProgress: 65, progress: 30, onChanging:"sliderChanging", onChange:"sliderChanged"},
		{tag:"br"},
		{classes:"moon-sample-divider", content:"Slider 3: Disabled"},
		{name: "disabledSlider", kind: "moon.Slider", value: 50, disabled: true, onChanging:"sliderChanging", onChange:"sliderChanged"},
		{tag:"br"},
		{components: [
			{kind: "moon.InputDecorator", style:"margin-right:10px;", components: [
				{kind: "moon.Input", type: "number", placeholder: "Value", style: "width:50px;", value: 20}
			]},
			{kind: "moon.Button", content:"Set", ontap:"changeValue"},
			{kind: "moon.Button", content:"-", ontap:"decValue"},
			{kind: "moon.Button", content:"+", ontap:"incValue"},
			{tag: "br"},
			{name:"animateSetting", kind: "moon.LabeledCheckbox", checked: true, content: "Animated", style: "width:260px;"},
			{name:"incrementSetting", kind: "moon.LabeledCheckbox", checked: true, content: "increment by 5", style: "width:260px;", onActivate: "incrementActivate"},
			{tag: "br"},
			{name:"result", style:"font-size:20px;font-family:PreludeWGL Light", content:"No slider moved yet."}
		]}
	],
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
	},
	incrementActivate: function(inSender, inEvent) {
		var sc = inSender.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				if (sc) {
					this.$[i].setIncrement(5);
				}
				else {
					this.$[i].setIncrement(0);
				}
			}
		}

		return true;
	}
});