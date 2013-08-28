/**
	_sun.LoadingHeader_ is a Moonstone-styled control with a large title and an area for
	additional controls.
*/
enyo.kind({
	name: "sun.LoadingHeader",
	kind: "sun.Header",
	published: {
		currentValue: 0,
		totalValue: 100,
		percentage: true,
	},
	classes: "sun-loading-header",
	components: [
		{kind: "FittableColumns", components:[
			{name: "texts", fit: true, classes: "sun-header-container", components: [
				{name: "title", classes: "sun-header-font sun-header-title"},
				{name: "titleBelow", classes: "sun-header-title-below"},
				{name: "mask", classes: "sun-header-title-mask"}
			]},
			{name: "info", classes: "sun-header-loading-info", content:""}
		]},
		{name: "arrowIcon", classes: "sun-arrow-icon", ontap: "headerLeftTapped"},
		{name: "loading", kind: "sun.ProgressBar", progress: 0, classes: "sun-header-loading"}
	],
	create: function() {
		this.inherited(arguments);
		this.updateInfo();
	},
	updateInfo: function() {
		if(this.getPercentage()) {
			var percentage = this.getCurrentValue() / this.getTotalValue() * 100;
			this.$.info.setContent(percentage + "%");
			this.$.loading.setProgress(percentage);
		} else {
			var percentage = this.getCurrentValue() / this.getTotalValue() * 100;
			this.$.info.setContent(this.getCurrentValue() + "/" + this.getTotalValue());
			this.$.loading.setProgress(percentage);
		}
	},
	percentageChanged: function() {
		this.updateInfo();
	},
	currentValueChanged: function() {
		this.updateInfo();
	},
	totalValueChanged: function() {
		this.updateInfo();
	}
});
