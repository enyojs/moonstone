var
	kind = require('enyo/kind');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	Img = require('moonstone/Image');

module.exports = kind({
	name: 'moon.sample.ImageSample',
	classes: 'moon enyo-unselectable enyo-fit image-sample',
	components: [
		{kind: Divider, content: 'Image'},
		{kind: Img, src: 'http://lorempixel.com/64/64/city/1/', alt: 'HD'},
		{kind: Img, src: 'http://lorempixel.com/128/128/city/1/', alt: 'FHD'},
		{kind: Img, src: 'http://lorempixel.com/256/256/city/1/', alt: 'UHD'},
		{kind: Divider, content: 'Multi-res'},
		{kind: BodyText, content: 'The below image will change its source resolution based on the screen size at the time this sample is loaded.'},
		{kind: Img, src: {'hd': 'http://lorempixel.com/64/64/city/1/', 'fhd': 'http://lorempixel.com/128/128/city/1/', 'uhd': 'http://lorempixel.com/256/256/city/1/'}, alt: 'Large'}
	]
});