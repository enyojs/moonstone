enyo.kind({
	name: "sun.sample.ProgressSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Progress Bars"},
		{kind: "sun.ProgressBar", progress: 25},
		{kind: "sun.ProgressBar", progress: 25, bgProgress: 75},
		{tag: "br"},
		{kind: "sun.InputDecorator", style: "margin-right:10px;", components: [
			{kind: "sun.Input", placeholder: "Value"}
		]},
		{kind: "sun.Button", content:"Set", classes:"moon-sample-spaced-button", ontap: "changeValue"},
		{kind: "sun.Button", content:"-", classes:"moon-sample-spaced-button", ontap: "decValue"},
		{kind: "sun.Button", content:"+", classes:"moon-sample-spaced-button", ontap: "incValue"},
		{tag: "br"},
		{tag: "br"},
		{style: "width:240px;", components: [
			{name: "animateSetting", kind: "moon.CheckboxItem", checked: true, content: "Animated"}
		]}
	],
	changeValue: function(inSender, inEvent) {
		for (var i in this.$) {
			if (this.$[i].kind == "sun.ProgressBar") {
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
