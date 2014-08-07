(function (enyo, scope) {
	/**
	* _moon.BodyText_ is a simple control for displaying body text in an app.  It is
	* designed to align with other text-based controls.
	*
	* @ui
	* @class moon.BodyText
	* @extends enyo.Control
	* @public
	*/
	enyo.kind(
		/** @lends moon.BodyText.prototype */ {

		/**
		* @private
		*/
		name: 'moon.BodyText',

		/**
		* @private
		*/
		classes: 'moon-body-text moon-body-text-spacing moon-body-text-control',

		/**
		*
		* If true, HTML tags are allowed in the control's content
		*
		* @type {Boolean}
		* @default true
		* @memberof moon.BodyText.prototype
		* @public
		*/
		allowHtml: true,

		/**
		* @private
		*/
		published: {

			/**
			* When true, text content is centered; otherwise left-aligned
			*
			* @type {Boolean}
			* @default false
			* @memberof moon.BodyText.prototype
			* @public
			*/
			centered: false
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.centeredChanged();
		},

		/**
		* @private
		*/
		contentChanged: function () {
			this.inherited(arguments);
			this.detectTextDirectionality();
			if (this.hasNode()) { this.bubble('onRequestSetupBounds'); }
		},

		/**
		* @private
		*/
		centeredChanged: function () {
			this.applyStyle('text-align', this.centered ? 'center' : null);
		}
	});

})(enyo, this);
