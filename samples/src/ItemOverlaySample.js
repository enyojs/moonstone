var
	kind = require('enyo/kind');

var
	Divider = require('moonstone/Divider'),
	Icon = require('moonstone/Icon'),
	Item = require('moonstone/Item'),
	ItemOverlay = require('moonstone/ItemOverlay'),
	ItemOverlaySupport = ItemOverlay.ItemOverlaySupport,
	Marquee = require('moonstone/Marquee'),
	MarqueeText = Marquee.Text,
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.ItemOverlaySample',
	classes: 'moon enyo-unselectable enyo-fit moon-item-overlay-sample-wrapper',
	components: [
		{kind: Scroller, classes: 'enyo-fill moon-7h', components: [
			{kind: Divider, content: 'Simple ItemOverlay Sample'},
			{components: [
				{kind: Item, mixins: [ItemOverlaySupport], beginningComponents: [
						{kind: Icon, icon: 'search', small: true}
					], components: [
						{kind: MarqueeText, content: 'Item with icon on the left side'}
					]
				},
				{kind: Item, mixins: [ItemOverlaySupport], endingComponents: [
						{kind: Icon, icon: 'check', small: true}
					], components: [
						{kind: MarqueeText, content: 'Item with icon on the right side'}
					]
				}
			]},
			{classes: 'moon-1v'},
			{kind: Divider, content: 'ItemOverlay with multiple icons Sample'},
			{components: [
				{kind: Item, mixins: [ItemOverlaySupport], beginningComponents: [
						{kind: Icon, icon: 'arrowlargeup', small: true},
						{kind: Icon, icon: 'arrowlargedown', small: true},
						{kind: Icon, icon: 'arrowlargeleft', small: true},
						{kind: Icon, icon: 'arrowlargeright', small: true}
					], components: [
						{kind: MarqueeText, content: 'Multiple Icons can be used'}
					]
				},
				{kind: Item, mixins: [ItemOverlaySupport], endingComponents: [
						{kind: Icon, icon: 'arrowlargeup', small: true},
						{kind: Icon, icon: 'arrowlargedown', small: true},
						{kind: Icon, icon: 'arrowlargeleft', small: true},
						{kind: Icon, icon: 'arrowlargeright', small: true}
					], components: [
						{kind: MarqueeText, content: 'Multiple Icons can be used'}
					]
				},
				{kind: Item, mixins: [ItemOverlaySupport], beginningComponents: [
						{kind: Icon, icon: 'arrowextend', small: true}
					], endingComponents: [
						{kind: Icon, icon: 'arrowshrink', small: true}
					], components: [
						{kind: MarqueeText, content: 'Use left and right overlay at the same time'}
					]
				}
			]},
			{classes: 'moon-1v'},
			{kind: Divider, content: 'ItemOverlay Auto Hide Sample'},
			{components: [
				{kind: Item, mixins: [ItemOverlaySupport], autoHideBeginning: true, beginningComponents: [
						{kind: Icon, src: 'assets/icon-list.png', small: true}
					], components: [
						{kind: MarqueeText, content: 'These text are flow when item is getting focused'}
					]
				},
				{kind: Item, mixins: [ItemOverlaySupport], autoHideEnding: true, endingComponents: [
						{kind: Icon, src: 'assets/icon-album.png', small: true}
					], components: [
						{kind: MarqueeText, content: 'These text are flow when item is getting focused'}
					]
				}
			]},
			{classes: 'moon-1v'},
			{kind: Divider, content: 'Combine both autoHide true and false'},
			{components: [
				{kind: Item, mixins: [ItemOverlaySupport], autoHideEnding: true, beginningComponents: [
						{kind: Icon, icon: 'search', small: true}
					], endingComponents: [
						{kind: Icon, icon: 'backward', small: true},
						{kind: Icon, icon: 'play', small: true},
						{kind: Icon, icon: 'forward', small: true}
					], components: [
						{kind: MarqueeText, content: 'Both static and autoHiding ItemOverlays'}
					]
				}
			]}
		]}
	]
});