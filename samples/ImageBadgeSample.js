enyo.kind({
	name: "moon.sample.ImageBadgeSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit image-badge-sample",
	components: [
		{kind: "moon.Scroller", fit: true, components: [
			{kind: "moon.Divider", content: "Image Badges:"},
			{kind: "moon.Image", src: {
				"hd" : "http://placehold.it/228x240&text=Image+One",
				"fhd": "http://placehold.it/342x360&text=Image+One"
			}, alt: "Image One", components: [
				{kind: "moon.Icon", icon: "check"},
				{kind: "moon.Icon", icon: "closex"},
				{kind: "moon.Icon", icon: "drawer", classes: "float-right"}
			]},
			{kind: "moon.Image", src: {
				"hd" : "http://placehold.it/120x160&text=Image+Two",
				"fhd": "http://placehold.it/180x240&text=Image+Two"
			}, alt: "Image Two", components: [
				{kind: "moon.Icon", icon: "closex"}
			]},
			
			{kind: "moon.Divider", classes: "image-badge-sample-divider", content: "Image Badges - Show on Spotlight:"},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: {
					"hd" : "http://placehold.it/228x240&text=Image+One",
					"fhd": "http://placehold.it/342x360&text=Image+One"
				}, alt: "Image One", showBadgesOnSpotlight: true, components: [
					{kind: "moon.Icon", icon: "check"},
					{kind: "moon.Icon", icon: "closex"},
					{kind: "moon.Icon", icon: "drawer", classes: "float-right"}
				]}
			]},
			{kind: "moon.Item", components: [
				{kind: "moon.Image", src: {
					"hd" : "http://placehold.it/120x160&text=Image+Two",
					"fhd": "http://placehold.it/180x240&text=Image+Two"
				}, alt: "Image Two", showBadgesOnSpotlight: true, components: [
					{kind: "moon.Icon", icon: "closex"}
				]}
			]}
		]}
	]
});