enyo.kind({
	name: "moon.sample.AccordionSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', classes: "enyo-fill moon-8h", components: [
			{kind: "moon.Divider", content: "Not In Group"},
			{components: [
				{kind: "moon.Accordion", content: "This is an accordion", components: [
					{content: "Item One"},
					{content: "Item Two"}
				]},
				{kind: "moon.Accordion", content: "Pre-expanded accordion", open:true, components: [
					{content: "Item Three"},
					{content: "Item Four"}
				]},
				{kind: "moon.Accordion", content: "This is an lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion", components: [
					{content: "Looooooooooooooooooooooooooooooooooooong Item One"},
					{content: "Loooooooooooooooooooooooooooooong Item Two"}
				]},
				{kind: "moon.Accordion", content: "Disabled accordion", disabled: true, components: [
					{content: "Item One"},
					{content: "Item Two"}
				]}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "In Group"},
			{kind:"Group", highlander:true, components: [
				{kind: "moon.Accordion", content: "This is a grouped accordion", components: [
					{content: "Item One"},
					{content: "Item Two"}
				]},
				{kind: "moon.Accordion", open:true, content: "This is another grouped accordion", components: [
					{content: "Item Three"},
					{content: "Item Four"}
				]},
				{kind: "moon.Accordion", content: "This is another grouped accordion", components: [
					{content: "Item Five"},
					{content: "Item Six"}
				]},
				{kind: "moon.Accordion", content: "This is another lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion", components: [
					{content: "Looooooooooooooooooooooooooooooooooooong Item Three"},
					{content: "Loooooooooooooooooooooooooooooong Item Four"}
				]}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "In Group using Grouped Selectable Items"},
			{kind: "Group", groupName:"menuItems", components: [
				{kind:"Group", groupName:"accordions", highlander:true, components: [
					{kind: "moon.Accordion", groupName:"accordions", content: "This is a grouped accordion", defaultKind:"moon.SelectableItem", components: [
						{content: "Item One", groupName:"menuItems"},
						{content: "Item Two", groupName:"menuItems"}
					]},
					{kind: "moon.Accordion", groupName:"accordions", open:true, content: "This is another grouped accordion", defaultKind:"moon.SelectableItem", components: [
						{content: "Item Three", groupName:"menuItems"},
						{content: "Item Four", groupName:"menuItems"}
					]},
					{kind: "moon.Accordion", groupName:"accordions", content: "This is another grouped accordion", defaultKind:"moon.SelectableItem", components: [
						{content: "Item Five", groupName:"menuItems"},
						{content: "Item Six", groupName:"menuItems"}
					]},
					{kind: "moon.Accordion", groupName:"accordions", content: "This is another lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion", defaultKind:"moon.SelectableItem", components: [
						{content: "Looooooooooooooooooooooooooooooooooooong Item Three", groupName:"menuItems"},
						{content: "Loooooooooooooooooooooooooooooong Item Four", groupName:"menuItems"}
					]}
				]}
			]}
		]}
	]
});
