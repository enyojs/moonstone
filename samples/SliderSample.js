enyo.kind({
	name: "moon.sample.SliderSample",
	fit: true,
	classes: "moon enyo-unselectable",
	style: "padding: 25px;",
	kind: "Scroller",
	components: [
		{kind: "enyo.Spotlight"},
		{tag:"br"},
		{kind: "moon.Divider", content:"Slider 1: Default"},
		{kind: "moon.Slider", value: 25, bgProgress: 35, onChanging:"sliderChanging", onChange:"sliderChanged"},
		{tag:"br"},
		{kind: "moon.Divider", content:"Slider 2: not locked bar"},
		{style: "width:340px;", components: [
			{name:"lockBar", kind: "moon.LabeledToggleButton", checked: false, content: "lock bar", onchange: "lockbarChanged"}
		]},
		{name: "slider2", kind: "moon.Slider", lockBar: false, value: 75, bgProgress: 65, progress: 30, onChanging:"sliderChanging", onChange:"sliderChanged"},
		{tag:"br"},
		{kind: "moon.Divider", content:"Slider 3: Disabled"},
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
			{style: "width:340px;", components: [
				{name:"animateSetting", kind: "moon.LabeledCheckbox", checked: true, content: "Animated", onActivate: "animateActivate"}
			]},
			{kind: "FittableColumns", components: [
				{name:"incrementSetting", kind: "moon.LabeledCheckbox", checked: true, content: "increment by number", style: "width:340px; display:inline-block;", onActivate: "changeIncrement"},
				{name:"intPicker", kind: "moon.IntegerPicker", min: 1, max: 25, value: 5, onChange:"changeIncrement"}
			]},
			{tag: "br"},
			{name:"result", style:"font-size:20px;font-family:PreludeWGL Light", content:"No slider moved yet."}
		]}
	],
	//* @protected
	create: function() {
		this.inherited(arguments);
		//* FIXME : intial 'value' in moon.IntegerPicker is not applied
		this.$.intPicker.setValue(5);
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
	},
	lockbarChanged: function(inSender, inEvent) {
		this.$.slider2.setLockBar(this.$.lockBar.getChecked());
	},
	animateActivate: function(inSender, inEvent) {
		var ck = inSender.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setAnimate(ck);
			}
		}
		return true;
	},
	changeIncrement: function(inSender, inEvent) {
		var v = this.$.intPicker.getValue();
		if (!this.$.incrementSetting.getChecked()) {
			v = 0;
		}

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setIncrement(v);
			}
		}
		return true;
	}
});