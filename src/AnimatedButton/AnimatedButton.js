/**
* Contains the declaration for the {@link module:moonstone/AnimatedButton~AnimatedButton} kind.
* @wip
* @module moonstone/AnimatedButton
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	util = require('enyo/utils');

var
	Button = require('moonstone/Button'),
	AnimatedButtonSvg = require('./AnimatedButtonSvg');

/**
* {@link module:moonstone/AnimatedButton~AnimatedButton} is a
* {@link module:moonstone/Button~Button} with Moonstone styling applied. The color of the button may
* be customized by specifying a background color.
*
* For more information, see the documentation on
* [Buttons]{@linkplain $dev-guide/building-apps/controls/buttons.html} in the
* Enyo Developer Guide.
*
* @class AnimatedButton
* @extends module:enyo/AnimatedButton~AnimatedButton
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
* @ui
* @wip
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/AnimatedButton~AnimatedButton.prototype */ {

	/**
	* @private
	*/
	name: 'moon.AnimatedButton',

	/**
	* @private
	*/
	kind: Button,

	/**
	* @private
	* @lends module:moonstone/AnimatedButton~AnimatedButton.prototype
	*/
	published: {

		/**
		* The length of time, in milliseconds, that the animation will run.
		*
		* @type {Number}
		* @default 400
		* @public
		*/
		duration: 400
	},

	/**
	* @private
	*/
	classes: 'moon-button-animated',

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocus: 'animateSpotlightFocus',
		onSpotlightBlur: 'animateSpotlightBlur'
	},

	/**
	* @private
	*/
	bindings: [
		{from: 'duration', to: '$.animation.duration'}
	],

	/**
	* @private
	*/
	initComponents: function () {
		// Always add an SVG element, unless one already exists
		this.createChrome([
			{classes: 'moon-button-animated-frame', components: [
				{name: 'animation', kind: AnimatedButtonSvg, onEnd: 'animDone'}
			]}
		]);

		Button.prototype.initComponents.apply(this, arguments);

		if (this.$.client) {
			this.$.client.addClass('button-client');
		} else {
			// No client? Drop all the components into a client frame to keep them safe from evil.
			this.createComponent({name: 'client', classes: 'button-client', isChrome: true});
			var i,
				newClient = this.$.client,
				children = this.getClientControls();
			for (i = 0; i < children.length; i++) {
				children[i].set('container', newClient);
			}
		}
	},

	/**
	* @private
	*/
	animateSpotlightFocus: function () {
		this.$.animation.startFocus();
		util.asyncMethod(this, function () {
			this.removeClass('spotlight');
		});
		this.startJob('textTransition', function () {
			this.addClass('nearly-spotlight');
		}, this.get('duration') / 2);
	},

	/**
	* @private
	*/
	animateSpotlightBlur: function () {
		this.stopJob('textTransition');
		this.removeClass('nearly-spotlight');
		this.$.animation.startBlur();
	},

	/**
	* @private
	*/
	animDone: function (sender, ev) {
		this.addRemoveClass('spotlight', ev.focused);
		this.removeClass('nearly-spotlight');
		return true;
	}
});
