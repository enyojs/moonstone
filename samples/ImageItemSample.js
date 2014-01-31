enyo.kind({
	name: "moon.sample.ImageItemSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', classes: "enyo-fill", components: [
			{
				components: [
					{kind: "moon.Divider", content: "Left-aligned", spotlight: true},
					{
						components: [
							{
								kind: "moon.ImageItem",
								source: enyo.Image.placeholder,
								label: "Breaking Bad",
								text: "A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student"
							},
							{
								kind: "moon.ImageItem",
								source: enyo.Image.placeholder,
								label: "South Park",
								text: "Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado."
							},
							{
								kind: "moon.ImageItem",
								source: enyo.Image.placeholder,
								label: "Paulie",
								text: "Life from a parrot's point of view."
							}
						]
					}
				]
			},
			{tag: "br"},
			{
				components: [
					{kind: "moon.Divider", content: "Right-aligned"},
					{
						components: [
							{
								kind: "moon.ImageItem",
								source: enyo.Image.placeholder,
								label: "Breaking Bad",
								imageAlignRight: true,
								text: "A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student"
							},
							{
								kind: "moon.ImageItem",
								source: enyo.Image.placeholder,
								label: "South Park",
								imageAlignRight: true,
								text: "Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado."
							},
							{
								kind: "moon.ImageItem",
								source: enyo.Image.placeholder,
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