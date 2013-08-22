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
				]}
			]},
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
		]}
	]
});
