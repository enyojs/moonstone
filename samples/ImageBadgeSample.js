enyo.kind({
	name: "moon.sample.ImageBadgeSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit image-badge-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit: true, components: [
			{kind: "moon.Divider", content: "Image Badges:"},
			{kind: "moon.Image", src: "assets/hoth.jpg", alt: "Hoth!", components: [
				{src: "assets/commentIcon.png"},
				{src: "assets/rottenIcon.png", classes: "float-right"}
			]},
			{kind: "moon.Image", src: "assets/tatooine.jpg", alt: "Tatooine!", components: [
				{src: "assets/enyoIcon.png"}
			]},
			
			{kind: "moon.Divider", classes: "image-badge-sample-divider", content: "Image Badges - Show on Spotlight:"},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: "assets/hoth.jpg", alt: "Hoth!", showBadgesOnSpotlight: true, components: [
					{src: "assets/commentIcon.png"},
					{src: "assets/rottenIcon.png", classes: "float-right"}
				]}
			]},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: "assets/tatooine.jpg", alt: "Tatooine!", showBadgesOnSpotlight: true, components: [
					{src: "assets/enyoIcon.png"}
				]}
			]}
		]}
	]
});