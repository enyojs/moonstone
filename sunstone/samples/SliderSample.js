enyo.kind({
	kind: "FittableRows",
	name: "sun.sample.SliderSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", fit: true, components: [
		
			{kind: "sun.Divider", content: "Slider 1: Default"},
			{name: "slider1", kind: "sun.Slider", value: 25, bgProgress: 35, onChanging: "sliderChanging", onChange: "sliderChanged"},
		
			{kind: "sun.Divider", content:"Slider 2: Deactivated"},
			{name: "slider2", kind: "sun.Slider", value: 50, disabled: true},
			
			{kind: "sun.Divider", content: "Slider 3: Custom Popup Content"},
			{name: "slider3", kind: "sun.Slider", classes: "rgb-sample-slider",
				popupColor: "rgb(0, 0, 25)", popupWidth: 180, value: 25, bgProgress: 150, min: 0, max: 255,
				onChanging: "customChanging", onChange: "customChanged", onAnimateFinish: "customAnimateFinish"
			},

			{kind: "sun.Divider", content:"Option Properties"},
			{classes: "moon-hspacing", components: [
				{content: "Value: "},
				{kind: "sun.InputDecorator", components: [
					{name: "input", kind: "sun.Input", placeholder: "Value", value: 20}
				]},
				{kind: "sun.Button", content:"Set", ontap:"changeValue"},
				{kind: "sun.Button", content:"-", ontap:"decValue"},
				{kind: "sun.Button", content:"+", ontap:"incValue"}
			]},

			{components: [
				{name: "lockBarSetting", 		kind: "moon.ToggleItem", checked: false, 	content: "Lock Bar", 		onchange: "changeLockbar"},
				{name: "animateSetting", 		kind: "moon.ToggleItem", checked: true,		content: "Animated", 		onchange: "animateActivate"},				
				{name: "tapableSetting", 		kind: "moon.ToggleItem", checked: true, 	content: "Tapable", 		onchange: "changeTapable"},
				{name: "constrainSetting", 		kind: "moon.ToggleItem", checked: false, 	content: "Constrain to BG", onchange: "changeConstrain"},
				{name: "elasticSetting", 		kind: "moon.ToggleItem", checked: false, 	content: "Elastic Effect", 	onchange: "changeElastic"},
				{name: "showPercentageSetting", kind: "moon.ToggleItem", checked: true, 	content: "Show Percentage", onchange: "changePercentage"}
			]}
		]},
		{kind:"sun.Divider", content:"Result"},
		{name:"result", content:"No slider moved yet."}
	],
	create: function() {
		this.inherited(arguments);
		this.changeLockbar();
		this.animateActivate();
		this.changeTapable();
		this.changeConstrain();
		this.changeElastic();
	},
	rendered: function() {
		this.inherited(arguments);
		this.updateSlider3Popup(this.$.slider3.getValue());
	},
	//* @protected
	changeValue: function(inSender, inEvent) {
		var v = this.$.input.getValue();

		for (var i in this.$) {
			if (this.$[i].kind == "sun.Slider") {
				this.$[i].setValue(v);
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
	customChanging: function(inSender, inEvent) {
		this.updateSlider3Popup(inEvent.value);
		this.sliderChanging(inSender, inEvent);
	},
	customChanged: function(inSender, inEvent) {
		this.updateSlider3Popup(inSender.getValue());
		this.sliderChanged(inSender, inEvent);
	},
	customAnimateFinish: function(inSender, inEvent) {
		this.updateSlider3Popup(inEvent.value);
	},
	updateSlider3Popup: function(inValue) {
		var color = "rgb(0, 0, " + Math.round(inValue) + ")";
		this.$.slider3.setPopupContent(color);
		this.$.slider3.setPopupColor(color);
	},
	changeLockbar: function(inSender, inEvent) {
		var ck = this.$.lockBarSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "sun.Slider") {
				this.$[i].setLockBar(ck);
			}
		}
		return true;
	},
	animateActivate: function(inSender, inEvent) {
		var ck = this.$.animateSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "sun.Slider") {
				this.$[i].setAnimate(ck);
			}
		}
		return true;
	},
	changeTapable: function(inSender, inEvent) {
		var ck = this.$.tapableSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "sun.Slider") {
				this.$[i].setTappable(ck);
			}
		}
		return true;
	},
	changeConstrain: function(inSender, inEvent) {
		var ck = this.$.constrainSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "sun.Slider") {
				this.$[i].setConstrainToBgProgress(ck);
			}
		}
		return true;
	},
	changeElastic: function(inSender, inEvent) {
		var ck = this.$.elasticSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "sun.Slider") {
				this.$[i].setElasticEffect(ck);
			}
		}
		return true;
	},
	changePercentage: function(inSender, inEvent) {
		var ck = this.$.showPercentageSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "sun.Slider") {
				this.$[i].setShowPercentage(ck);
			}
		}
		return true;
	}
});
