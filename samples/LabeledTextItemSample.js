enyo.kind({
	name: "moon.sample.LabeledTextItemSample",	
	classes: "moon enyo-unselectable",
	style: "padding: 20px;",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: 'scroller', kind: 'moon.Scroller', fit: true, touch: true, classes:"moon-labeled-text-item-sample-scroller", components: [
			{
				kind: "moon.LabeledTextItem", 
				label: "Breaking Bad", 
				text: "A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student"
			},
			{
				kind: "moon.LabeledTextItem", 
				label: "South Park", 
				text: "Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado."
			},
			{
				kind: "moon.LabeledTextItem", 
				label: "Paulie", 
				text: "Life from a parrot's point of view."
			}
		]}
	]
});