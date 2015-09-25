/**
* Contains the declaration for the {@link module:moonstone/LightPanels~LightPanel} kind.
* @module moonstone/LightPanels
*/

var
	kind = require('enyo/kind'),
	LightPanel = require('enyo/LightPanels').Panel,
	States = LightPanel.States;

var
	Spotlight = require('spotlight');

var
	Header = require('../Header');

/**
* A lightweight panels implementation that has basic support for side-to-side transitions
* between child components.
*
* @class LightPanel
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/LightPanels~LightPanel.prototype */ {

	/**
	* @private
	*/
	name: 'moon.LightPanel',

	/**
	* @private
	*/
	kind: LightPanel,

	/**
	* @private
	*/
	classes: 'moon-light-panel',

	/**
	* @private
	*/
	spotlight: 'container',

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
	titleUpperCase: true,

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocus: 'disableSpotlightPlaceholder'
	},

	/**
	* @private
	*/
	components: [
		{kind: Header, name: 'header', type: 'medium', marqueeOnRenderDelay: 1000},
		{name: 'client', classes: 'client'},
		{name: 'spotlightPlaceholder', spotlight: false, style: 'width:0;height:0;'}
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
		LightPanel.prototype.create.apply(this, arguments);

		var transValue = 'opacity ' + this.clientDuration + 'ms ' + this.clientTimingFunction;
		this.$.client.applyStyle('-webkit-transition', transValue);
		this.$.client.applyStyle('transition', transValue);

		if (this.headerComponents) {
			var owner = this.hasOwnProperty('headerComponents') ? this.getInstanceOwner() : this;
			this.$.header.createComponents(this.headerComponents, {owner: owner});
		}
	},

	/**
	* This overridable method is called before a transition.
	*
	* @public
	*/
	preTransition: function () {
		LightPanel.prototype.preTransition.apply(this, arguments);

		var current = Spotlight.getCurrent(),
			currentSpottable = current && Spotlight.isSpottable(current),
			isChild = current && current.isDescendantOf(this);

		this.$.header.stopMarquee();

		this.spotlightDisabled = true; // we do not want to allow 5-way spotting during transition

		// This is highly related to the order in which "preTransition" is fired for the outgoing
		// and the incoming panel. The outgoing panel's method is fired before that of the incoming
		// panel.
		if (this.state == States.ACTIVATING && !currentSpottable) {
			// We spot the dummy element of the incoming panel so that the spotlightDisabled
			// property of the outgoing panel behaves properly (correctly attempts to spot the
			// Spotlight container element of the outgoing panel); if we do not do this, pressing a
			// 5-way key will re-spot an element in the outgoing panel.
			if (!Spotlight.getPointerMode()) {
				this.$.spotlightPlaceholder.spotlight = true;
				Spotlight.spot(this.$.spotlightPlaceholder);
			}
		} else if (this.state == States.DEACTIVATING && (isChild || !currentSpottable)) {
			Spotlight.unspot();
		}
	},

	/**
	* This overridable (or extendable) method is called after a transition.
	*
	* @public
	*/
	postTransition: function () {
		LightPanel.prototype.postTransition.apply(this, arguments);

		if (this.state == States.ACTIVE) this.spotlightDisabled = false;

		if (!this.$.client.children.length) {
			var owner = this.hasOwnProperty('clientComponents') ? this.getInstanceOwner() : this;
			this.createComponents(this.clientComponents, {owner: owner});
			this.$.client.render();
			this.didClientRender();
		}

		if (this.state == States.ACTIVE) {
			this.checkSpottability();
			this.$.header.startMarquee();
		}
	},

	/**
	* @private
	*/
	checkSpottability: function () {
		if (!Spotlight.getPointerMode()) {
			// Now we need to spot a spottable element (other than the dummy element), if it exists.
			var spotlightPlaceholder = this.$.spotlightPlaceholder,
				current = Spotlight.getCurrent();

			spotlightPlaceholder.spotlight = false;
			if (!Spotlight.isSpottable(this)) spotlightPlaceholder.spotlight = true;
			if (!current || current === spotlightPlaceholder) Spotlight.spot(this);
		}
	},

	/**
	* @private
	*/
	disableSpotlightPlaceholder: function (sender, event) {
		if (this.$.spotlightPlaceholder.spotlight && event.originator !== this && event.originator !== this.$.spotlightPlaceholder) {
			this.$.spotlightPlaceholder.spotlight = false;
		}
	},

	/**
	* This overridable (extendable) method is called when the client area has been rendered. This
	* can be used to perform any actions that should occur once the client components, for example,
	* of the {@link module:moonstone/LightPanels~LightPanel} have been created and rendered, such as custom focusing logic.
	*
	* @public
	*/
	didClientRender: function () {
		this.$.client.addClass('populated');
	},

	// Accessibility

	/**
	* @private
	*/
	accessibilityRole: 'region',

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['title', 'accessibilityLabel', 'accessibilityHint'], method: function () {
			var content = this.title,
				prefix = this.accessibilityLabel || content || null,
				label = this.accessibilityHint && prefix && (prefix + ' ' + this.accessibilityHint) ||
						this.accessibilityHint ||
						this.accessibilityLabel ||
						prefix ||
						null;

			this.setAriaAttribute('aria-label', label);
		}}
	],

	/**
	* @private
	*/
	accessibilityLive: 'off'
});

module.exports.States = States;
