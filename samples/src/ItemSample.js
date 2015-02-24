var
	kind = require('enyo/kind');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	Icon = require('moonstone/Icon'),
	Image = require('moonstone/Image'),
	Item = require('moonstone/Item'),
	Marquee = require('moonstone/Marquee'),
	MarqueeText = Marquee.Text,
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.ItemSample',
	classes: 'moon enyo-unselectable enyo-fit moon-item-sample-wrapper',
	components: [
		{kind: Scroller, classes: 'enyo-fill moon-7h', components: [
			{kind: Divider, content: 'Simple Item Samples'},
			{components: [
				{kind: Item, content: 'Item 1'},
				{kind: Item, content: 'Item 2 (Disabled)', disabled:true},
				{kind: Item, content: 'Item 3 (Disabled) with really long marqueed text', disabled:true},
				{kind: Item, content: 'Item 4'},
				{kind: Item, content: 'Item with very long text that should truncate'},
				{kind: Item, content: 'Item   with   extra   spaces   that   should   truncate'}
			]},
			{classes: 'moon-1v'},
			{kind: Divider, content: 'Complex Item Samples'},
			{components: [
				{kind: Item, components: [
					{kind: Icon, icon: 'drawer'},
					{tag: 'span', content: 'Item with components'}
				]},
				{kind: Item, components: [
					{kind: MarqueeText, content: 'Item with more complex components'},
					{kind: Image, src: {
						'hd' : 'http://placehold.it/288x60&text=Image+One',
						'fhd': 'http://placehold.it/432x90&text=Image+One'
					}, alt: 'Image One'},
					{kind: Image, src: {
						'hd' : 'http://placehold.it/288x60&text=Image+Two',
						'fhd': 'http://placehold.it/432x90&text=Image+Two'
					}, alt: 'Image Two'}
				]},
				{kind: Item, components: [
					{kind: MarqueeText, content: 'Item with more complex components'},
					{kind: Image, src: {
						'hd' : 'http://placehold.it/100x100&text=Image+Three',
						'fhd': 'http://placehold.it/150x150&text=Image+Three'
					}, style: 'float: left; margin: 10px 10px 10px 0', alt: 'Image Two'},
					{kind: BodyText, style: 'margin: 10px 0', content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'}
				]},
				{kind: Item, components: [
					{kind: MarqueeText, content: 'Item with more complex components'},
					{kind: Image, src: {
						'hd' : 'http://placehold.it/100x100&text=Image+Four',
						'fhd': 'http://placehold.it/150x150&text=Image+Four'
					}, style: 'float: right; margin: 10px 0px 10px 10px', alt: 'Image Two'},
					{kind: BodyText, style: 'margin: 10px 0', content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'}
				]}
			]}
		]}
	]
});