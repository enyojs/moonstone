var
	kind = require('enyo/kind'),
	Img = require('enyo/Image');

var
	Divider = require('moonstone/Divider'),
	ImageItem = require('moonstone/ImageItem'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.ImageItemSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, classes: 'enyo-fill', components: [
			{
				components: [
					{kind: Divider, content: 'Left-aligned', spotlight: true},
					{
						components: [
							{
								kind: ImageItem,
								source: Img.placeholder,
								label: 'Breaking Bad',
								text: 'A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student'
							},
							{
								kind: ImageItem,
								source: Img.placeholder,
								label: 'South Park',
								text: 'Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado.'
							},
							{
								kind: ImageItem,
								source: Img.placeholder,
								label: 'Paulie',
								text: 'Life from a parrot\'s point of view.'
							}
						]
					}
				]
			},
			{tag: 'br'},
			{
				components: [
					{kind: Divider, content: 'Right-aligned'},
					{
						components: [
							{
								kind: ImageItem,
								source: Img.placeholder,
								label: 'Breaking Bad',
								imageAlignRight: true,
								text: 'A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student'
							},
							{
								kind: ImageItem,
								source: Img.placeholder,
								label: 'South Park',
								imageAlignRight: true,
								text: 'Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado.'
							},
							{
								kind: ImageItem,
								source: Img.placeholder,
								label: 'Paulie',
								imageAlignRight: true,
								text: 'Life from a parrot\'s point of view.'
							}
						]
					}
				]
			}
		]}
	]
});