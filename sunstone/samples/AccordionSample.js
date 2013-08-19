enyo.kind({
	name: "sun.sample.AccordionSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", classes: "enyo-fill moon-10h", components: [		
			{kind: "sun.Divider", content: "Not In Group"},
			{components: [
				{kind: "sun.Accordion", content: "This is an accordion", components: [
					{kind: "sun.CheckboxItem", content: "Item One"},
					{kind: "sun.CheckboxItem", content: "Item Two"}
				]},
				{kind: "sun.Accordion", content: "Pre-expanded accordion", open:true, components: [
					{kind: "sun.CheckboxItem", content: "Item Three"},
					{kind: "sun.CheckboxItem", content: "Item Four"}
				]},
				{kind: "sun.Accordion", content: "This is an lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion", components: [
					{kind: "sun.CheckboxItem", content: "Looooooooooooooooooooooooooooooooooooong Item One"},
					{kind: "sun.CheckboxItem", content: "Loooooooooooooooooooooooooooooong Item Two"}
				]}
			]}/*,
			{kind: "sun.Divider", content: "In Group"},
			{kind:"Group", highlander:true, components: [
				{kind: "sun.Accordion", content: "This is a grouped accordion", components: [
					{content: "Item One"},
					{content: "Item Two"}
				]},
				{kind: "sun.Accordion", open:true, content: "This is another grouped accordion", components: [
					{content: "Item Three"},
					{content: "Item Four"}
				]},
				{kind: "sun.Accordion", content: "This is another grouped accordion", components: [
					{content: "Item Five"},
					{content: "Item Six"}
				]},
				{kind: "sun.Accordion", content: "This is another lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion", components: [
					{content: "Looooooooooooooooooooooooooooooooooooong Item Three"},
					{content: "Loooooooooooooooooooooooooooooong Item Four"}
				]}
			]},*/
		]}
	]
});
