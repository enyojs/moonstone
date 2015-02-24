var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	Button = require('moonstone/Button'),
	CheckboxItem = require('moonstone/CheckboxItem'),
	Divider = require('moonstone/Divider'),
	Input = require('moonstone/Input'),
	InputDecorator = require('moonstone/InputDecorator'),
	Scroller = require('moonstone/Scroller'),
	Slider = require('moonstone/Slider');

module.exports = kind({
	kind: FittableRows,
	name: 'moon.sample.SliderSample',
	classes: 'moon enyo-unselectable enyo-fit',
	bindings: [
		{from: '.$.slider1.value', to: '.$.slider2.value'},
		{from: '.$.slider1.bgProgress', to: '.$.slider2.bgProgress'}
	],
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-1v'},
			{kind: Divider, content: 'Slider 1: Default'},
			{name: 'slider1', kind: Slider, showPercentage: false, value: 25, bgProgress: 35, onChanging: 'sliderChanging', onChange: 'sliderChanged'},

			{kind: Divider, content: 'Slider 2: Disabled, Bound to Slider 1'},
			{name: 'slider2', kind: Slider, disabled: true},

			{kind: Divider, content: 'Slider 3: Custom Popup Content'},
			{name: 'slider3', kind: Slider, classes: 'rgb-sample-slider',
				popupColor: 'rgb(0, 0, 25)', value: 25, bgProgress: 150, min: 0, max: 255,
				onChanging: 'customChanging', onChange: 'customChanged', onAnimateFinish: 'customAnimateFinish'
			},

			{kind: Divider, content: 'Slider 4: Negative Values'},
			{name: 'slider4', kind: Slider,
				value: 0, min: -100, max: 100, showPercentage: false, onChanging: 'sliderChanging', onChange: 'sliderChanged'
			},

			{kind: Divider, content: 'Change Value'},
			{classes: 'moon-hspacing', components: [
				{kind: InputDecorator, components: [
					{name: 'valueInput', kind: Input, placeholder: 'Value', classes: 'moon-1h', value: 20}
				]},
				{kind: Button, small:true, content: 'Set', ontap: 'changeValue'},
				{kind: Button, small:true, content: '-', ontap: 'decValue'},
				{kind: Button, small:true, content: '+', ontap: 'incValue'}
			]},
			{classes: 'moon-1v'},

			{kind: Divider, content: 'Change Background Progress'},
			{classes: 'moon-hspacing', components: [
				{kind: InputDecorator, components: [
					{name: 'progressInput', kind: Input, placeholder: 'Progress', classes: 'moon-1h', value: 30}
				]},
				{kind: Button, small:true, content: 'Set', ontap: 'changeProgress'},
				{kind: Button, small:true, content: '-', ontap: 'decProgress'},
				{kind: Button, small:true, content: '+', ontap: 'incProgress'}
			]},
			{classes: 'moon-1v'},

			{kind: Divider, content: 'Change Increment (applies only to dragging, 0 for disable)'},
			{classes: 'moon-hspacing', components: [
				{kind: InputDecorator, components: [
					{name: 'incrementInput', kind: Input, placeholder: 'Increment', classes: 'moon-1h', value: 0}
				]},
				{kind: Button, small:true, content: 'Set', ontap: 'changeIncrement'}
			]},
			{classes: 'moon-1v'},

			{kind: Divider, content: 'Options'},
			{classes: 'moon-8h', defaultKind: CheckboxItem, components: [
				{name: 'lockBarSetting',        checked: true,     content: 'Lock Bar to Knob', onchange: 'changeLockbar'},
				{name: 'animateSetting',        checked: true,     content: 'Animated',        onchange: 'animateActivate'},
				{name: 'noPopupSetting',        checked: false,    content: 'Hide Popup',      onchange: 'changeStatusBubble'},
				{name: 'tapableSetting',        checked: true,     content: 'Tapable',         onchange: 'changeTapable'},
				{name: 'constrainSetting',      checked: false,    content: 'Constrain to Background Progress', onchange: 'changeConstrain'},
				{name: 'elasticSetting',        checked: false,    content: 'Elastic Effect',  onchange: 'changeElastic'},
				{name: 'showPercentageSetting', checked: false,    content: 'Show Percentage', onchange: 'changePercentage'}
			]}
		]},
		{kind: Divider, content: 'Result'},
		{name: 'result', content: 'No slider moved yet.'}
	],
	create: function () {
		FittableRows.prototype.create.apply(this, arguments);
		this.changeLockbar();
		this.animateActivate();
		this.changeStatusBubble();
		this.changeTapable();
		this.changeConstrain();
		this.changeElastic();
	},
	rendered: function () {
		FittableRows.prototype.rendered.apply(this, arguments);
		this.updateSlider3Popup(this.$.slider3.getValue());
	},
	//* @protected
	changeValue: function (sender, event) {
		var v = this.$.valueInput.getValue();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setValue(v);
			}
		}
	},
	incValue: function () {
		this.$.valueInput.setValue(Math.min(parseInt(this.$.valueInput.getValue() || 0, 10) + 10, 100));
		this.changeValue();
	},
	decValue: function () {
		this.$.valueInput.setValue(Math.max(parseInt(this.$.valueInput.getValue() || 0, 10) - 10, 0));
		this.changeValue();
	},
	changeProgress: function (sender, event) {
		var v = parseInt(this.$.progressInput.getValue(), 10);

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setBgProgress(v);
			}
		}
	},
	changeIncrement: function (sender, event) {
		var v = parseInt(this.$.incrementInput.getValue(), 10);

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setIncrement(v);
			}
		}
	},
	incProgress: function () {
		this.$.progressInput.setValue(Math.min(parseInt(this.$.progressInput.getValue() || 0, 10) + 10, 100));
		this.changeProgress();
	},
	decProgress: function () {
		this.$.progressInput.setValue(Math.max(parseInt(this.$.progressInput.getValue() || 0, 10) - 10, 0));
		this.changeProgress();
	},
	sliderChanging: function (sender, event) {
		this.$.result.setContent(sender.name + ' changing: ' + Math.round(event.value));
	},
	sliderChanged: function (sender, event) {
		this.$.result.setContent(sender.name + ' changed to ' + Math.round(sender.getValue()) + '.');
	},
	customChanging: function (sender, event) {
		this.updateSlider3Popup(event.value);
		this.sliderChanging(sender, event);
	},
	customChanged: function (sender, event) {
		this.updateSlider3Popup(sender.getValue());
		this.sliderChanged(sender, event);
	},
	customAnimateFinish: function (sender, event) {
		this.updateSlider3Popup(event.value);
	},
	updateSlider3Popup: function (inValue) {
		var color = 'rgb(0, 0, ' + Math.round(inValue) + ')';
		this.$.slider3.setPopupContent(color);
		this.$.slider3.setPopupColor(color);
	},
	changeLockbar: function (sender, event) {
		var ck = this.$.lockBarSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setLockBar(ck);
			}
		}
		return true;
	},
	animateActivate: function (sender, event) {
		var ck = this.$.animateSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setAnimate(ck);
			}
		}
		return true;
	},
	changeStatusBubble: function (sender, event) {
		var ck = this.$.noPopupSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setNoPopup(ck);
			}
		}
		return true;
	},
	changeTapable: function (sender, event) {
		var ck = this.$.tapableSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setTappable(ck);
			}
		}
		return true;
	},
	changeConstrain: function (sender, event) {
		var ck = this.$.constrainSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setConstrainToBgProgress(ck);
			}
		}
		return true;
	},
	changeElastic: function (sender, event) {
		var ck = this.$.elasticSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setElasticEffect(ck);
			}
		}
		return true;
	},
	changePercentage: function (sender, event) {
		var ck = this.$.showPercentageSetting.getChecked();

		for (var i in this.$) {
			if (this.$[i].kind == Slider) {
				this.$[i].setShowPercentage(ck);
			}
		}
		return true;
	}
});
