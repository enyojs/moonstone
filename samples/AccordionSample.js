enyo.kind({
	name: "moon.sample.AccordionSample",
	style: "margin:20px;",
	classes: "moon enyo-unselectable",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Not In Group"},
        {components: [
            {kind: "moon.Accordion", content: "This is an accordion", components: [
                {content: "Item One"},
                {content: "Item Two"}
            ]},
            {kind: "moon.Accordion", content: "This is another accordion", components: [
                {content: "Item Three"},
                {content: "Item Four"}
            ]},
        ]},
        {kind: "moon.Divider", content: "In Group"},
		{kind:"Group", highlander:true, components: [
			{kind: "moon.Accordion",  active: true, content: "This is a grouped accordion", components: [
				{content: "Item One"},
				{content: "Item Two"}
			]},
			{kind: "moon.Accordion", content: "This is another grouped accordion", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]},
			{kind: "moon.Accordion", content: "This is another grouped accordion", components: [
				{content: "Item Five"},
				{content: "Item Six"}
			]},
		]}
	]
});
