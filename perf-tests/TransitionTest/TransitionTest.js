var
	kind = require('enyo/kind'),
	ready = require('enyo/ready');

var
	BaseTest = require('../BaseTest');

var TransitionTest = kind({
	name: 'TransitionTest',
	kind: BaseTest,
	create: function() {
		BaseTest.prototype.create.apply(this, arguments);
		this.createComponents([
			{name: 'box', classes: 'a', ontransitionend: 'nextTest'}
		]);
	},
	b: false,
	nextTest: function() {
		if (this.running) {
			this.b = !this.b;
			this.$.box.addRemoveClass('b', this.b);
		}
	}
});

ready(function () {
	new TransitionTest().renderInto(document.body);
});