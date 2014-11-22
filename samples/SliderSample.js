enyo.kind({
	kind: "FittableRows",
	name: "moon.sample.SliderSample",
	classes: "moon enyo-unselectable enyo-fit",
	bindings: [
		{from: ".$.slider1.value", to:".$.slider2.value"},
		{from: ".$.slider1.bgProgress", to: ".$.slider2.bgProgress"}
	],
	components: [
		{kind: "moon.Scroller", fit: true, components: [
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "Slider 1: Default"},
			{name: "slider1", kind: "moon.Slider", value: 25, bgProgress: 35, onChanging: "sliderChanging", onChange: "sliderChanged"},

			{kind: "moon.Divider", content:"Slider 2: Disabled, Bound to Slider 1"},
			{name: "slider2", kind: "moon.Slider", disabled: true},

			{kind: "moon.Divider", content: "Slider 3: Custom Popup Content"},
			{name: "slider3", kind: "moon.Slider", classes: "rgb-sample-slider",
				popupColor: "rgb(0, 0, 25)", value: 25, bgProgress: 150, min: 0, max: 255,
				onChanging: "customChanging", onChange: "customChanged", onAnimateFinish: "customAnimateFinish"
			},

			{kind: "moon.Divider", content: "Slider 4: Negative Values"},
			{name: "slider4", kind: "moon.Slider",
				value: 0, min: -100, max: 100, showPercentage: false, onChanging: "sliderChanging", onChange: "sliderChanged"
			},

			{kind: "moon.Divider", content:"Change Value"},
			{classes: "moon-hspacing", components: [
				{kind: "moon.InputDecorator", components: [
					{name: "valueInput", kind: "moon.Input", placeholder: "Value", classes:"moon-1h", value: 20}
				]},
				{kind: "moon.Button", small:true, content:"Set", ontap:"changeValue"},
				{kind: "moon.Button", small:true, content:"-", ontap:"decValue"},
				{kind: "moon.Button", small:true, content:"+", ontap:"incValue"}
			]},
			{classes:"moon-1v"},

			{kind: "moon.Divider", content:"Change Background Progress"},
			{classes: "moon-hspacing", components: [
				{kind: "moon.InputDecorator", components: [
					{name: "progressInput", kind: "moon.Input", placeholder: "Progress", classes:"moon-1h", value: 30}
				]},
				{kind: "moon.Button", small:true, content:"Set", ontap:"changeProgress"},
				{kind: "moon.Button", small:true, content:"-", ontap:"decProgress"},
				{kind: "moon.Button", small:true, content:"+", ontap:"incProgress"}
			]},
			{classes:"moon-1v"},

			{kind: "moon.Divider", content:"Change Increment (applies only to dragging, 0 for disable)"},
			{classes: "moon-hspacing", components: [
				{kind: "moon.InputDecorator", components: [
					{name: "incrementInput", kind: "moon.Input", placeholder: "Increment", classes:"moon-1h", value: 0}
				]},
				{kind: "moon.Button", small:true, content:"Set", ontap:"changeIncrement"}
			]},
			{classes:"moon-1v"},

			{kind: "moon.Divider", content:"Options"},
			{classes: "moon-8h", defaultKind:"moon.CheckboxItem", components: [
				{name: "lockBarSetting",        checked: true,     content: "Lock Bar to Knob", onchange: "changeLockbar"},
				{name: "animateSetting",        checked: true,     content: "Animated",        onchange: "animateActivate"},
				{name: "noPopupSetting",        checked: false,    content: "Hide Popup",      onchange: "changeStatusBubble"},
				{name: "tapableSetting",        checked: true,     content: "Tapable",         onchange: "changeTapable"},
				{name: "constrainSetting",      checked: false,    content: "Constrain to Background Progress", onchange: "changeConstrain"},
				{name: "elasticSetting",        checked: false,    content: "Elastic Effect",  onchange: "changeElastic"},
				{name: "showPercentageSetting", checked: true,     content: "Show Percentage", onchange: "changePercentage"}
			]}
		]},
		{kind:"moon.Divider", content:"Result"},
		{name:"result", content:"No slider moved yet."}
	],
	create: function() {
		this.inherited(arguments);
		this.changeLockbar();
		this.animateActivate();
		this.changeStatusBubble();
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
		var v = this.$.valueInput.getValue();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setValue(v);
			}
		}
	},
	incValue: function() {
		this.$.valueInput.setValue(Math.min(parseInt(this.$.valueInput.getValue() || 0, 10) + 10, 100));
		this.changeValue();
	},
	decValue: function() {
		this.$.valueInput.setValue(Math.max(parseInt(this.$.valueInput.getValue() || 0, 10) - 10, 0));
		this.changeValue();
	},
	changeProgress: function(inSender, inEvent) {
		var v = parseInt(this.$.progressInput.getValue(), 10);

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setBgProgress(v);
			}
		}
	},
	changeIncrement: function(inSender, inEvent) {
		var v = parseInt(this.$.incrementInput.getValue(), 10);

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setIncrement(v);
			}
		}
	},
	incProgress: function() {
		this.$.progressInput.setValue(Math.min(parseInt(this.$.progressInput.getValue() || 0, 10) + 10, 100));
		this.changeProgress();
	},
	decProgress: function() {
		this.$.progressInput.setValue(Math.max(parseInt(this.$.progressInput.getValue() || 0, 10) - 10, 0));
		this.changeProgress();
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
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setLockBar(ck);
			}
		}
		return true;
	},
	animateActivate: function(inSender, inEvent) {
		var ck = this.$.animateSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setAnimate(ck);
			}
		}
		return true;
	},
	changeStatusBubble: function(inSender, inEvent) {
		var ck = this.$.noPopupSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setNoPopup(ck);
			}
		}
		return true;
	},
	changeTapable: function(inSender, inEvent) {
		var ck = this.$.tapableSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setTappable(ck);
			}
		}
		return true;
	},
	changeConstrain: function(inSender, inEvent) {
		var ck = this.$.constrainSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setConstrainToBgProgress(ck);
			}
		}
		return true;
	},
	changeElastic: function(inSender, inEvent) {
		var ck = this.$.elasticSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setElasticEffect(ck);
			}
		}
		return true;
	},
	changePercentage: function(inSender, inEvent) {
		var ck = this.$.showPercentageSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
				this.$[i].setShowPercentage(ck);
			}
		}
		return true;
	}
});
