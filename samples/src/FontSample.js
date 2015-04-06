var
	kind = require('enyo/kind'),
	Table = require('enyo/Table');

var
	Scroller = require('moonstone/Scroller'),
	Divider = require('moonstone/Divider');

module.exports = kind({
	name: 'moon.sample.FontSample',
	kind: Scroller,
	classes: 'moon enyo-unselectable enyo-fit moon-font-sample',
	components: [
		{kind: Divider, content: 'Latin Font'},
		{kind: Table, components: [
			{classes: 'moon-header-text', components: [
				{content: 'HEADER'},
				{content: '텔레비전'},
				{content: 'M혼I합X된ED'}
			]},
			{classes: 'moon-large-text', components: [
				{content: 'Large Text'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-sub-header-text', components: [
				{content: 'Sub-header'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-large-button-text', components: [
				{content: 'LARGE BUTTON'},
				{content: '텔레비전'},
				{content: 'M혼I합X된ED'}
			]},
			{classes: 'moon-small-button-text', components: [
				{content: 'SMALL BUTTON'},
				{content: '텔레비전'},
				{content: 'M혼I합X된ED'}
			]},
			{classes: 'moon-body-text', components: [
				{content: 'Body Text'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-divider-text', components: [
				{content: 'Divider'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-superscript', components: [
				{content: 'Superscript'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-pre-text', components: [
				{content: 'Pre Text'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]}
		]},
		{tag: 'br'},
		{kind: Divider, content: 'Non-latin Font'},
		{kind: Table, classes: 'enyo-locale-non-latin', components: [
			{classes: 'moon-header-text', components: [
				{content: 'HEADER'},
				{content: '텔레비전'},
				{content: 'M혼I합X된ED'}
			]},
			{classes: 'moon-large-text', components: [
				{content: 'Large Text'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-sub-header-text', components: [
				{content: 'Sub-header'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-large-button-text', components: [
				{content: 'LARGE BUTTON'},
				{content: '텔레비전'},
				{content: 'M혼I합X된ED'}
			]},
			{classes: 'moon-small-button-text', components: [
				{content: 'SMALL BUTTON'},
				{content: '텔레비전'},
				{content: 'M혼I합X된ED'}
			]},
			{classes: 'moon-body-text', components: [
				{content: 'Body Text'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-divider-text', components: [
				{content: 'Divider'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-superscript', components: [
				{content: 'Superscript'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]},
			{classes: 'moon-pre-text', components: [
				{content: 'Pre Text'},
				{content: '텔레비전'},
				{content: 'M혼i합x된ed'}
			]}
		]}
	]
});

// moon-header-text
// moon-superscript
// moon-pre-text
// moon-large-text
// moon-sub-header-text
// moon-divider-text
// moon-body-text
// moon-large-button-text
// moon-small-button-text
