var
	kind = require('enyo/kind');

var
	Button = require('moonstone/Button'),
	Drawers = require('moonstone/Drawers'),
	ExpandablePicker = require('moonstone/ExpandablePicker'),
	Item = require('moonstone/Item'),
	Panel = require('moonstone/Panel'),
	Panels = require('moonstone/Panels');
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moons.sample.DrawerSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{
			name: 'drawers',
			kind: Drawers,
			drawers: [
				{
					name: 'partialDrawer',
					open: false,
					controlsOpen: false,
					onActivate: 'partialDrawerChanged',
					onDeactivate: 'partialDrawerChanged',
					handle: {name: 'handleButton', content: 'Partial drawer with long text truncation'},
					components: [
						{kind: Panel, classes: 'enyo-fit', title: 'Partial Drawer', components: [
							{kind: Item, content: 'Item One'},
							{kind: Item, content: 'Item Two'}
						]}
					],
					controlDrawerComponents: [
						{classes: 'moon-hspacing', components: [
							{kind: Button, name: 'openMoreButton', content: 'Open More', ontap: 'openMainDrawer'},
							{kind: Button, content: 'Close', ontap: 'close'}
						]}
					]
				},
				{
					name: 'searchDrawer',
					handle: {content: 'Full drawer'},
					components: [
						{kind: Panel, classes: 'enyo-fit', title: 'Full Drawer', components: [
							{kind: Item, content: 'Item One'},
							{kind: Item, content: 'Item Two'}
						]}
					]
				}
			],
			components: [
				{
					name: 'panels',
					kind: Panels,
					pattern: 'activity',
					classes: 'enyo-fit',
					components: [
						{title: 'First Panel', classes: 'moon-7h', components: [
							{kind: Scroller, horizontal: 'hidden', classes: 'enyo-fill', components: [
								{kind: ExpandablePicker, onChange: 'pickerChangedImg', content: 'Select Image', components: [
									{content: 'Music',value: 'assets/drawer_icon.png'},
									{content: 'LG', value: 'assets/lg.png'},
									{content: 'HTML5', value: 'assets/html5.png'},
									{content: 'CSS3', value: 'assets/css3.png'},
									{content: 'Default', value: '', active: true}
								]},
								{kind: ExpandablePicker, onChange: 'pickerChangedIcon', content: 'Select Icon', components: [
									{content: 'Drawer', value: 'drawer'},
									{content: 'FullScreen', value: 'fullscreen'},
									{content: 'Circle', value: 'circle'},
									{content: 'Stop', value: 'stop'},
									{content: 'Play', value: 'play'},
									{content: 'Pause', value: 'pause'},
									{content: 'Forward', value: 'forward'},
									{content: 'Default', value: '', active: true}
								]},
								{kind: Item, content: 'Item One', ontap: 'next'},
								{kind: Item, content: 'Item Two', ontap: 'next'}
							]}
						]},
						{title: 'Second Panel', classes: 'moon-7h', components: [
							{kind: Item, content: 'Item One', ontap: 'next'},
							{kind: Item, content: 'Item Two', ontap: 'next'},
							{kind: Item, content: 'Item Three', ontap: 'next'},
							{kind: Item, content: 'Item Four', ontap: 'next'},
							{kind: Item, content: 'Item Five', ontap: 'next'}
						]},
						{title: 'Third Panel', classes: 'moon-7h', components: [
							{kind: Item, content: 'Item One', ontap: 'next'},
							{kind: Item, content: 'Item Two', ontap: 'next'},
							{kind: Item, content: 'Item Three', ontap: 'next'},
							{kind: Item, content: 'Item Four', ontap: 'next'},
							{kind: Item, content: 'Item Five', ontap: 'next'}
						]},
						{title: 'Fourth Panel', classes: 'moon-7h', components: [
							{kind: Item, content: 'Item One', ontap: 'next'},
							{kind: Item, content: 'Item Two', ontap: 'next'},
							{kind: Item, content: 'Item Three', ontap: 'next'},
							{kind: Item, content: 'Item Four', ontap: 'next'},
							{kind: Item, content: 'Item Five', ontap: 'next'}
						]},
						{title: 'Fifth Panel', classes: 'moon-7h', components: [
							{kind: Item, content: 'Item One', ontap: 'next'},
							{kind: Item, content: 'Item Two', ontap: 'next'},
							{kind: Item, content: 'Item Three', ontap: 'next'},
							{kind: Item, content: 'Item Four', ontap: 'next'},
							{kind: Item, content: 'Item Five', ontap: 'next'}
						]}
					]
				}
			]
		}
	],
	next: function (sender, event) {
		this.$.panels.next();
		return true;
	},
	openMainDrawer: function () {
		this.$.partialDrawer.setOpen(true);
	},
	close: function () {
		if (this.$.partialDrawer.getOpen()) {
			this.$.partialDrawer.setOpen(false);
		} else {
			this.$.partialDrawer.setControlsOpen(false);
		}
	},
	partialDrawerChanged: function () {
		this.$.openMoreButton.setShowing(!this.$.partialDrawer.getOpen());
	},
	pickerChangedImg:function (sender, event){
		this.$.drawers.set('src', event.selected.value);
	},
	pickerChangedIcon:function (sender, event){
		this.$.drawers.set('icon', event.selected.value);
	}
});