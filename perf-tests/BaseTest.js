var
	kind = require('enyo/kind'),
	Button = require('enyo/Button'),
	Control = require('enyo/Control');

var
	FittableColumns = require('layout/FittableColumns');

var
	FPSMeter = require('./FPSMeter');

module.exports = kind({
	name: 'BaseTest',
	classes: 'enyo-fit moon',
	components: [
		{kind: FittableColumns, noStretch: true, components: [
			{name: 'client', fit: true},
			{kind: Button, content: 'Stop', ontap: 'toggle', style: 'width: 4em;'}
		]},
		{name: 'meter', kind: FPSMeter}
	],
	running: true,
	toggle: function() {
		if (this.running) {
			this.running = false;
			this.$.button.set('content', 'Start');
		} else {
			this.running = true;
			this.$.button.set('content', 'Stop');
			this.nextTest();
		}
	},
	nextTest: function() {
		// Override this in subkinds
	},
	rendered: function() {
		Control.prototype.rendered.apply(this, arguments);
		this.$.meter.run();
		this.nextTest();
	}
});
