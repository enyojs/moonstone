enyo.kind({
	name: "moon.sample.ImageBadgeSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit image-badge-sample",
	components: [
		{kind: "moon.Scroller", fit: true, components: [
			{kind: "moon.Divider", content: "Image Badges:"},
			{kind: "moon.Image", src: "http://placehold.it/340x360&text=Image+One", alt: "Image One", components: [
				{content: "\u0042"},
				{content: "\u0043"},
				{content: "\u0044", classes: "float-right"}
			]},
			{kind: "moon.Image", src: "http://placehold.it/180x240&text=Image+Two", alt: "Image Two", components: [
				{content: "\u0045"}
			]},
			
			{kind: "moon.Divider", classes: "image-badge-sample-divider", content: "Image Badges - Show on Spotlight:"},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: "http://placehold.it/340x360&text=Image+One", alt: "Image One", showBadgesOnSpotlight: true, components: [
					{content: "\u0046"},
					{content: "\u0047"},
					{content: "\u0048", classes: "float-right"}
				]}
			]},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: "http://placehold.it/180x240&text=Image+Two", alt: "Image Two", showBadgesOnSpotlight: true, components: [
					{content: "\u0049"}
				]}
			]}
		]}
	]
});