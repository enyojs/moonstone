/**
* Contains the declaration for the {@link module:moonstone/LightPanel~LightPanel} kind.
* @module moonstone/LightPanel
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Spotlight = require('spotlight');

var
	Header = require('../Header');

/**
* A light-weight panels implementation that has basic support for side-to-side transitions
* between child components.
*
* @class LightPanel
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/LightPanel~LightPanel.prototype */ {

	/**
	* @private
	*/
	name: 'moon.LightPanel',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	classes: 'moon-light-panel',

	/**
	* @private
	*/
	spotlight: 'container',

	/**
	* @private
	* @lends module:moonstone/LightPanel~LightPanel.prototype
	*/
	published: {

		/**
		* The title of this panel.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		title: '',

		/**
		* Components that are part of the header.
		*
		* @type {Object}
		* @default {}
		* @public
		*/
		headerComponents: {},

		/**
		* The amount of time, in milliseconds, to run the fade-in animation for the panel body.
		*
		* @type {Number}
		* @default 500
		* @public
		*/
		clientDuration: 500,

		/**
		* The timing function to be applied to the fade-in animation for the panel body.
		*
		* @type {String}
		* @default 'ease-out'
		* @public
		*/
		clientTimingFunction: 'ease-out',

		/**
		* Facade for the [titleUpperCase]{@link module:moonstone/Header~Header#titleUpperCase} property
		* of the embedded {@link module:moonstone/Header~Header}.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		titleUpperCase: true
	},

	/**
	* @private
	*/
	components: [
		{kind: Header, name: 'header', type: 'medium'},
		{name: 'client', classes: 'client'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'title', to: '$.header.title'},
		{from: 'titleUpperCase', to: '$.header.titleUpperCase'}
	],

	/**
	* @method
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);

		var transValue = 'opacity ' + this.clientDuration + 'ms ' + this.clientTimingFunction;
		this.$.client.applyStyle('-webkit-transition', transValue);
		this.$.client.applyStyle('transition', transValue);

		if (this.headerComponents) {
			var owner = this.hasOwnProperty('headerComponents') ? this.getInstanceOwner() : this;
			this.$.header.createComponents(this.headerComponents, {owner: owner});
		}
	},

	/**
	* This overridable method is called when the panel is the currently active panel.
	*
	* @public
	*/
	activated: function () {},

	/**
	* This overridable method is called when the panel is no longer the currently active panel.
	*
	* @public
	*/
	deactivated: function () {},

	/**
	* This overridable method is called after a transition.
	*
	* @public
	*/
	postTransition: function () {
		if (!this.$.client.children.length) {
			this.createComponents(this.clientComponents);
			this.$.client.render();
			this.$.client.addClass('populated');
		}

		if (!Spotlight.getCurrent()) {
			Spotlight.spot(this);
		}
	}

});
