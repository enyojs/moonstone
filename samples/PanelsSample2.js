enyo.kind({
	name: "moon.sample.PanelsSample2",
	classes: "enyo-fit moon",
	kind: "FittableRows",
	components: [
		{kind: "enyo.Spotlight"},
		{style: "background:#222;padding:10px 20px;height:80px;", components: [
			{kind: "moon.Button", content: "Previous", style: "margin-right:20px;", ontap: "prev"},
			{kind: "moon.Button", content: "Next", ontap: "next"},
			{kind: "moon.InputDecorator", components: [
				{name: "indexInput", kind: "moon.Input", placeholder: "Set Index", onchange:"setPanelsIndex"}
			]}
		]},
		{kind: "FittableRows", style: "background:white;", fit: true, components: [
			{name: "breadcrumb", kind: "moon.BreadcrumbDecorator", fit: true, classes: "enyo-fit", onSetupBreadcrumb: "setupBreadcrumb",
				breadcrumbComponents: [
					{name: "title", content: "title"}
				], components: [
					{kind: "enyo.Panels", name: "panels", arrangerKind: "moon.LeanForwardArranger", realtimeFit: true, classes: "enyo-fit moon-panels-sample", components: [
						{content: 0, classes: "moon-panels-sample-panel", style: "background:red;width:50%;"},
						{content: 1, classes: "moon-panels-sample-panel", style: "background:orange;width:10%;"},
						{content: 2, classes: "moon-panels-sample-panel", style: "background:yellow;width:40%;"},
						{content: 3, classes: "moon-panels-sample-panel", style: "background:green;width:80%;"},
						{content: 4, classes: "moon-panels-sample-panel", style: "background:blue;width:25%;"},
						{content: 5, classes: "moon-panels-sample-panel", style: "background:indigo;width:50%;"},
						{content: 6, classes: "moon-panels-sample-panel", style: "background:violet;width:25%;"}
					]}
				]
			}
		]}
	],

	prev: function() { this.$.panels.previous(); },
	next: function() { this.$.panels.next(); },
	setPanelsIndex: function(inSender, inEvent) {
		var val = parseInt(inEvent.target.value, 10);
		if(val >= 0) {
			this.$.panels.setIndex(val);
		}
	},

	setupBreadcrumb: function(inSender, inEvent) {
		var bc = inEvent.breadcrumb,
			color = this.setBreadcrumbColor(inEvent.breadcrumb.index),
			content = this.setBreadcrumbContent(inEvent.breadcrumb.index);

		bc.applyStyle("background", color);
		bc.$.title.setContent(content);
	},

	setBreadcrumbColor: function(inIndex) {
		switch(inIndex) {
			case 0:  return "red";
			case 1:  return "orange";
			case 2:  return "yellow";
			case 3:  return "green";
			case 4:  return "blue";
			case 5:  return "indigo";
			case 6:  return "violet";
			default: return "white";
		}
	},
	setBreadcrumbContent: function(inIndex) {
		switch(inIndex) {
			case 0:  return "Zero";
			case 1:  return "One";
			case 2:  return "Two";
			case 3:  return "Three";
			case 4:  return "Four";
			case 5:  return "Five";
			case 6:  return "Six";
			default: return "None";
		}
	}
});
