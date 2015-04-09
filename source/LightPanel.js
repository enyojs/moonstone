(function (enyo, scope) {
	/**
	* A light-weight panels implementation that has basic support for side-to-side transitions
	* between child components.
	*
	* @class moon.LightPanel
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.LightPanel.prototype */ {

		/**
		* @private
		*/
		name: 'moon.LightPanel',

		/**
		* @private
		*/
		kind: 'enyo.Control',

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
		* @lends enyo.LightPanels.prototype
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
			* Facade for the [titleUpperCase]{@link moon.Header#titleUpperCase} property
			* of the embedded {@link moon.Header}.
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
			{kind: 'moon.Header', name: 'header', type: 'medium'},
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
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);

				var transValue = 'opacity ' + this.clientDuration + 'ms ' + this.clientTimingFunction;
				this.$.client.applyStyle('-webkit-transition', transValue);
				this.$.client.applyStyle('transition', transValue);

				if (this.headerComponents) {
					var owner = this.hasOwnProperty('headerComponents') ? this.getInstanceOwner() : this;
					this.$.header.createComponents(this.headerComponents, {owner: owner});
				}
			};
		}),

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

			if (!enyo.Spotlight.getCurrent()) {
				enyo.Spotlight.spot(this);
			}
		}

	});

})(enyo, this);