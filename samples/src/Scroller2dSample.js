var
	kind = require('enyo/kind');

var
	Button = require('moonstone/Button'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.Scroller2dSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components:[
		{
			kind: Scroller,
			classes: 'moon-scroller-sample-2d-scroller enyo-fill',
			components: [
				{style: 'width: 2300px; height: 1300px;', components: [
					{kind: Button, content: 'Button 1'},
					{kind: Button, content: 'Button 2'},
					{kind: Button, content: 'Button 3'},
					{kind: Button, content: 'Button 4'},
					{kind: Button, content: 'Button 5'},
					{kind: Button, content: 'Button 6'},
					{kind: Button, content: 'Button 7'},
					{kind: Button, content: 'Button 8'},
					{kind: Button, content: 'Button 9'},
					{kind: Button, content: 'Button 10'},
					{kind: Button, content: 'Button 11'},
					{kind: Button, content: 'Button 12'}
				]}
			]
		}
	]
});
