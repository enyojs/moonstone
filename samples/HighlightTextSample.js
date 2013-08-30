enyo.kind({
	name: "moon.sample.HighlightTextSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Panels", classes:"enyo-fit", controlClasses:"moon-6h", components: [
			{kind: "moon.Panel", title:"STATIC", titleBelow:"Simple items", subTitleBelow: "Case insensitive",
			components: [
				{components: [
					{kind: "moon.Divider", content:"Standard highlight"},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"text"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"to"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"highlight"}
					]},
					{kind: "moon.Divider", content:"Custom highlight classes"},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"text", highlightClasses:"highlight-text-sample-red"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"to", highlightClasses:"highlight-text-sample-blue"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Text to highlight", highlight:"highlight", highlightClasses:"highlight-text-sample-fancy"}
					]}
				]}
			]},
			{kind: "moon.Panel", headerOption:{kind:"moon.InputHeader"}, 
			title:"SEARCH", titleBelow:"Simple items", subTitleBelow: "Case insensitive",
			oninput:"search", joinToPrev:true, components: [
				{components: [
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Fuzzy"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Funky"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Funkatron"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Buzzatron"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.HighlightText", content:"Tronkatron"}
					]}
				]}
			]},
			{kind: "moon.Panel", headerOption:{kind:"moon.InputHeader"}, 
			title:"SEARCH", titleBelow:"Items in Repeater", subTitleBelow:"Case sensitive",
			oninput:"search", joinToPrev:true, components: [
				{kind: "moon.Scroller", fit:true, components: [
					{kind: "enyo.Repeater", onSetupItem:"setupItem", components: [
						{kind: "moon.Item", components: [
							{kind: "moon.HighlightText", caseSensitive:true}
						]}
					]}
				]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.$.repeater.setCount(this.data.length);
		this.$.repeater.build();
	},
	setupItem: function(inSender, inEvent) {
		inEvent.item.$.highlightText.setContent(this.data[inEvent.index]);
	},
	search: function(inSender, inEvent) {
		inSender.waterfall("onHighlight", {highlight: inEvent.originator.getValue()});
	},
	data: [
		"Abandonment",
		"Abberations",
		"Abbevillian",
		"Abbreviated",
		"Abbreviator",
		"Abecedarian",
		"Aberrational",
		"Aberystwyth",
		"Abiogenesis",
		"Abiogenetic",
		"Abiogenetical",
		"Abiological",
		"Abiotically",
		"Ablactation",
		"Ablutionary",
		"Abnormalise",
		"Abnormality",
		"Abolishable",
		"Abolishment",
		"Abolitionary",
		"Abolitionise",
		"Abolitionism",
		"Abolitionist",
		"Abortifacient",
		"Abortionist",
		"Aboveground",
		"Abovementioned",
		"Abracadabra",
		"Abranchiate",
		"Abridgement",
		"Absenteeism",
		"Absentminded"
	]
});
