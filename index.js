'use strict';

var
	platform = require('enyo/platform'),
	dispatcher = require('enyo/dispatcher'),
	gesture = require('enyo/gesture'),
	dom = require('enyo/dom');

var
	option = require('./src/options');

// Support brand theme
if (option.brandTheme) {
	dom.addBodyClass('enyo-brand-theme-' + option.brandTheme);
}

exports = module.exports = option;
exports.version = '2.6.4-rc.17';

// Override the default holdpulse config to account for greater delays between keydown and keyup
// events in Moonstone with certain input devices.
gesture.drag.configureHoldPulse({
	events: [{name: 'hold', time: 400}],
	endHold: 'onLeave'
});

/**
* Registers key mappings for webOS-specific device keys related to media control.
*
* @private
*/
if (platform.webos >= 4) {
	// Table of default keyCode mappings for webOS device
	dispatcher.registerKeyMap({
		415 : 'play',
		413 : 'stop',
		19  : 'pause',
		412 : 'rewind',
		417 : 'fastforward',
		461 : 'back'
	});
}

// ensure that these are registered
require('./src/resolution');
require('./src/fonts');
