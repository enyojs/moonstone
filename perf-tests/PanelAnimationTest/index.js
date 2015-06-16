var
	kind = require('enyo/kind'),
	ready = require('enyo/ready');

var
	Item = require('moonstone/Item'),
	Panel = require('moonstone/Panel');

var
	BaseTest = require('../BaseTest');

var PanelAnimationTest = kind({
	name: 'PanelAnimationTest',
	kind: BaseTest,
	create: function() {
		BaseTest.prototype.create.apply(this, arguments);
		this.createComponents([
			{name: 'panel', kind: Panel, style: 'width: 500px;', title: 'Panel', onPreTransitionComplete: 'nextTest', onPostTransitionComplete: 'nextTest', components: [
				{kind: Item, style: 'margin-top:20px;', content: 'Item One'},
				{kind: Item, content: 'Item Two'},
				{kind: Item, content: 'Item Three'},
				{kind: Item, content: 'Item Four'},
				{kind: Item, content: 'Item Five'}
			]}
		]);
	},
	shrinking: false,
	grow: function() {
		this.$.panel.growPanel();
	},
	shrink: function() {
		this.$.panel.shrinkPanel();
	},
	nextTest: function() {
		if (this.running) {
			if (this.shrinking) {
				this.grow();
			} else {
				this.shrink();
			}
			this.shrinking = !this.shrinking;
		}
	}
});

ready(function () {
	new PanelAnimationTest().renderInto(document.body);
});