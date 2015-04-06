var
	kind = require('enyo/kind');

var
	Item = require('moonstone/Item'),
	Panels = require('moonstone/Panels'),
	Scroller = require('moonstone/Scroller'),
	ToggleButton = require('moonstone/ToggleButton');

module.exports = kind({
	name: 'moon.sample.ActivityPanelsSample',
	classes: 'moon enyo-fit enyo-unselectable',
	components: [
		{name: 'panels', kind: Panels, pattern: 'activity', classes: 'enyo-fit', style: 'z-index: 1000;', brandingSrc: 'assets/default-movie.png', components: [
			{title: 'First Panel', classes: 'moon-7h', titleBelow:'Sub-title', subTitleBelow:'Sub-sub title', headerComponents: [
				{kind: ToggleButton, small:true, content:'Medium', name:'mediumHeaderToggle', ontap: 'typeTapped'},
				{kind: ToggleButton, small:true, content:'Small', name:'smallHeaderToggle', ontap: 'typeTapped'}
			], components: [
				{kind: Scroller, fit:true, components: [
					{kind: Item, content: 'Item One', ontap: 'next1'},
					{kind: Item, content: 'Item Two', ontap: 'next1'},
					{kind: Item, content: 'Item Three', ontap: 'next1'},
					{kind: Item, content: 'Item Four', ontap: 'next1'},
					{kind: Item, content: 'Item Five', ontap: 'next1'},
					{kind: Item, content: 'Item Six', ontap: 'next1'},
					{kind: Item, content: 'Item Seven', ontap: 'next1'},
					{kind: Item, content: 'Item Eight', ontap: 'next1'},
					{kind: Item, content: 'Item Nine', ontap: 'next1'},
					{kind: Item, content: 'Item Eleven', ontap: 'next1'},
					{kind: Item, content: 'Item Twelve', ontap: 'next1'},
					{kind: Item, content: 'Item Thirteen', ontap: 'next1'},
					{kind: Item, content: 'Item Fourteen', ontap: 'next1'},
					{kind: Item, content: 'Item Fifteen', ontap: 'next1'},
					{kind: Item, content: 'Item Sixteen', ontap: 'next1'},
					{kind: Item, content: 'Item Seventeen', ontap: 'next1'},
					{kind: Item, content: 'Item Eighteen', ontap: 'next1'},
					{kind: Item, content: 'Item Nineteen', ontap: 'next1'},
					{kind: Item, content: 'Item Twenty', ontap: 'next1'}
				]}
			]},
			{title: 'Second Panel', defaultSpotlightControl: 'defaultControl', classes: 'moon-7h', joinToPrev: true, components: [
				{kind: Item, content: 'Item One', ontap: 'next2'},
				{kind: Item, content: 'Item Two', ontap: 'next2'},
				{name: 'defaultControl', kind: Item, content: 'Item Three (default focus for panel)', ontap: 'next2'},
				{kind: Item, content: 'Item Four', ontap: 'next2'},
				{kind: Item, content: 'Item Five', ontap: 'next2'}
			]},
			{title: 'Third Panel', classes: 'moon-7h', titleBelow:'Type \'go\' to transition', headerOptions: {inputMode:true}, onInputHeaderChange:'inputChanged', subTitleBelow:'Sub-sub title', components: [
				{kind: Item, content: 'Item One', ontap: 'next3'},
				{kind: Item, content: 'Item Two', ontap: 'next3'},
				{kind: Item, content: 'Item Three', ontap: 'next3'},
				{kind: Item, content: 'Item Four', ontap: 'next3'},
				{kind: Item, content: 'Item Five', ontap: 'next3'}
			]},
			{title: 'Fourth', classes: 'moon-7h', joinToPrev: true, titleBelow:'Sub-title', subTitleBelow:'Sub-sub title', components: [
				{kind: Item, content: 'Item One', ontap: 'next4'},
				{kind: Item, content: 'Item Two', ontap: 'next4'},
				{kind: Item, content: 'Item Three', ontap: 'next4'},
				{kind: Item, content: 'Item Four', ontap: 'next4'},
				{kind: Item, content: 'Item Five', ontap: 'next4'}
			]},
			{title: 'Fifth', classes: 'moon-7h', titleBelow:'Sub-title', subTitleBelow:'Sub-sub title', components: [
				{kind: Item, content: 'Item One', ontap: 'next5'},
				{kind: Item, content: 'Item Two', ontap: 'next5'},
				{kind: Item, content: 'Item Three', ontap: 'next5'},
				{kind: Item, content: 'Item Four', ontap: 'next5'},
				{kind: Item, content: 'Item Five', ontap: 'next5'}
			]},
			{title: 'Sixth Panel with a very long title', classes: 'moon-7h', joinToPrev: true, titleBelow:'Sub-title', subTitleBelow:'Sub-sub title', components: [
				{kind: Item, content: 'Item One', ontap: 'next6'},
				{kind: Item, content: 'Item Two', ontap: 'next6'},
				{kind: Item, content: 'Item Three', ontap: 'next6'},
				{kind: Item, content: 'Item Four', ontap: 'next6'},
				{kind: Item, content: 'Item Five', ontap: 'next6'}
			]},
			{title: 'Seventh', classes: 'moon-7h', titleBelow:'Sub-title', subTitleBelow:'Sub-sub title', components: [
				{kind: Item, content: 'Item One'},
				{kind: Item, content: 'Item Two'},
				{kind: Item, content: 'Item Three'},
				{kind: Item, content: 'Item Four'},
				{kind: Item, content: 'Item Five'}
			]}
		]}
	],
	// custom next handler for each panel to avoid switching from one active panel
	// to another with no visible change for demo
	next1: function(inSender, inEvent) {
		this.$.panels.setIndex(2);
		return true;
	},
	next2: function(inSender, inEvent) {
		this.$.panels.setIndex(2);
		return true;
	},
	next3: function(inSender, inEvent) {
		this.$.panels.setIndex(5);
		return true;
	},
	next4: function(inSender, inEvent) {
		this.$.panels.setIndex(5);
		return true;
	},
	next5: function(inSender, inEvent) {
		this.$.panels.setIndex(7);
		return true;
	},
	next6: function(inSender, inEvent) {
		this.$.panels.setIndex(7);
		return true;
	},
	inputChanged: function(inSender, inEvent) {
		if (inEvent.originator.getValue() == 'go') {
			this.next3();
		}
	},
	typeTapped: function(inSender, inEvent) {
		var i,
			val = inSender.get('value'),
			buttonType = inSender.content.toLowerCase(),
			types = ['large', 'medium', 'small'];

		// If our button was `true`, use that type, otherwise revert to large.
		this.$.panel.set('headerType', val ? buttonType.toLowerCase() : types[0]);
		// Unset all other buttons
		for (i = 0; i < types.length; i++) {
			if (buttonType != types[i] && this.$[types[i] + 'HeaderToggle']) {
				this.$[types[i] + 'HeaderToggle'].set('value', false);
			}
		}
	}
});
