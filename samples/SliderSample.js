enyo.kind({
	kind: "FittableRows",
	name: "moon.sample.SliderSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit: true, components: [
		
			{kind: "moon.Divider", content: "Slider 1: Default"},
			{name: "slider1", kind: "moon.Slider", value: 25, bgProgress: 35, onChanging: "sliderChanging", onChange: "sliderChanged"},
		
			{kind: "moon.Divider", content:"Slider 2: Deactivated"},
			{kind: "moon.Slider", value: 50, disabled: true},

			{kind: "moon.Divider", content:"Option Properties"},
			{classes: "moon-hspacing", components: [
				{content: "Value: "},
				{kind: "moon.InputDecorator", components: [
					{name: "input", kind: "moon.Input", placeholder: "Value", value: 20}
				]},
				{kind: "moon.Button", content:"Set", ontap:"changeValue"},
				{kind: "moon.Button", content:"-", ontap:"decValue"},
				{kind: "moon.Button", content:"+", ontap:"incValue"}
			]},

			{components: [
				{name: "lockBarSetting", kind: "moon.ToggleItem", checked: false, content: "lock bar", onchange: "changeLockbar"},
				{name: "animateSetting", kind: "moon.ToggleItem", checked: true, content: "Animated", onchange: "animateActivate"},
				{name: "noPopupSetting", kind: "moon.ToggleItem", checked: false, content: "No Status Bubble on Dragging", onchange: "changeStatusBubble"},
				{name: "tapableSetting", kind: "moon.ToggleItem", checked: true, content: "Tapable", onchange: "changeTapable"},
				{name: "constrainSetting", kind: "moon.ToggleItem", checked: false, content: "Constrain to BgProgress", onchange: "changeConstrain"},
				{name: "elasticSetting", kind: "moon.ToggleItem", checked: false, content: "Elastic Effect", onchange: "changeElastic"}
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
	//* @protected
	changeValue: function(inSender, inEvent) {
		var v = this.$.input.getValue();

		for (var i in this.$) {
			if (this.$[i].kind == "moon.Slider") {
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
	}
});
