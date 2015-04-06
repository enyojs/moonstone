var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	Divider = require('moonstone/Divider'),
	Icon = require('moonstone/Icon'),
	Img = require('moonstone/Image'),
	Item = require('moonstone/Item'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.ImageBadgeSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit image-badge-sample',
	components: [
		{kind: Scroller, fit: true, components: [
			{kind: Divider, content: 'Image Badges:'},
			{kind: Img, src: 'http://placehold.it/342x360&text=Image+One', alt: 'Image One', components: [
				{kind: Icon, icon: 'skipbackward'},
				{kind: Icon, icon: 'play'},
				{kind: Icon, icon: 'skipforward'},
				{kind: Icon, icon: 'search', classes: 'float-right'}
			]},
			{kind: Img, src: {
				'hd' : 'http://placehold.it/228x240&text=Image+Two',
				'fhd': 'http://placehold.it/342x360&text=Image+Two'
			}, alt: 'Image Two', components: [
				{kind: Icon, icon: 'check'},
				{kind: Icon, icon: 'closex'},
				{kind: Icon, icon: 'drawer', classes: 'float-right'}
			]},
			{kind: Img, src: {
				'hd' : 'http://placehold.it/120x160&text=Image+Three',
				'fhd': 'http://placehold.it/180x240&text=Image+Three'
			}, alt: 'Image Three', components: [
				{kind: Icon, icon: 'closex'}
			]},
			
			{kind: Divider, classes: 'image-badge-sample-divider', content: 'Image Badges - Show on Spotlight:'},
			{kind: Item, components: [
				{kind: Img, src: 'http://placehold.it/342x360&text=Image+One', alt: 'Image One', showBadgesOnSpotlight: true, components: [
					{kind: Icon, icon: 'skipbackward'},
					{kind: Icon, icon: 'play'},
					{kind: Icon, icon: 'skipforward'},
					{kind: Icon, icon: 'search', classes: 'float-right'}
				]}
			]},
			{kind: Item, components: [
				{kind: Img, src: {
					'hd' : 'http://placehold.it/228x240&text=Image+Two',
					'fhd': 'http://placehold.it/342x360&text=Image+Two'
				}, alt: 'Image Two', showBadgesOnSpotlight: true, components: [
					{kind: Icon, icon: 'check'},
					{kind: Icon, icon: 'closex'},
					{kind: Icon, icon: 'drawer', classes: 'float-right'}
				]}
			]},
			{kind: Item, components: [
				{kind: Img, src: {
					'hd' : 'http://placehold.it/120x160&text=Image+Three',
					'fhd': 'http://placehold.it/180x240&text=Image+Three'
				}, alt: 'Image Three', showBadgesOnSpotlight: true, components: [
					{kind: Icon, icon: 'closex'}
				]}
			]}
		]}
	]
});