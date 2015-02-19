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
			headerComponents: {}
		},

		/**
		* @private
		*/
		components: [
			{kind: 'moon.Header', name: 'header', type: 'medium'},
			{name: 'client', classes: 'client'}
		],

		/**
		* @method
		* @private
		*/
		create: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);
				this.titleChanged();
				this.headerComponentsChanged();
			};
		}),

		/**
		* @private
		*/
		titleChanged: function () {
			this.$.header.set('title', this.title);
		},

		/**
		* @private
		*/
		headerComponentsChanged: function () {
			this.$.header.createComponents(this.headerComponents, {owner: this});
		},

		/**
		* @public
		*/
		shouldSkipPostTransition: function () {
			return this._skipPostTransition;
		},

		/**
		* @public
		*/
		postTransition: function () {
			this.createComponents(this.clientComponents);
			this.$.client.render();
			this.$.client.addClass('populated');
			this._skipPostTransition = true;

			if (!enyo.Spotlight.getCurrent()) {
				enyo.Spotlight.spot(this);
			}
		}

	});

})(enyo, this);