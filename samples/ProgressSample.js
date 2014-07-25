enyo.kind({
	name: "moon.sample.ProgressSample",
	classes: "moon enyo-unselectable enyo-fit moon-sample-progress-bar-wrapper",
	components: [
		{kind: "moon.Divider", content: "Progress Bars"},
		{kind: "moon.ProgressBar", progress: 25},
		{kind: "moon.ProgressBar", progress: 25, bgProgress: 75},
		{kind: "moon.ProgressBar", progress: 50, barClasses: "moon-sample-green"},
		{kind: "moon.ProgressBar", progress: 50, barClasses: "moon-sample-red"},
		{tag: "br"},
		{kind: "moon.InputDecorator", style: "margin-right:10px; position:relative; top: -5px", components: [
			{kind: "moon.Input", placeholder: "Value"}
		]},
		{kind: "moon.Button", content:"Set", small:true, classes:"moon-sample-spaced-button", ontap: "changeValue"},
		{kind: "moon.Button", content:"-", small:true, classes:"moon-sample-spaced-button", ontap: "decValue"},
		{kind: "moon.Button", content:"+", small:true, classes:"moon-sample-spaced-button", ontap: "incValue"},
		{tag: "br"},
		{tag: "br"},
		{style: "width:240px;", components: [
			{name: "animateSetting", kind: "moon.CheckboxItem", checked: true, content: "Animated"}
		]}
	],
	changeValue: function(inSender, inEvent) {
		for (var i in this.$) {
			if (this.$[i].kind == "moon.ProgressBar") {
				if (this.$.animateSetting.getChecked()) {
					this.$[i].animateProgressTo(this.$.input.getValue());
				} else {
					this.$[i].setProgress(this.$.input.getValue());
				}
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
	}
});
