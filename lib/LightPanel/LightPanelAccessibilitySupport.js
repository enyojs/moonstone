var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	asyncMethod = utils.asyncMethod;

var
	Spotlight = require('spotlight');

var
	$L = require('../i18n'),
	VoiceReadout = require('enyo-webos/VoiceReadout');

/**
* @name LightPanelAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (was, is, prop) {
			sup.apply(this, arguments);
			
			//this.$.header.setAttribute('aria-live', this.accessibilityDisabled ? null : 'off');
		};
	}),
	/**
	* @private
	*/
	postTransition: kind.inherit(function (sup) {
		return function (was, is, prop) {
			
			

			//var current = Spotlight.getCurrent();
			//if (!Spotlight.getCurrent()) {
			//Spotlight.unspot(this);
			//}
			//this.$.header.blur();
			//this.$.header.set('accessibilityLabel', this.$.header.getTitle());
			//Spotlight.spot(this);
			sup.apply(this, arguments);
			//Spotlight.unspot();
			//VoiceReadout.readAlert(this.$.header.getTitle());
			//this.set('accessibilityLabel', this.$.header.getTitle());
			//this.focus();
			//if (!Spotlight.hasCurrent()) {
				//this.$.header.blur();
			//	this.$.header.focus();
				//this.$.header.set('accessibilityLabel', this.$.header.getTitle());
				//this.$.header.focus();
				//this.$.header.setAttribute('aria-live', this.accessibilityDisabled ? null : 'polite');
				//this.$.header.setAttribute('aria-labelledby', this.$.header.$.title.getId());
			//}
		};
	}),

	activated: kind.inherit(function (sup) {
		return function (was, is, prop) {
			
			

			//var current = Spotlight.getCurrent();
			//if (!Spotlight.getCurrent()) {
			//Spotlight.unspot(this);
			//}
			//this.$.header.blur();
			//this.$.header.set('accessibilityLabel', this.$.header.getTitle());
			//Spotlight.spot(this);
			sup.apply(this, arguments);
			asyncMethod( this, function () {
				Spotlight.unspot();
			});
			//Spotlight.unspot();
			//VoiceReadout.readAlert(this.$.header.getTitle());
			//if (!Spotlight.hasCurrent()) {
				//this.$.header.blur();
			//	this.$.header.focus();
				//this.$.header.set('accessibilityLabel', this.$.header.getTitle());
				//this.$.header.focus();
				//this.$.header.setAttribute('aria-live', this.accessibilityDisabled ? null : 'polite');
				//this.$.header.setAttribute('aria-labelledby', this.$.header.$.title.getId());
			//}
		};
	})
};