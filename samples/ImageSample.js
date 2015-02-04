enyo.kind({
	name: 'moon.sample.ImageSample',
	classes: 'moon enyo-unselectable enyo-fit image-sample',
	components: [
		{kind: 'moon.Divider', content: 'Image'},
		{kind: 'moon.Image', src: 'http://lorempixel.com/64/64/city/1/', alt: 'HD'},
		{kind: 'moon.Image', src: 'http://lorempixel.com/128/128/city/1/', alt: 'FHD'},
		{kind: 'moon.Image', src: 'http://lorempixel.com/256/256/city/1/', alt: 'UHD'},
		{kind: 'moon.Divider', content: 'Multi-res'},
		{kind: 'moon.BodyText', content: 'The below image will change its source resolution based on the screen size at the time this sample is loaded.'},
		{kind: 'moon.Image', src: {'hd': 'http://lorempixel.com/64/64/city/1/', 'fhd': 'http://lorempixel.com/128/128/city/1/', 'uhd': 'http://lorempixel.com/256/256/city/1/'}, alt: 'Large'}
	]
});