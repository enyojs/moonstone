enyo.kind({
	name: "moon.Sample.Wizard.MiniPanel",
	kind: "moon.Sample.Wizard.FullPanel",
	smallHeader: true,
	components: [
		{fit:true, kind: "moon.Scroller", horizontal: "hidden", components: [
			{layoutKind: "FittableColumnsLayout", components: [
				{name: "imgmenu", kind: "enyo.Image", classes: "moon-6h moon-8v"},
				{fit: true, components: [
					{name: "headline"},
					{name: "detail"}
				]}
			]}
		]}
	],
	headerComponents: [
		{name: "prev", kind: "moon.Button", small: true, ontap: "doPrevious", content: "Previous"},
		{name: "post", kind: "moon.Button", small: true, ontap: "doNext", content: "Next"}
	]
});