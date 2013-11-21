enyo.kind({
	name: "moon.Sample.Wizard.Panel",
	kind: "moon.Panel",
	headerComponents: [
		{classes: "wizard-nav-button-container moon-hspacing", components: [
			{name: "prev", kind: "moon.Button", content: "Previous"},
			{name: "post", kind: "moon.Button", content: "Next"}
		]}
	]
});
