enyo.kind({
	name: "moon.Sample.Wizard.ActionMenuPanel",
	kind: "moon.Sample.Wizard.FullPanel",
	headerComponents: [
		{name: "listAction", kind: "moon.ListActions", autoCollapse: true, iconSrc: "../assets/icon-list.png", listActions: [
			{action: "Cost", components: [
				{kind: "moon.Divider", content:"Cost"},
				{kind: "moon.Scroller", horizontal: "hidden", defaultKind: "moon.ToggleItem", fit: true, components: [
					{content:"$"},
					{content:"$$"},
					{content:"$$$"}
				]}
			]},
			{action: "Flavor", components: [
				{kind: "moon.Divider", content:"Flavor"},
				{kind: "moon.Scroller", horizontal: "hidden", defaultKind: "moon.CheckboxItem", fit: true, components: [
					{content:"Spicy"},
					{content:"Sweet"},
					{content:"Sour"},
					{content:"Salty", checked: true},
					{content:"Savory"},
					{content:"Bland"},
					{content:"Umami"},
					{content:"Bitter"}
				]}
			]}
		]},
		{name: "prev", kind: "moon.Button", ontap: "doPrevious", content: "Previous"},
		{name: "post", kind: "moon.Button", ontap: "doNext", content: "Next"}
	],
	setToIntro: function() {
		this.$.listAction.hide();
		this.$.prev.hide();
	}
});