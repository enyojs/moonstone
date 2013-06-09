enyo.kind({
	name: "moon.sample.SliderSample",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "moon.Scroller",
	horizontal: "hidden",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit: true, components: [
		
			{kind: "moon.Divider", content: "Slider 1: Default"},
			{kind: "moon.Slider", value: 25, bgProgress: 35, onChanging: "sliderChanging", onChange: "sliderChanged"},
		
			{kind: "moon.Divider", content:"Slider 2: not locked bar"},
			{classes: "checkbox-sample-wrapper", components: [
				{name:"lockBar", kind: "moon.ToggleItem", checked: false, content: "lock bar", onchange: "lockbarChanged"}
			]},
			{name: "slider2", kind: "moon.Slider", lockBar: false, value: 75, bgProgress: 65, progress: 30, onChanging: "sliderChanging", onChange: "sliderChanged"},
		
			{kind: "moon.Divider", content:"Slider 3: Disabled"},
			{name: "disabledSlider", kind: "moon.Slider", value: 50, disabled: true, onChanging:"sliderChanging", onChange:"sliderChanged"},
			
			{kind: "moon.InputDecorator", classes: "slider-sample-input-decorator", components: [
				{name: "input", kind: "moon.Input", value: 20}
			]},
			{kind: "moon.Button", content:"Set", ontap:"changeValue"},
			{kind: "moon.Button", content:"-", ontap:"decValue"},
			{kind: "moon.Button", content:"+", ontap:"incValue"},
			
			{classes: "checkbox-sample-wrapper", components: [
				{name: "animateSetting", kind: "moon.CheckboxItem", classes: "shortened-checkbox", checked: true, content: "Animated", onActivate: "animateActivate"},
				{name: "showStatus", kind: "moon.CheckboxItem", classes: "shortened-checkbox", checked: true, content: "Show Status Bubble", onActivate: "changeStatusBubble"}
			]}		
		]},
		{kind:"moon.Divider", content:"Result"},
		{name:"result", content:"No slider moved yet."}
	],
	//* @protected
	changeValue: function(inSender, inEvent) {
		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setValue(this.$.input.getValue());
			}
		}
	},
	incValue: function() {
		this.$.input.setValue(Math.min(parseInt(this.$.input.getValue() || 0, 10) + 10, 100));
		this.changeValue();
	},
	decValue: function() {
		this.$.input.setValue(Math.max(parseInt(this.$.input.getValue() || 0, 10) - 10, 0));
		this.changeValue();
	},
	sliderChanging: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " changing: " + Math.round(inEvent.value));
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
	},
	changeStatusBubble: function(inSender, inEvent) {
		var status = inEvent.checked;
		this.$.slider.setNoPopup(!status);
		this.$.slider2.setNoPopup(!status);
	}
});
