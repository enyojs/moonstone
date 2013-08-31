enyo.kind({
	name: "moon.sample.ImageBadgeSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit image-badge-sample",
	components: [
		{kind: "moon.Scroller", fit: true, components: [
			{kind: "moon.Divider", content: "Image Badges:"},
			{kind: "moon.Image", src: "http://placehold.it/240x360&text=Image+One", alt: "Image One", components: [
				{src: "http://placehold.it/42x42&text=Badge"},
				{src: "http://placehold.it/42x42&text=Badge", classes: "float-right"}
			]},
			{kind: "moon.Image", src: "http://placehold.it/180x240&text=Image+Two", alt: "Image Two", components: [
				{src: "http://placehold.it/42x42&text=Badge"}
			]},
			
			{kind: "moon.Divider", classes: "image-badge-sample-divider", content: "Image Badges - Show on Spotlight:"},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: "http://placehold.it/240x360&text=Image+One", alt: "Image One", showBadgesOnSpotlight: true, components: [
					{src: "http://placehold.it/42x42&text=Badge"},
					{src: "http://placehold.it/42x42&text=Badge", classes: "float-right"}
				]}
			]},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: "http://placehold.it/180x240&text=Image+Two", alt: "Image Two", showBadgesOnSpotlight: true, components: [
					{src: "http://placehold.it/42x42&text=Badge"}
				]}
			]}
		]}
	]
});