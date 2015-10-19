require('moonstone');

var kind = require('enyo/kind'),
	Control = require('enyo/Control');
	// IconButton = require('moonstone/IconButton');

// IconButton; // dummy placeholder so lint doesn't complain.

var CloseKind = kind({
	name: 'sillyclosex',
	kind: Control,
	classes: 'moon-icon moon-icon-button small moon-silly-close-button',
	content: '&#983049;',
	allowHtml: true,
	spottable: true,
	handlers: {
		onenter: 'spotMe',
		onleave: 'unspotMe'
	},
	visibleChanged: function () {
		this.addRemoveClass('visible', this.visible);
	},
	spotMe: function () {
		this.addClass('spotlight');
	},
	unspotMe: function () {
		this.removeClass('spotlight');
	}
});

var CloseTemplate = {name: 'sillyclosex', kind: CloseKind, ontap: 'destroy', isChrome: true};

/**
* @module moonstone/CloseSupport
*
* @mixin
* @public
*/
var CloseSupport = {

	/**
	* @private
	*/
	name: 'CloseSupport',

	_xShowing: false,

	handlers: {
		onSpotlightFocus: 'showX',
		onSpotlightBlur: 'hideX'
	},

	/**
	* @method
	* @private
	*/
	initComponents: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			if (this.hasSillyCloseButton) {
				this.createComponent(CloseTemplate);
			}
		};
	}),
	showX: function (sender, ev) {
		this.$.sillyclosex.set('visible', true);
	},
	hideX: function (sender, ev) {
		this.$.sillyclosex.set('visible', false);
	}
};

module.exports = {
	kind: CloseKind,
	template: CloseTemplate,
	support: CloseSupport
};
