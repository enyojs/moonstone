enyo.kind({
	name: "moon.sample.ImageItemSample",
	classes: "moon enyo-unselectable",
	layoutKind: "enyo.FittableColumnsLayout",
	style: "padding: 20px;",
	components: [
		{kind: "enyo.Spotlight"},
		{name: 'scroller', kind: 'moon.Scroller', fit: true, touch: true, components: [
			{
				style: "width: 600px;",
				components: [
					{kind: "moon.Divider", content: "Left-aligned"},
					{
						components: [
							{
								kind: "moon.ImageItem",
								source: "./assets/breaking_bad.png",
								label: "Breaking Bad",
								text: "A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student"
							},
							{
								kind: "moon.ImageItem",
								source: "./assets/south_park.png",
								label: "South Park",
								text: "Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado."
							},
							{
								kind: "moon.ImageItem",
								source: "./assets/paulie.png",
								label: "Paulie",
								text: "Life from a parrot's point of view."
							}
						]
					}
				]
			},
			{style: "padding: 20px;"},
			{
				fit: true,
				components: [
					{kind: "moon.Divider", content: "Right-aligned"},
					{
						components: [
							{
								kind: "moon.ImageItem",
								source: "./assets/breaking_bad.png",
								label: "Breaking Bad",
								imageAlignRight: true,
								text: "A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student"
							},
							{
								kind: "moon.ImageItem",
								source: "./assets/south_park.png",
								label: "South Park",
								imageAlignRight: true,
								text: "Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado."
							},
							{
								kind: "moon.ImageItem",
								source: "./assets/paulie.png",
								label: "Paulie",
								imageAlignRight: true,
								text: "Life from a parrot's point of view."
							}
						]
					}
				]
			}
		]}
	]
});